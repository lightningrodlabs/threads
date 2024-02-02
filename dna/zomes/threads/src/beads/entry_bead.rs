use hdk::prelude::*;
use time_indexing::convert_timepath_to_timestamp;
use zome_utils::{decode_response, error, get_all_typed_local, get_author, get_typed_from_record, path2anchor};
use threads_integrity::{EntryBead, Bead, ThreadsEntry, ThreadsEntryTypes};
use crate::beads::index_bead;
use crate::notify_peer::{NotifiableEvent, send_inbox_item, SendInboxItemInput, WeaveNotification};

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AddEntryAsBead {
    pub eh: EntryHash,
    pub bead: Bead,
    pub role_name: String,
    pub zome_name: String,
}

/// Other cells must implement a zome function with interface:
///     get_any_record(eh: EntryHash) -> ExternResult<Option<Record>>;
/// Return bead type, Global Time Anchor, bucket time
#[hdk_extern]
pub fn add_entry_as_bead(input: AddEntryAsBead) -> ExternResult<(ActionHash, EntryBead, String, Timestamp, Option<(AgentPubKey, WeaveNotification)>)> {
    debug!("add_any_as_bead() {:?}", input);
    let response = call(
        CallTargetCell::OtherRole(input.role_name.clone()),
        ZomeName::from(input.zome_name.clone()),
        "get_any_record".into(),
        None,
        input.eh.clone())?;
    let maybeRecord: Option<Record> = decode_response(response)?;
    //let maybeRecord = get(input.ah.clone(), GetOptions::content())?;
    let Some(record) = maybeRecord
        else { return error("No record found at given EntryHash")};
    let Some(entry_type) = record.action().entry_type()
        else { return error("No entry found at given EntryHash")};
    let EntryType::App(entry_def) = entry_type
        else { return error("No AppEntryDef found at given EntryHash")};
    let ah_time = record.action().timestamp();
    let bead_type = format!("{}::{}", entry_def.zome_index, entry_def.entry_index.0);
    let entryBead = EntryBead {
        bead: input.bead.clone(),
        from_role: input.role_name,
        from_zome: input.zome_name,
        eh: input.eh,
        sub_type: bead_type.clone(),

    };
    let ah = create_entry(ThreadsEntry::EntryBead(entryBead.clone()))?;
    let tp_pair = index_bead(entryBead.bead.clone(), ah.clone(), "EntryBead"/*&bead_type*/, ah_time)?;
    let bucket_time = convert_timepath_to_timestamp(tp_pair.1.path.clone())?;
    /// Reply
    let mut maybe_notif = None;
    if let Some(reply_ah) = input.bead.maybe_reply_of_ah.clone() {
        let reply_author = get_author(&reply_ah.clone().into())?;
        let maybe= send_inbox_item(SendInboxItemInput {content: ah.clone().into(), who: reply_author.clone(), event: NotifiableEvent::Reply})?;
        if let Some((_link_ah, notif)) = maybe {
            maybe_notif = Some((reply_author, notif));
        }
    }
    ///
    Ok((ah, entryBead, path2anchor(&tp_pair.1.path).unwrap(), bucket_time, maybe_notif))
}


/// WARN Will return actual action creation time and not devtest_timestamp
#[hdk_extern]
pub fn get_entry_bead(bead_ah: ActionHash) -> ExternResult<(Timestamp, AgentPubKey, EntryBead)> {
    //let fn_start = sys_time()?;
    let res = match get(bead_ah.clone(), GetOptions::content())? {
        Some(record) => {
            let action = record.action().clone();
            let Ok(typed) = get_typed_from_record::<EntryBead>(record)
                else { return error("get_entry_bead(): Entry not an EntryBead") };
            Ok((action.timestamp(), action.author().to_owned(), typed))
        }
        None => error("get_entry_bead(): Entry not found"),
    };
    //let fn_end = sys_time()?;
    //debug!("GET TIME: {:?} ms", (fn_end.0 - fn_start.0) / 1000);
    res
}


///
#[hdk_extern]
pub fn get_many_entry_beads(ahs: Vec<ActionHash>) -> ExternResult<Vec<(Timestamp, AgentPubKey, EntryBead)>> {
    return ahs.into_iter().map(|ah| get_entry_bead(ah)).collect();
}


/// Get all EntryBeads in local source-chain
/// WARN Will return actual action creation time and not devtest_timestamp
#[hdk_extern]
pub fn query_entry_beads(_: ()) -> ExternResult<Vec<(Timestamp, ActionHash, EntryBead)>> {
    let entry_type = EntryType::App(ThreadsEntryTypes::EntryBead.try_into().unwrap());
    let tuples = get_all_typed_local::<EntryBead>(entry_type)?;
    let res = tuples.into_iter().map(|(ah, create_action, typed)| {
        (create_action.timestamp, ah, typed)
    }).collect();
    Ok(res)
}

use hdk::prelude::*;
use threads_integrity::{THREADS_DEFAULT_COORDINATOR_ZOME_NAME, ThreadsLinkType};
use crate::signals::WeaveSignal;
use strum_macros::FromRepr;

///
#[derive(Serialize, Deserialize, SerializedBytes, Debug, Clone, PartialEq, FromRepr)]
#[repr(u8)]
pub enum NotifiableEvent {
    Mention, // Another agent mentionned you in a textMessage ; Title is
    Reply, // Another agent replied to one of your bead
    Fork, // Another agent created a thread off of some entry you own
    Dm, // Another agent sent you a private bead to your agentPubKey
}
impl From<NotifiableEvent> for u8 {
    fn from(m: NotifiableEvent) -> u8 {
        m as u8
    }
}

///
#[derive(Serialize, Deserialize, SerializedBytes, Debug)]
pub struct WeaveNotification {
    event: NotifiableEvent,
    author: AgentPubKey,
    timestamp: Timestamp,
    //title: String,
    link_ah: ActionHash,
    content: AnyLinkableHash,
}


/// Input to the notify call
#[derive(Serialize, Deserialize, SerializedBytes, Debug)]
#[serde(rename_all = "camelCase")]
pub struct NotifyPeerInput {
    pub payload: WeaveSignal,
    pub peer: AgentPubKey,
}


///
#[hdk_extern]
fn notify_peer(input: NotifyPeerInput) -> ExternResult<()> {
    debug!("Notifying {:?} to {}", input.payload, input.peer);
    call_remote(
        input.peer,
        THREADS_DEFAULT_COORDINATOR_ZOME_NAME,
        "recv_notification".into(),
        None,
        ExternIO::encode(input.payload).unwrap(),
    )?;
    Ok(())
}


///
#[ignore(zits)]
#[hdk_extern]
fn recv_notification(signal: ExternIO) -> ExternResult<()> {
    let sig: WeaveSignal = signal.decode().unwrap();
    debug!("Received notification {:?}", sig);
    let _ = emit_signal(&sig)?;
    Ok(())
}


///
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct AnnounceInput {
    pub content: AnyLinkableHash,
    pub who: AgentPubKey,
    pub event: NotifiableEvent,
}


#[hdk_extern]
pub fn send_inbox_item(input: AnnounceInput) -> ExternResult<ActionHash> {
    let repr: u8 = input.event.into();
    let link_ah = create_link(input.who, input.content.clone(), ThreadsLinkType::Inbox, LinkTag::from(vec![repr]))?;
    Ok(link_ah)
}


/// Returns vec of: LinkCreateActionHash, AuthorPubKey, TextMessageActionHash
#[hdk_extern]
pub fn probe_inbox(_ : ()) -> ExternResult<Vec<WeaveNotification>> {
    let me = agent_info()?.agent_latest_pubkey;
    let links = get_links(me, ThreadsLinkType::Inbox, None)?;
    let mut res = Vec::new();
    for link in links {
        let repr: u8 = link.tag.into_inner()[0];
        let notif = WeaveNotification {
            event: NotifiableEvent::from_repr(repr).unwrap(),
            author: link.author,
            timestamp: link.timestamp,
            link_ah: link.create_link_hash,
            content: link.target,
        };
        res.push(notif);
    }
    Ok(res)
}


/// FIXME: Make sure its a mention link
#[hdk_extern]
pub fn delete_inbox_item(link_ah : ActionHash) -> ExternResult<()> {
    let _ = delete_link(link_ah)?;
    Ok(())
}
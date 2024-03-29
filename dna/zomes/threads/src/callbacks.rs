use hdk::prelude::*;
//use zome_utils::*;


#[hdk_extern]
pub fn init(_: ()) -> ExternResult<InitCallbackResult> {
   let mut fns = BTreeSet::new();
   fns.insert((zome_info()?.name, FunctionName("recv_remote_signal".into())));
   fns.insert((zome_info()?.name, FunctionName("recv_notification".into())));
   let cap_grant_entry: CapGrantEntry = CapGrantEntry::new(
      String::from("remote signals & notification"), // A string by which to later query for saved grants.
      ().into(), // Unrestricted access means any external agent can call the extern
      GrantedFunctions::Listed(fns),
   );
   create_cap_grant(cap_grant_entry)?;

   Ok(InitCallbackResult::Pass)
}

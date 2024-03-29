use hdk::hdi::prelude::DnaHash;
use hdk::prelude::*;
use crate::participation_protocols::get_applet_tp;
use zome_utils::*;

use crate::subjects::get_subjects_by_type::{get_subjects_by_type, GetProtocolsInput};


///
#[hdk_extern]
pub fn get_subjects_for_applet(applet_id: String) -> ExternResult<Vec<(DnaHash, AnyLinkableHash)>> {
  std::panic::set_hook(Box::new(zome_panic_hook));
  if applet_id.is_empty() {
    return error("Empty applet_id");
  }
  let tp = get_applet_tp(applet_id.clone())?;
  let children = tp_children_paths(&tp)?;
  debug!("get_subjects_for_dna() found {} children", children.len());
  let mut input = GetProtocolsInput { applet_id, subject_type: "".to_string() };
  let mut res = Vec::new();
  for child_tp in children {
    input.subject_type = String::try_from(child_tp.leaf().unwrap()).unwrap();
    let mut ahs = get_subjects_by_type(input.clone()).unwrap();
    res.append(&mut ahs);
  }
  Ok(res)
}


/// Returns list of SubjectTypes and their PathEntryHash
#[hdk_extern]
pub fn get_subject_types_for_applet(applet_id: String) -> ExternResult<Vec<(String, EntryHash)>> {
  std::panic::set_hook(Box::new(zome_panic_hook));
  if applet_id.is_empty() {
    return error("Empty applet_id");
  }
  let tp = get_applet_tp(applet_id.clone())?;
  let children = tp_children_paths(&tp)?;
  debug!("get_subject_types_for_dna() found {} children", children.len());
  let leafs = children.into_iter()
    .map(|tp| (tp.leaf().unwrap().try_into().unwrap(), tp.path.path_entry_hash().unwrap()))
    .collect();
  Ok(leafs)
}


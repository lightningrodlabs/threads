use hdk::{
  hash_path::path::{TypedPath},
  prelude::*,
};
use hdk::prelude::holo_hash::{ActionHashB64, holo_hash_encode};
use threads_integrity::*;
use crate::path_explorer::{LeafLink, path2str, tag2str};
use crate::threads::add_bead::index_bead;
use crate::time_indexing::time_index::get_latest_time_indexed_links;
use crate::time_indexing::timepath_utils::get_time_path;


#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetLatestBeadsInput {
  pp_ah: ActionHash,
  start_time: Option<Timestamp>,
  target_count: usize,
}


#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BeadLink {
  bead_ah: ActionHash,
  bead_type: String,
}


///
#[hdk_extern]
pub fn get_latest_beads(input: GetLatestBeadsInput) -> ExternResult<Vec<BeadLink>> {
  let pp_ahB64_str: String = holo_hash_encode(input.pp_ah.clone().get_raw_39());

  let start = input.start_time.unwrap_or(Timestamp::HOLOCHAIN_EPOCH); // FIXME use dna_info.origin_time
  debug!("get_latest_beads() pp_ahB64_str = {} | start = {}", pp_ahB64_str, start);

  let root_tp = Path::from(pp_ahB64_str).typed(ThreadsLinkType::BeadTimePath)?;
  let links = get_latest_time_indexed_links(root_tp, start, sys_time()?, input.target_count, None)?;
  debug!("get_latest_beads() links.len = {}", links.len());

  let res = links.into_iter()
                 .map(|link| {
                   BeadLink {
                     bead_ah: ActionHash::from(link.target),
                     bead_type: tag2str(&link.tag).unwrap(),
                   }
                 })
                 .collect();
  Ok(res)
}

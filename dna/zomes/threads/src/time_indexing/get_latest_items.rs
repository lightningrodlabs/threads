use hdk::{
  hash_path::path::{TypedPath},
  prelude::*,
};
use threads_integrity::*;
use crate::path_explorer::*;
use crate::time_indexing::time_index::get_latest_time_indexed_links;


///
#[hdk_extern]
pub fn get_latest_items(_ : ()) -> ExternResult<Vec<LeafLink>> {
  let root_tp = Path::from(GLOBAL_TIME_INDEX).typed(ThreadsLinkType::GlobalTimePath)?;
  let links = get_latest_time_indexed_links(root_tp, Timestamp::HOLOCHAIN_EPOCH, sys_time()?, 20, None)?;
  debug!("get_latest_entries() links.len = {}\n\n", links.len());
  let res = links.into_iter()
                 .map(|link| {
                   LeafLink {
                     index: link.link_type.0,
                     target: link.target.as_ref().to_vec(),
                     tag: link.tag.as_ref().to_vec(),
                   }
                 })
                 .collect();
  Ok(res)
}
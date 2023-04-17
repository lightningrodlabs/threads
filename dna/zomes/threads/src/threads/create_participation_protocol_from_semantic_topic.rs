use hdk::hash_path::path::DELIMITER;
use hdk::prelude::*;
use holo_hash::DnaHashB64;
use zome_utils::*;
use threads_integrity::*;
use crate::path_explorer::path2str;
use crate::threads::prefix_threads_path;


/// Creates the SemanticTopic
#[hdk_extern]
pub fn create_participation_protocol_from_semantic_topic(pp: ParticipationProtocol) -> ExternResult<ActionHash> {
  if let TopicType::SemanticTopic = pp.topic_type {
  } else {
    return zome_error!("create_participation_protocol_from_semantic_topic() error: ParticipationProtocol is not for a semantic topic. TopicType is {:?}", pp.topic_type);
  }
  let dna_info = dna_info()?;
  let dna_hash: DnaHashB64 = dna_info.hash.into();

  let ah = create_entry(ThreadsEntry::ParticipationProtocol(pp.clone()))?;

  let tp = prefix_threads_path(dna_hash, Some(COMPONENT_SEMANTIC_TOPIC_THREADS))?;
  tp.ensure()?;

  /// Global Threads Index
  debug!("create_participation_protocol_from_semantic_topic(): {} --> {}", path2str(&tp.path).unwrap(), ah);
  create_link(
    tp.path_entry_hash()?,
    ah.clone(),
    ThreadsLinkType::Protocols,
    LinkTag::new(vec![]),
  )?;

  /// Link from Entry/Topic to Protocol
  create_link(
    pp.topic_hash,
    ah.clone(),
    ThreadsLinkType::Threads,
    LinkTag::new(vec![]),
  )?;

  /// Global time-Index
  // FIXME

  /// Done
  Ok(ah)
}
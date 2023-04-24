use hdk::prelude::*;
use zome_utils::*;
use threads_integrity::*;
use crate::participation_protocols::*;
use crate::path_explorer::*;
use crate::time_indexing::timepath_utils::get_time_path;


/// Creates the SemanticTopic
#[hdk_extern]
pub fn create_pp_from_semantic_topic(pp: ParticipationProtocol) -> ExternResult<ActionHash> {
  if let TopicType::SemanticTopic = pp.topic_type {
  } else {
    return zome_error!("create_pp_from_semantic_topic() error: ParticipationProtocol is not for a semantic topic. TopicType is {:?}", pp.topic_type);
  }

  let dna_info = dna_info()?;

  return create_pp(pp, dna_info.hash, SEMANTIC_TOPIC_TYPE_NAME);
}


///
pub fn create_pp(pp: ParticipationProtocol, dna_hash: DnaHash, entry_type_name: &str) -> ExternResult<ActionHash> {

  let pp_entry = ThreadsEntry::ParticipationProtocol(pp.clone());
  let pp_ah = create_entry(pp_entry)?;
  //let pp_eh = hash_entry(pp_entry)?;

  /// Global Threads Index
  let (tp, ehb64) = get_subject_tp(dna_hash, entry_type_name, pp.topic_hash.clone())?;
  tp.ensure()?;
  debug!("create_pp_from_semantic_topic(): {} --> {}", path2anchor(&tp.path).unwrap(), pp_ah);
  let ta = TypedAnchor::try_from(&tp).expect("Should hold a TypedAnchor");

  /// Link from Subject TypePath to Protocol
  create_link(
    tp.path_entry_hash()?,
    pp_ah.clone(),
    ThreadsLinkType::Protocols,
    LinkTag::new(vec![]),
    // str2tag(&ehb64), // Store Subject Hash in Tag
  )?;
  /// Link from Subject Hash to Protocol
  create_link(
    pp.topic_hash,
    pp_ah.clone(),
    ThreadsLinkType::Threads,
    str2tag(&ta.anchor), // Store Anchor in Tag
  )?;

  /// Global time-Index
  let record = get(pp_ah.clone(), GetOptions::content())?.unwrap();
  let root_time_path = Path::from(GLOBAL_TIME_INDEX)
    .typed(ThreadsLinkType::GlobalTimePath)?;
  let leaf_tp = get_time_path(root_time_path.clone(), record.action().timestamp())?;
  leaf_tp.ensure()?;
  create_link(
    leaf_tp.path_entry_hash()?,
    pp_ah.clone(),
    ThreadsLinkType::Protocols,
    LinkTag::new(vec![]),
  )?;
  debug!("Thread indexed at:\n  - {}", path2anchor(&leaf_tp.path).unwrap());

  /// Done
  Ok(pp_ah)
}
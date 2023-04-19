/* This file is generated by zits. Do not edit manually */

import {THREADS_ZOME_NAME, ROOT_ANCHOR_SEMANTIC_TOPICS, ROOT_ANCHOR_THREADS, COMPONENT_SEMANTIC_TOPIC_THREADS, GLOBAL_TIME_INDEX, ThreadsEntry, ThreadsLinkType, TopicType, GetLeafsInput, LeafLink, TypedAnchor, GetLatestBeadsInput, BeadLink, GetProtocolsInput, Bead, TextMessage, SemanticTopic, ParticipationProtocol, GlobalQueryLog, ThreadQueryLog, } from './threads.types';
import {
/** types.ts */
HoloHash,
AgentPubKey,
DnaHash,
WasmHash,
EntryHash,
ActionHash,
AnyDhtHash,
KitsuneAgent,
KitsuneSpace,
HoloHashB64,
AgentPubKeyB64,
DnaHashB64,
WasmHashB64,
EntryHashB64,
ActionHashB64,
AnyDhtHashB64,
InstalledAppId,
Signature,
CellId,
DnaProperties,
RoleName,
Timestamp,
Duration,
HoloHashed,
NetworkInfo,
FetchQueueInfo,
/** hdk/action.ts */
SignedActionHashed,
ActionHashed,
ActionType,
Action,
NewEntryAction,
Dna,
AgentValidationPkg,
InitZomesComplete,
CreateLink,
DeleteLink,
OpenChain,
CloseChain,
Update,
Delete,
Create,
/** hdk/capabilities.ts */
CapSecret,
CapClaim,
ZomeCallCapGrant,
CapAccess,
CapGrant,
GrantedFunctionsType,
///** hdk/countersigning.ts */
//CounterSigningSessionData,
//PreflightRequest,
//CounterSigningSessionTimes,
//ActionBase,
//CounterSigningAgents,
//PreflightBytes,
//Role,
//CountersigningAgentState,
/** hdk/dht-ops.ts */
DhtOpType,
DhtOp,
getDhtOpType,
getDhtOpAction,
getDhtOpEntry,
getDhtOpSignature,
/** hdk/entry.ts */
EntryVisibility,
AppEntryDef,
EntryType,
EntryContent,
Entry,
/** hdk/record.ts */
Record as HcRecord,
RecordEntry as HcRecordEntry,
/** api/admin/types.ts */
InstalledAppInfoStatus,
StemCell,
ProvisionedCell,
ClonedCell,
CellType,
CellInfo,
AppInfo,
MembraneProof,
FunctionName,
ZomeName,
ZomeDefinition,
IntegrityZome,
CoordinatorZome,
DnaDefinition,
ResourceBytes,
ResourceMap,
CellProvisioningStrategy,
CellProvisioning,
DnaVersionSpec,
DnaVersionFlexible,
AppRoleDnaManifest,
AppRoleManifest,
AppManifest,
AppBundle,
AppBundleSource,
NetworkSeed,
ZomeLocation,
   } from '@holochain/client';

import {
/** Common */
DhtOpHashB64,
DhtOpHash,
/** DnaFile */
DnaFile,
DnaDef,
Zomes,
WasmCode,
/** entry-details */
EntryDetails,
RecordDetails,
Details,
DetailsType,
EntryDhtStatus,
/** Validation */
ValidationStatus,
ValidationReceipt,
   } from '@holochain-open-dev/core-types';

import {ZomeProxy} from '@ddd-qc/lit-happ';
import {threadsFunctionNames} from './threads.fn';

/**
 *
 */
export class ThreadsProxy extends ZomeProxy {
  static readonly DEFAULT_ZOME_NAME = "zThreads"
  static readonly FN_NAMES = threadsFunctionNames
 


  async getAllLeafLinksFromAnchor(anchor: string): Promise<LeafLink[]> {
    return this.call('get_all_leaf_links_from_anchor', anchor);
  }

  async getAllLeafLinksFromHash(dh: AnyDhtHash): Promise<LeafLink[]> {
    return this.call('get_all_leaf_links_from_hash', dh);
  }

  async getAllRootAnchors(): Promise<TypedAnchor[]> {
    return this.call('get_all_root_anchors', null);
  }

  async getAllSubAnchors(anchor: string): Promise<TypedAnchor[]> {
    return this.call('get_all_sub_anchors', anchor);
  }

  async getLeafAnchors(ta: TypedAnchor): Promise<TypedAnchor[]> {
    return this.call('get_leaf_anchors', ta);
  }

  async getLeafs(input: GetLeafsInput): Promise<LeafLink[]> {
    return this.call('get_leafs', input);
  }

  async createSemanticTopic(semanticTopic: SemanticTopic): Promise<ActionHash> {
    return this.call('create_semantic_topic', semanticTopic);
  }

  async getAllSemanticTopics(): Promise<[ActionHash, EntryHash, string][]> {
    return this.call('get_all_semantic_topics', null);
  }

  async searchSemanticTopics(titleFilter: string): Promise<[ActionHash, EntryHash, string][]> {
    return this.call('search_semantic_topics', titleFilter);
  }

  async addTextMessage(texto: TextMessage): Promise<string> {
    return this.call('add_text_message', texto);
  }

  async createParticipationProtocolFromSemanticTopic(pp: ParticipationProtocol): Promise<ActionHash> {
    return this.call('create_participation_protocol_from_semantic_topic', pp);
  }

  async getLatestBeads(input: GetLatestBeadsInput): Promise<BeadLink[]> {
    return this.call('get_latest_beads', input);
  }

  async getThreads(lh: AnyDhtHash): Promise<ActionHash[]> {
    return this.call('get_threads', lh);
  }

  async getProtocolsForAppEntryType(input: GetProtocolsInput): Promise<ActionHash[]> {
    return this.call('get_protocols_for_app_entry_type', input);
  }

  async getProtocolsForApp(dnaHash: DnaHashB64): Promise<ActionHash[]> {
    return this.call('get_protocols_for_app', dnaHash);
  }

  async getProtocol(ah: ActionHash): Promise<ParticipationProtocol> {
    return this.call('get_protocol', ah);
  }

  async getLatestItems(): Promise<LeafLink[]> {
    return this.call('get_latest_items', null);
  }
}

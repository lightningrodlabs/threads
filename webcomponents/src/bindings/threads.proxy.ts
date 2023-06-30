/* This file is generated by zits. Do not edit manually */

import {THREADS_ZOME_NAME, ROOT_ANCHOR_SEMANTIC_TOPICS, ROOT_ANCHOR_SUBJECTS, SEMANTIC_TOPIC_TYPE_NAME, GLOBAL_TIME_INDEX, PP_ITEM_TYPE, DirectMessage, ThreadsEntry, ThreadsLinkType, SweepResponse, SweepInterval, TimedItemTag, ItemLink, MyLinkFilter, GetItemsInput, TypedAnchor, GetLatestBeadsInput, BeadLink, AddTextMessageAtInput, AddManyTextMessageAtInput, ProbeAllLatestOutput, CreatePpInput, SignalPayload, NotifyInput, Subject, GetProtocolsInput, Bead, TextMessage, GlobalLastProbeLog, ThreadLastProbeLog, SemanticTopic, ParticipationProtocol, } from './threads.types';
import {
/** types.ts */
HoloHash,
AgentPubKey,
DnaHash,
WasmHash,
EntryHash,
ActionHash,
AnyDhtHash,
ExternalHash,
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
InstalledCell,
Timestamp,
Duration,
HoloHashed,
NetworkInfo,
FetchPoolInfo,
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
GrantedFunctionsType,
GrantedFunctions,
ZomeCallCapGrant,
CapAccess,
CapGrant,
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
DeactivationReason,
DisabledAppReason,
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
 
  async getAllRootAnchors(zomeName: string): Promise<TypedAnchor[]> {
    return this.call('get_all_root_anchors', zomeName);
  }

  async getItems(input: GetItemsInput): Promise<ItemLink[]> {
    return this.call('get_items', input);
  }

  async getAllItems(leafAnchor: string): Promise<ItemLink[]> {
    return this.call('get_all_items', leafAnchor);
  }

  async getAllItemsFromB64(b64: Uint8Array): Promise<ItemLink[]> {
    return this.call('get_all_items_from_b64', b64);
  }

  async getLeafAnchors(ta: TypedAnchor): Promise<TypedAnchor[]> {
    return this.call('get_leaf_anchors', ta);
  }

  async getTypedAnchor(anchor: string): Promise<[EntryHashB64, TypedAnchor | null]> {
    return this.call('get_typed_anchor', anchor);
  }

  async getTypedChildren(parentTa: TypedAnchor): Promise<TypedAnchor[]> {
    return this.call('get_typed_children', parentTa);
  }

  async getAllBeads(ppAh: ActionHash): Promise<[SweepInterval, BeadLink[]]> {
    return this.call('get_all_beads', ppAh);
  }

  async getLatestBeads(input: GetLatestBeadsInput): Promise<[SweepInterval, BeadLink[]]> {
    return this.call('get_latest_beads', input);
  }

  async queryTextMessages(): Promise<[Timestamp, ActionHash, TextMessage][]> {
    return this.call('query_text_messages', null);
  }

  async getTextMessage(ah: ActionHash): Promise<[Timestamp, AgentPubKey, TextMessage]> {
    return this.call('get_text_message', ah);
  }

  async getManyTextMessage(ahs: ActionHash[]): Promise<[Timestamp, AgentPubKey, TextMessage][]> {
    return this.call('get_many_text_message', ahs);
  }

  async addTextMessage(texto: TextMessage): Promise<[ActionHash, string, Timestamp]> {
    return this.call('add_text_message', texto);
  }

  async addTextMessageAt(input: AddTextMessageAtInput): Promise<[ActionHash, string]> {
    return this.call('add_text_message_at', input);
  }

  async addManyTextMessageAt(input: AddManyTextMessageAtInput): Promise<[ActionHash, string, Timestamp][]> {
    return this.call('add_many_text_message_at', input);
  }

  async getLatestItems(): Promise<SweepResponse> {
    return this.call('get_latest_items', null);
  }

  async getGlobalLog(): Promise<GlobalLastProbeLog> {
    return this.call('get_global_log', null);
  }

  async commitGlobalLog(maybeLastKnownPpAh: ActionHash): Promise<Timestamp> {
    return this.call('commit_global_log', maybeLastKnownPpAh);
  }

  async queryGlobalLog(): Promise<[Timestamp, GlobalLastProbeLog][]> {
    return this.call('query_global_log', null);
  }

  async probeAllLatest(beginTime: Timestamp): Promise<ProbeAllLatestOutput> {
    return this.call('probe_all_latest', beginTime);
  }

  async getThreadLog(eh: EntryHash): Promise<ThreadLastProbeLog> {
    return this.call('get_thread_log', eh);
  }

  async commitThreadLog(tql: ThreadLastProbeLog): Promise<ActionHash> {
    return this.call('commit_thread_log', tql);
  }

  async queryThreadLogs(): Promise<ThreadLastProbeLog[]> {
    return this.call('query_thread_logs', null);
  }



  async createParticipationProtocol(input: CreatePpInput): Promise<[ActionHash, Timestamp]> {
    return this.call('create_participation_protocol', input);
  }

  async getPpsFromSubjectHash(lh: Uint8Array): Promise<[ActionHash, Timestamp][]> {
    return this.call('get_pps_from_subject_hash', lh);
  }

  async getPpsFromSubjectAnchor(anchor: string): Promise<[ActionHash, Timestamp][]> {
    return this.call('get_pps_from_subject_anchor', anchor);
  }

  async queryPps(): Promise<[Timestamp, ActionHash, ParticipationProtocol][]> {
    return this.call('query_pps', null);
  }

  async getPp(ah: ActionHash): Promise<[ParticipationProtocol, Timestamp]> {
    return this.call('get_pp', ah);
  }

  async createSemanticTopic(semanticTopic: SemanticTopic): Promise<EntryHash> {
    return this.call('create_semantic_topic', semanticTopic);
  }

  async getAllSemanticTopics(): Promise<[EntryHash, string][]> {
    return this.call('get_all_semantic_topics', null);
  }

  async searchSemanticTopics(titleFilter: string): Promise<[EntryHash, string][]> {
    return this.call('search_semantic_topics', titleFilter);
  }

  async getTopic(eh: EntryHash): Promise<SemanticTopic> {
    return this.call('get_topic', eh);
  }

  async querySemanticTopics(): Promise<[Timestamp, EntryHash, SemanticTopic][]> {
    return this.call('query_semantic_topics', null);
  }


  async notifyPeers(input: NotifyInput): Promise<void> {
    return this.call('notify_peers', input);
  }

  async getAllSubjects(): Promise<Subject[]> {
    return this.call('get_all_subjects', null);
  }

  async getApplets(): Promise<EntryHash[]> {
    return this.call('get_applets', null);
  }

  async getSubjectsByType(input: GetProtocolsInput): Promise<[DnaHash, Uint8Array][]> {
    return this.call('get_subjects_by_type', input);
  }

  async getSubjectsForApplet(appletId: EntryHash): Promise<[DnaHash, Uint8Array][]> {
    return this.call('get_subjects_for_applet', appletId);
  }

  async getSubjectTypesForApplet(appletId: EntryHash): Promise<[string, EntryHash][]> {
    return this.call('get_subject_types_for_applet', appletId);
  }
}

/* This file is generated by zits. Do not edit manually */

import {THREADS_ZOME_NAME, ThreadsEntry, ThreadsLinkType, TopicType, GetProtocolsInput, Bead, TextMessage, SemanticTopic, ParticipationProtocol, GlobalQueryLog, ThreadQueryLog, } from './threads.types';
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
 
  async createParticipationProtocolFromSemanticTopic(pp: ParticipationProtocol): Promise<ActionHash> {
    return this.call('create_participation_protocol_from_semantic_topic', pp);
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

  async getAllRootAnchors(): Promise<[number, string][]> {
    return this.call('get_all_root_anchors', null);
  }

  async getAnchorChildren(anchor: string): Promise<[number, string][]> {
    return this.call('get_anchor_children', anchor);
  }

  async createSemanticTopic(semanticTopic: SemanticTopic): Promise<ActionHash> {
    return this.call('create_semantic_topic', semanticTopic);
  }

  async searchSemanticTopics(titleFilter: string): Promise<[ActionHash, EntryHash, string][]> {
    return this.call('search_semantic_topics', titleFilter);
  }

  async getAllSemanticTopics(): Promise<[ActionHash, EntryHash, string][]> {
    return this.call('get_all_semantic_topics', null);
  }
}

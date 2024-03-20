/* This file is generated by zits. Do not edit manually */

import {AUTHORSHIP_DEFAULT_COORDINATOR_ZOME_NAME, AUTHORSHIP_DEFAULT_INTEGRITY_ZOME_NAME, AUTHORSHIP_DEFAULT_ROLE_NAME, ROOT_ANCHOR_AUTHORSHIP, ROOT_ANCHOR_UNKNOWN_AUTHOR, AuthorshipEntry, AuthorshipLinkType, AscribeTargetInput, AuthorshipLog, Bogus, } from './authorship.types';
import {
WebsocketConnectionOptions,
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
RegisterAgentActivity,
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
CapAccessType,
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
/** hdk/link.ts */
AnyLinkableHash,
ZomeIndex,
LinkType,
LinkTag,
RateWeight,
RateBucketId,
RateUnits,
Link,
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
//DnaHashB64, (duplicate)
//AnyDhtHashB64, (duplicate)
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
import {authorshipFunctionNames} from './authorship.fn';

/**
 *
 */
export class AuthorshipProxy extends ZomeProxy {
  static readonly DEFAULT_ZOME_NAME = "zAuthorship"
  static readonly FN_NAMES = authorshipFunctionNames
 
  async ascribeTarget(input: AscribeTargetInput): Promise<void> {
    return this.call('ascribe_target', input);
  }

  async ascribeAppEntry(ah: ActionHash): Promise<[Timestamp, AgentPubKey, string]> {
    return this.call('ascribe_app_entry', ah);
  }

  async getAllAscribedTypes(): Promise<string[]> {
    return this.call('get_all_ascribed_types', null);
  }

  async getAuthor(target: AnyLinkableHash): Promise<[Timestamp, AgentPubKey] | null> {
    return this.call('get_author', target);
  }

  async getAllAscribedEntries(): Promise<[string, AnyLinkableHash, Timestamp, AgentPubKey][]> {
    return this.call('get_all_ascribed_entries', null);
  }

  async getAscribedTypeChildren(targetType: string): Promise<[AnyLinkableHash, Timestamp, AgentPubKey][]> {
    return this.call('get_ascribed_type_children', targetType);
  }


}

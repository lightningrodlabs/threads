/* This file is generated by zits. Do not edit manually */

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

/**  */
export interface AscribeTargetInput {
  target: AnyLinkableHash
  target_type: string
  creation_time: Timestamp
  maybe_original_author?: AgentPubKey
}

export interface AuthorshipLog {
  creation_time: Timestamp
  original_author: AgentPubKey
}

/**
 * -------------------------------------------------------------------------------------------------
 * Global consts
 * -------------------------------------------------------------------------------------------------
 * DNA/Zome names
 */
export const AUTHORSHIP_DEFAULT_ROLE_NAME = "rAuthorship";

export const AUTHORSHIP_DEFAULT_COORDINATOR_ZOME_NAME = "zAuthorship";

export const AUTHORSHIP_DEFAULT_INTEGRITY_ZOME_NAME = "authorship_integrity";

/** ANCHOR NAMES */
export const ROOT_ANCHOR_AUTHORSHIP = "__authorship";

export const ROOT_ANCHOR_UNKNOWN_AUTHOR = "__unknown_author";

/**
 * -------------------------------------------------------------------------------------------------
 * Zome's entry types
 * -------------------------------------------------------------------------------------------------
 */
export enum AuthorshipEntryType {
	Bogus = 'Bogus',
}
export type AuthorshipEntryVariantBogus = {Bogus: Bogus}
export type AuthorshipEntry = 
 | AuthorshipEntryVariantBogus;

export interface Bogus {
  value: string
}

/**
 * -------------------------------------------------------------------------------------------------
 * Zome's link types
 * -------------------------------------------------------------------------------------------------
 */
export type AuthorshipLinkType =
  | {AuthorshipPath: null} | {Target: null} | {Author: null};
export enum AuthorshipLinkTypeType {
	AuthorshipPath = 'AuthorshipPath',
	Target = 'Target',
	Author = 'Author',
}

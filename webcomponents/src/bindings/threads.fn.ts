/* This file is generated by zits. Do not edit manually */

import {ZomeName, FunctionName} from '@holochain/client';


/** Array of all zome function names in "threads" */
export const threadsFunctionNames: FunctionName[] = [
	"entry_defs", 
	"get_zome_info", 
	"get_dna_info",
	"get_all_beads",
	"get_latest_beads",
	"add_text_message_with_mentions",
	"add_text_message_at_with_mentions",
	"probe_mentions",
	"query_text_messages",
	"get_text_message",
	"get_many_text_message",
	"add_text_message",
	"add_text_message_at",
	"add_many_text_message_at",
	"get_latest_items",
	"get_global_log",
	"commit_global_log",
	"query_global_log",
	"probe_all_latest",
	"get_thread_log",
	"commit_thread_log",
	"query_thread_logs",


	"create_participation_protocol",
	"get_pps_from_subject_hash",
	"get_pps_from_subject_anchor",
	"query_pps",
	"get_pp",
	"create_semantic_topic",
	"get_all_semantic_topics",
	"search_semantic_topics",
	"get_topic",
	"query_semantic_topics",

	"notify_peers",
	"get_all_subjects",
	"get_applets",
	"get_subjects_by_type",
	"get_subjects_for_applet",
	"get_subject_types_for_applet",];


/** Generate tuple array of function names with given zomeName */
export function generateThreadsZomeFunctionsArray(zomeName: ZomeName): [ZomeName, FunctionName][] {
   const fns: [ZomeName, FunctionName][] = [];
   for (const fn of threadsFunctionNames) {
      fns.push([zomeName, fn]);
   }
   return fns;
}


/** Tuple array of all zome function names with default zome name "zThreads" */
export const threadsZomeFunctions: [ZomeName, FunctionName][] = generateThreadsZomeFunctionsArray("zThreads");

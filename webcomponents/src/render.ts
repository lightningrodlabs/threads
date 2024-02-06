import {getInitials, ProfilesZvm} from "@ddd-qc/profiles-dvm";
import {AgentPubKeyB64, encodeHashToBase64} from "@holochain/client";
import {html, TemplateResult} from "lit";
import {Profile as ProfileMat} from "@ddd-qc/profiles-dvm/dist/bindings/profiles.types";
import {
    AnyBead,
    EntryBead,
    NotifiableEventType,
    TextMessage,
    ThreadsEntryType,
    WeaveNotification
} from "./bindings/threads.types";
import {ThreadsZvm} from "./viewModels/threads.zvm";
import {BeadInfo, TypedBead} from "./viewModels/threads.perspective";
import {stringifyHrl} from "@ddd-qc/we-utils";
import {decodeHrl} from "./utils";
import {FilesDvm} from "@ddd-qc/files";
import {WePerspective} from "./contexts";


/** */
export function renderAvatar(profilesZvm: ProfilesZvm, agentKey: AgentPubKeyB64, size: string): TemplateResult<1> {
    let agent = {nickname: "unknown", fields: {}} as ProfileMat;
    const maybeAgent = profilesZvm.perspective.profiles[agentKey];
    if (maybeAgent) {
        agent = maybeAgent;
    } else {
        console.log("Profile not found for agent", agentKey, profilesZvm.perspective.profiles)
        profilesZvm.probeProfile(agentKey)
        //.then((profile) => {if (!profile) return; console.log("Found", profile.nickname)})
    }
    const initials = getInitials(agent.nickname);
    const avatarUrl = agent.fields['avatar'];
    //console.log("renderAvatar()", initials, avatarUrl);
    return avatarUrl? html`
              <ui5-avatar size=${size} class="chatAvatar" slot="avatar" style="box-shadow: 1px 1px 1px 1px rgba(130, 122, 122, 0.88)">
                  <img src=${avatarUrl}>
              </ui5-avatar>
            `: html`
              <ui5-avatar size=${size} class="chatAvatar" slot="avatar" shape="Circle" initials=${initials} color-scheme="Accent2"></ui5-avatar>
    `;
}


/** Return [notifTitle, notifBody] */
export function  composeNotificationTitle(notif: WeaveNotification, threadsZvm: ThreadsZvm, filesDvm: FilesDvm, wePerspective: WePerspective): [string, string] {
    let title: string = "";
    let content: string = "";
    const ah = encodeHashToBase64(notif.content);
    if (NotifiableEventType.Mention in notif.event) {
        const beadPair = threadsZvm.perspective.beads[ah];
        if (!beadPair) {
            title = "Mention in channel";
        } else {
            const beadInfo = beadPair[0];
            const typedBead = beadPair[1];
            const maybeThread = threadsZvm.getThread(encodeHashToBase64(beadInfo.bead.forProtocolAh));
            if (maybeThread) {
                title = "Mention in channel " + maybeThread.name;
            }
            content = determineBeadName(beadInfo, typedBead, filesDvm, wePerspective);
        }
    }
    if (NotifiableEventType.Reply in notif.event) {
        const beadPair = threadsZvm.perspective.beads[ah];
        if (!beadPair) {
            title = "Reply in channel";
        } else {
            const beadInfo = beadPair[0];
            const typedBead = beadPair[1];
            const maybeThread = threadsZvm.getThread(encodeHashToBase64(beadInfo.bead.forProtocolAh));
            if (maybeThread) {
                title = "Reply in channel " + maybeThread.name;
            }
            content = determineBeadName(beadInfo, typedBead, filesDvm, wePerspective);
        }
    }
    if (NotifiableEventType.Fork in notif.event) {
        const maybeThread = threadsZvm.getThread(ah);
        if (!maybeThread)  {
            title = "New thread";
        } else {
            // const subjectHash = maybeThread.pp.subjectHash;
            // const subject = this.getSubject(subjectHash);
            // title = "New thread about a " + subject.typeName;
            title = "New thread: " + maybeThread.name;
            content = "Rules: " + maybeThread.pp.rules;
        }
    }
    if (NotifiableEventType.Dm in notif.event) {
        // TODO
    }
    return [title, content];
}



/** */
export function determineBeadName(beadInfo: BeadInfo, typedBead: TypedBead, filesDvm: FilesDvm, wePerspective: WePerspective): string {
    switch (beadInfo.beadType) {
      /** TextMessage: text content */
      case ThreadsEntryType.TextMessage: return (typedBead as TextMessage).value; break;
      /** EntryBead: Filename */
      case ThreadsEntryType.EntryBead:
            const fileBead = typedBead as EntryBead;
            const tuple = filesDvm.deliveryZvm.perspective.publicParcels[encodeHashToBase64(fileBead.eh)];
            if (!tuple) {
                return "<file>";
            }
            return tuple[0].name;
        break;
      /** AnyBead: AttachableInfo.name */
      case ThreadsEntryType.AnyBead:
            const hrlBead = typedBead as AnyBead;
            const hrl = decodeHrl(hrlBead.value);
            const attLocInfo = wePerspective.attachables[stringifyHrl(hrl)];
            if (!attLocInfo) {
                return "<unknown attachable>";
            }
            return attLocInfo.attachableInfo.name;
        break;
      /** */
      default:
        break;
    }
    return "<unknown>";
}

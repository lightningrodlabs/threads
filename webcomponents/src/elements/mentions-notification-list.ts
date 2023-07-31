import {css, html, PropertyValues} from "lit";
import {property, state, customElement} from "lit/decorators.js";
import {DnaElement, ZomeElement} from "@ddd-qc/lit-happ";
import {ThreadsPerspective} from "../viewModels/threads.perspective";

import {ThreadsDvm} from "../viewModels/threads.dvm";
import {consume} from "@lit-labs/context";
import {globalProfilesContext} from "../viewModels/happDef";
import {ProfilesZvm} from "../viewModels/profiles.zvm";
import {ThreadsProfile} from "../viewModels/profiles.proxy";
import {getInitials, timeSince} from "../utils";
import {decodeHashFromBase64} from "@holochain/client";



/**
 * @element
 */
@customElement("mentions-notification-list")
export class MentionsList extends DnaElement<unknown, ThreadsDvm> {

  constructor() {
    super(ThreadsDvm.DEFAULT_BASE_ROLE_NAME)
  }

  @consume({ context: globalProfilesContext, subscribe: true })
  _profilesZvm!: ProfilesZvm;

  /** Observed perspective from zvm */
  @property({type: Object, attribute: false, hasChanged: (_v, _old) => true})
  threadsPerspective!: ThreadsPerspective;


  /** -- Methods -- */

  /** */
  protected async dvmUpdated(newDvm: ThreadsDvm, oldDvm?: ThreadsDvm): Promise<void> {
    console.log("<comment-thread-view>.dvmUpdated()");
    if (oldDvm) {
      console.log("\t Unsubscribed to threadsZvm's roleName = ", oldDvm.threadsZvm.cell.name)
      oldDvm.threadsZvm.unsubscribe(this);
    }
    newDvm.threadsZvm.subscribe(this, 'threadsPerspective');
    console.log("\t Subscribed threadsZvm's roleName = ", newDvm.threadsZvm.cell.name)
  }




  /** */
  render() {
    console.log("<mentions-notification-list>.render()", this.threadsPerspective.mentions, this._profilesZvm);
    if (this._dvm.threadsZvm.perspective.mentions.length == 0) {
      return html `<div style="color:#c10a0a">No mentions found</div>`;
    }

    let notifsLi = Object.values(this._dvm.threadsZvm.perspective.mentions).map(
      ([linkAh, author, beadAh]) => {
        const texto = this._dvm.threadsZvm.perspective.textMessages[beadAh];
        console.log("<mentions-list> texto", texto.message);

        const date = new Date(texto.creationTime / 1000); // Holochain timestamp is in micro-seconds, Date wants milliseconds
        //const date_str = date.toLocaleString('en-US', {hour12: false});

        const date_str = timeSince(date) + " ago";

        let agent = {nickname: "unknown", fields: {}} as ThreadsProfile;
        if (this._profilesZvm) {
          const maybeAgent = this._profilesZvm.perspective.profiles[author];
          if (maybeAgent) {
            agent = maybeAgent;
          } else {
            console.log("Profile not found for agent", texto.author, this._profilesZvm.perspective.profiles)
            this._profilesZvm.probeProfile(texto.author)
            //.then((profile) => {if (!profile) return; console.log("Found", profile.nickname)})
          }
        }
        const initials = getInitials(agent.nickname);
        const avatarUrl = agent.fields['avatar'];


        return html`
          <ui5-li-notification title-text=${texto.message} show-close
              @close=${async (e) => {
                  const _ = await this._dvm.threadsZvm.zomeProxy.deleteMention(decodeHashFromBase64(linkAh));
                  e.detail.item.hidden = true;
                }
              }>
              ${avatarUrl? html`
                      <ui5-avatar class="chatAvatar" slot="avatar" style="box-shadow: 1px 1px 1px 1px rgba(130, 122, 122, 0.88)">
                          <img src=${avatarUrl}>
                      </ui5-avatar>                   
                          ` : html`
                        <ui5-avatar class="chatAvatar" shape="Circle" initials=${initials} color-scheme="Accent2" slot="avatar"></ui5-avatar>
                  `}
              <span slot="footnotes">${agent.nickname}</span>
              <span slot="footnotes">${date_str}</span>
              <ui5-notification-action text="Jump" slot="actions" @click=${(e) => {
                  this.dispatchEvent(new CustomEvent('jump', {detail: beadAh, bubbles: true, composed: true}));
              }
              }></ui5-notification-action>
          </ui5-li-notification>
        `;
      }
    );

    /** render all */
    return html`
        <ui5-list header-text="Mentions">
            ${notifsLi}
        </ui5-list>
    `;
  }

}
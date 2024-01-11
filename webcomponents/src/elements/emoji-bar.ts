import {css, html, PropertyValues} from "lit";
import {property, state, customElement} from "lit/decorators.js";
import {DnaElement} from "@ddd-qc/lit-happ";
import {ThreadsDvm} from "../viewModels/threads.dvm";
import {ActionHashB64, AgentPubKeyB64} from "@holochain/client";
import {ThreadsPerspective} from "../viewModels/threads.perspective";
import {Dictionary} from "@ddd-qc/cell-proxy";
import {Profile as ProfileMat} from "@ddd-qc/profiles-dvm/dist/bindings/profiles.types";

/**
 * @element
 */
@customElement("emoji-bar")
export class EmojiBar extends DnaElement<unknown, ThreadsDvm> {

  constructor() {
    super(ThreadsDvm.DEFAULT_BASE_ROLE_NAME)
  }

  /** -- Properties -- */

  /** Hash of bead to display */
  @property() hash: ActionHashB64 = ''


  /** Observed perspective from zvm */
  @property({type: Object, attribute: false, hasChanged: (_v, _old) => true})
  threadsPerspective!: ThreadsPerspective;



  /**
   * In dvmUpdated() this._dvm is not already set!
   * Subscribe to ThreadsZvm
   */
  protected async dvmUpdated(newDvm: ThreadsDvm, oldDvm?: ThreadsDvm): Promise<void> {
    //console.log("<chat-message-item>.dvmUpdated()");
    if (oldDvm) {
      //console.log("\t Unsubscribed to threadsZvm's roleName = ", oldDvm.threadsZvm.cell.name)
      oldDvm.threadsZvm.unsubscribe(this);
    }
    newDvm.threadsZvm.subscribe(this, 'threadsPerspective');
    //console.log("\t Subscribed threadsZvm's roleName = ", newDvm.threadsZvm.cell.name)
  }



  /** */
  render() {
    console.log("<emoji-bar>.render()", this.threadsPerspective.emojiReactions);
    if (this.hash == "") {
      return html`
          <div>No item found</div>`;
    }

    const reactions = this.threadsPerspective.emojiReactions[this.hash];
    if (!reactions) {
      return html``;
    }
    /** Pair vec into map */
    let emojiMap: Dictionary<AgentPubKeyB64[]> = {}
    for (const [agent, emoji] of reactions) {
      if (!emojiMap[emoji]) {
        emojiMap[emoji] = [];
      }
      emojiMap[emoji].push(agent);
    }


    /** */
    let emojiButtons = Object.entries(emojiMap).map(([emoji, agents]) => {
      let tooltip = "" + emoji + " reacted by "
      for (const key of agents) {
        let agent = {nickname: "unknown", fields: {}} as ProfileMat;
        const maybeAgent = this._dvm.profilesZvm.perspective.profiles[key];
        if (maybeAgent) {
          agent = maybeAgent;
        }
        tooltip += "" + agent.nickname + ", "
      }
      tooltip = tooltip.substring(0, tooltip.length - 2);
      return html`
        <sl-tooltip content=${tooltip} placement="top">
          <button tooltip=${tooltip} @click=${(e) => this.onClickEmoji(emoji)}>
            ${emoji} ${agents.length > 1? agents.length : ""}
          </button>
        </sl-tooltip>
      `;
    });
    //<div class="chatItem" @mouseenter=${(e) => this._isHovered = true} @mouseleave=${(e) => this._isHovered = false}>


    /** render all */
    return html`
        <div style="display:flex; flex-direction:row; gap:5px;">
            ${emojiButtons}
        </div>
    `;

  }


  /** */
  async onClickEmoji(emoji: string) {
    console.log("onClickEmoji()", emoji);
    await this._dvm.unpublishEmoji(this.hash, emoji);
  }


  /** */
  static get styles() {
    return [
      css`
        sl-tooltip {
          --show-delay: 500;
        }
      `,];
  }
}
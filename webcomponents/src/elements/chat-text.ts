import {css, html, PropertyValues} from "lit";
import {property, state, customElement} from "lit/decorators.js";
import {ZomeElement} from "@ddd-qc/lit-happ";
import {ActionHashB64} from "@holochain/client";
import {TextBeadMat, ThreadsPerspective} from "../viewModels/threads.perspective";
//import {ChatThreadView} from "./chat-thread-view";
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import markdownit from 'markdown-it'
import {ThreadsZvm} from "../viewModels/threads.zvm";
import {sharedStyles} from "../styles";


/**
 * @element
 */
@customElement("chat-text")
export class ChatText extends ZomeElement<ThreadsPerspective, ThreadsZvm> {

  constructor() {
    super(ThreadsZvm.DEFAULT_ZOME_NAME);
  }


  /** Hash of TextBead to display */
  @property() hash: ActionHashB64 = ''


  /** */
  render() {
    //console.log("<chat-text>.render()", this.hash);
    if (this.hash == "") {
      return html`
          <div style="color:red">No message found</div>`;
    }

    const beadPair = this.perspective.beads[this.hash];
    if (!beadPair) {
      return html`<ui5-busy-indicator delay="0" size="Medium" active style="margin:auto; width:50%; height:50%;"></ui5-busy-indicator>`;
    }
    const tm = beadPair[1] as TextBeadMat;
    const md = markdownit();
    //const md = markdownit().use(emoji/* , options */);
    const result = md.render(tm.value);
    const parsed = unsafeHTML(result);

    /** render all */
    return html`<div class="chatMsg">${parsed}</div>`;
  }


  /** */
  static get styles() {
    return [
      sharedStyles,
      css`
        .chatMsg {
          margin: 0px;
        }        
      `,];
  }
}

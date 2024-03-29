import {css, html, PropertyValues} from "lit";
import {customElement, property, state} from "lit/decorators.js";
import {ZomeElement} from "@ddd-qc/lit-happ";
import {ActionHashB64, decodeHashFromBase64} from "@holochain/client";
import {AnyBeadMat, ThreadsPerspective} from "../viewModels/threads.perspective";
import {consume} from "@lit/context";
import {weClientContext} from "../contexts";
import {AppletInfo, Hrl, weaveUrlFromWal} from "@lightningrodlabs/we-applet";
import {AttachableLocationAndInfo} from "@lightningrodlabs/we-applet/dist/types";
import {ThreadsZvm} from "../viewModels/threads.zvm";
import {WeServicesEx} from "@ddd-qc/we-utils";
import {weaveUrlToWal} from "../utils";


/**
 * @element
 */
@customElement("chat-wal")
export class ChatWal extends ZomeElement<ThreadsPerspective, ThreadsZvm> {

  constructor() {
    super(ThreadsZvm.DEFAULT_ZOME_NAME)
  }

  /** -- Properties -- */

  /** Hash of File bead to display */
  @property() hash: ActionHashB64 = '' // BeadAh

  @consume({ context: weClientContext, subscribe: true })
  weServices!: WeServicesEx;

  @state() private _attLocAndInfo?: AttachableLocationAndInfo;
  @state() private _appletInfo?: AppletInfo;


  /** */
  render() {
    console.log("<chat-wal>.render()", this.hash);
    if (!this.weServices) {
      return html`        
          <ui5-list id="fileList">
          <ui5-li id="fileLi" class="fail" icon="warning" description=${this.hash}>
              Failed to retrieve HRL. WeServices not available
          </ui5-li>
      </ui5-list>
      `;

    }
    if (this.hash == "") {
      return html`<ui5-busy-indicator delay="0" size="Medium" active style="margin:auto; width:50%; height:50%;"></ui5-busy-indicator>`;
    }
    const anyBeadInfoPair = this.perspective.beads[this.hash];
    if (!anyBeadInfoPair) {
      return html`
        <ui5-list id="fileList">
            <ui5-li id="fileLi" class="fail" icon="synchronize" description=${this.hash}
                    @click=${async (e) => {
                        await this._zvm.probeAllInner();
                        const anyBeadInfoPair = this.perspective.beads[this.hash];
                        if (anyBeadInfoPair) {
                            this.requestUpdate();
                        }
                    }}>
                HRL not found
            </ui5-li>
        </ui5-list>
      `;
    }
    const anyBead = anyBeadInfoPair[1] as AnyBeadMat;
    if (anyBead.typeInfo != "wal") {
      return html`          
          <ui5-list id="fileList">
          <ui5-li id="fileLi" class="fail" icon="warning" description=${this.hash}>
              Error: AnyBead not of type WAL
          </ui5-li>
      </ui5-list>
      `;
    }

    //console.log("<chat-wal>.render() anyBead", anyBead.value);
    const wal = weaveUrlToWal(anyBead.value);
    //console.log("<chat-wal>.render()", weaveUrlFromWal(hrl), obj);
    if (!this._attLocAndInfo) {
      this.weServices.attachableInfo(wal).then((attLocAndInfo) => {
        //console.log("<chat-wal>.render() attachableInfo", attLocAndInfo);
        this._attLocAndInfo = attLocAndInfo;
      });
      return html`<ui5-busy-indicator delay="0" size="Medium" active style="margin:auto; width:50%; height:50%;"></ui5-busy-indicator>`;
    }
    if (!this._appletInfo) {
      this.weServices.appletInfo(this._attLocAndInfo.appletHash).then((appletInfo) => {
        //console.log("<chat-wal>.render() appletInfo:", appletInfo);
        this._appletInfo = appletInfo;
      });
      return html`<ui5-busy-indicator delay="0" size="Medium" active style="margin:auto; width:50%; height:50%;"></ui5-busy-indicator>`;
    }


    /** render all */
    return html`
        <ui5-list id="fileList">
          <ui5-li id="fileLi" icon="chain-link" description=${this._appletInfo.appletName}
                  @click=${(e) => this.weServices.openHrl(wal)}>
            ${this._attLocAndInfo.attachableInfo.name}
          </ui5-li>
        </ui5-list>
    `;
  }


  /** */
  static get styles() {
    return [
      css`
        
        :host {
          max-width: 600px;
        }
        #fileList {
          min-width: 350px;
          border-radius: 10px;
          margin: 10px 5px 10px 5px;
          box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;
        }

        #fileLi {
          border-radius: 10px;
        }
          
        .fail {
            background: #fdd;
        }
      `,];
  }
}

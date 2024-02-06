import {css, html} from "lit";
import {customElement, property, state} from "lit/decorators.js";
import {delay, DnaElement} from "@ddd-qc/lit-happ";
import {ThreadsDvm} from "../viewModels/threads.dvm";
import {ActionHashB64, encodeHashToBase64} from "@holochain/client";
import {consume} from "@lit/context";
import {globaFilesContext} from "../contexts";
import {FileHashB64, FilesDvm, FileType, kind2Type, prettyFileSize} from "@ddd-qc/files";
import {type2ui5Icon} from "../utils";
import {EntryBead} from "../bindings/threads.types";


/**
 * @element
 */
@customElement("chat-file")
export class ChatFile extends DnaElement<unknown, ThreadsDvm> {

  constructor() {
    super(ThreadsDvm.DEFAULT_BASE_ROLE_NAME)
  }

  /** -- Properties -- */

  /** Hash of File bead to display */
  @property() hash: ActionHashB64 = '' // BeadAh
  @state() private _dataHash?: FileHashB64;

  @consume({ context: globaFilesContext, subscribe: true })
  _filesDvm!: FilesDvm;


  /** */
  render() {
    console.log("<chat-file>.render()", this.hash, this._dataHash);
    if (this.hash == "") {
      return html`
          <div>No file found</div>`;
    }

    const beadInfoPair = this._dvm.threadsZvm.perspective.beads[this.hash];
    if (!beadInfoPair) {
      return html`<ui5-busy-indicator size="Medium" active style="margin:auto; width:50%; height:50%;"></ui5-busy-indicator>`;
    }
    const entryBead = beadInfoPair[1] as EntryBead;
    const manifestEh = encodeHashToBase64(entryBead.sourceEh);
    const fileTuple = this._filesDvm.deliveryZvm.perspective.publicParcels[manifestEh];
    if (!fileTuple) {
      /** auto refresh since we can't observe filesDvm */
      this._filesDvm.deliveryZvm.probeDht()//.then(() => {this.requestUpdate()});
      delay(1000).then(() => {this.requestUpdate()});
      return html `<ui5-busy-indicator size="Large" active style="margin:auto; width:50%; height:50%;"></ui5-busy-indicator>`;
    }
    const fileDesc = fileTuple[0];


    /** Make sure it's an image file from Files */
    // FIXME


    const fileType = kind2Type(fileDesc.kind_info);

    let item = html`
        <ui5-list id="fileList">
          <ui5-li id="fileLi" icon=${type2ui5Icon(fileType)} description=${prettyFileSize(fileDesc.size)}
                  @click=${(e) => this._filesDvm.downloadFile(encodeHashToBase64(entryBead.sourceEh))}>
            ${fileDesc.name}
          </ui5-li>
        </ui5-list>`;
    let maybeCachedData = undefined;
    if (fileType == FileType.Image) {
      maybeCachedData = null;
      if (!this._dataHash) {
        console.log("File is image, dataHash not known");
        this._filesDvm.getFile(manifestEh).then(([manifest, data]) => {
          console.log("File is image, manifest", manifest.description.name, manifest.data_hash);
          const file = this._filesDvm.data2File(manifest, data);
          this._filesDvm.cacheFile(file);
          this._dataHash = manifest.data_hash;
          //this.requestUpdate();
        });
      } else {
        maybeCachedData = this._filesDvm.getFileFromCache(this._dataHash);
        if (!maybeCachedData) {
          console.warn("File cache not found", this._dataHash);
        }
      }
      if (maybeCachedData) {
        item = html`<img class="thumb" src=${"data:image/png;base64," + maybeCachedData}
                         @click=${(e) => this._filesDvm.downloadFile(encodeHashToBase64(entryBead.sourceEh))}>
        `;
      }
    }

    /** render all */
    return html`${item}`;
  }


  /** */
  static get styles() {
    return [
      css`
        #fileList {
          min-width: 350px;
          border: 1px solid #282727;
          border-radius: 3px;
          margin: 10px 5px 10px 5px;
        }

        #fileLi {
          background: rgb(230, 237, 249);
        }        
        
        .thumb {
          max-width: 50%;
          cursor: pointer;
          margin: 10px; 
        }
      `,];
  }
}

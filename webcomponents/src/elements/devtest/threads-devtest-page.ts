import {css, html} from "lit";
import {property, state} from "lit/decorators.js";
import {DnaElement} from "@ddd-qc/lit-happ";
import {ActionHashB64, AnyDhtHashB64, encodeHashToBase64} from "@holochain/client";
import {ThreadsDvm} from "../../viewModels/threads.dvm";
import {ThreadsPerspective} from "../../viewModels/threads.zvm";
import {ThreadList} from "./thread-list";
import {ThreadsLinkTypeType, TypedAnchor} from "../../bindings/threads.types";
import {AnchorTree} from "./anchor-tree";
import {LinkList} from "./link-list";
import {TextMessageList} from "./text-message-list";
import {SemanticTopicList} from "./semantic-topic-list";


/** */
function utf32Decode(bytes: Uint8Array) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let result = '';

  for (let i = 0; i < bytes.length; i += 4) {
    result += String.fromCodePoint(view.getInt32(i, true));
  }

  return result;
}


/**
 * @element
 */
export class ThreadsDevtestPage extends DnaElement<unknown, ThreadsDvm> {

  constructor() {
    super(ThreadsDvm.DEFAULT_BASE_ROLE_NAME)
  }

  /** -- Fields -- */
  @state() private _initialized = false;
  @state() private _selectedTopicHash: AnyDhtHashB64 = '';
  @state() private _selectedThreadHash: AnyDhtHashB64 = '';

  @property({ type: Boolean, attribute: 'debug' })
  debugMode: boolean = false;


  @property({type: Object, attribute: false, hasChanged: (_v, _old) => true})
  threadsPerspective!: ThreadsPerspective;


  /** -- Methods -- */

  protected async dvmUpdated(newDvm: ThreadsDvm, oldDvm?: ThreadsDvm): Promise<void> {
    console.log("<threads-devtest-page>.dvmUpdated()");
    if (oldDvm) {
      console.log("\t Unsubscribed to threadsZvm's roleName = ", oldDvm.threadsZvm.cell.name)
      oldDvm.threadsZvm.unsubscribe(this);
    }
    newDvm.threadsZvm.subscribe(this, 'threadsPerspective');
    console.log("\t Subscribed threadsZvm's roleName = ", newDvm.threadsZvm.cell.name)
    // newDvm.probeAll();
    this._selectedTopicHash = '';
    this._selectedThreadHash = '';
    this._initialized = true;
  }


  @state() private _myNick: string = '';

  // /** After first render only */
  async firstUpdated() {
    // this._initialized = true;

    await this._dvm.profilesZvm.createMyProfile({nickname: "Bobby", fields: {}});
    this._myNick = this._dvm.profilesZvm.getMyProfile().nickname;
  }


  /** */
  async refresh(_e?: any) {
    await this._dvm.probeAll();
  }


  async printRootAnchors() {
    const rootAnchors = await this._dvm.threadsZvm.zomeProxy.getAllRootAnchors();
    console.log({rootAnchors})
    const linkKeys = Object.keys(ThreadsLinkTypeType);
    for (const rootAnchor of rootAnchors) {
      //const str = utf32Decode(new Uint8Array(child[1]));
      console.log(`  - Root anchor: LinkType="${linkKeys[rootAnchor.linkIndex]}" path="${rootAnchor.anchor}"`);
      //await this.printChildren(str);
    }
  }

  async printChildren(root_ta: TypedAnchor) {
    const linkKeys = Object.keys(ThreadsLinkTypeType);
    const children = await this._dvm.threadsZvm.zomeProxy.getAllSubAnchors(root_ta.anchor);
    //console.log({children})
    if (children.length == 0) {
      const links = await this._dvm.threadsZvm.zomeProxy.getAllLeafLinksFromAnchor(root_ta.anchor);
      if (links.length > 0) {
        const tag = new TextDecoder().decode(new Uint8Array(links[0].tag));
        const leaf = root_ta.anchor + tag
        console.log(`  - Anchor: LinkType="${linkKeys[root_ta.linkIndex]}" path="${leaf}"`);
      }
      for (const link of links) {
        const tag = new TextDecoder().decode(new Uint8Array(link.tag));
        const hash = encodeHashToBase64(new Uint8Array(link.target));
        console.log(`    - LeafLink: LinkType="${linkKeys[link.index]}" tag="${tag}" hash="${hash}"`);
      }
    } else {
      for (const ta of children) {
        console.log(`  - Anchor: LinkType="${linkKeys[ta.linkIndex]}" path="${ta.anchor}"`);
        await this.printChildren(ta);
      }
    }
  }



  /** */
  async onCreateSemanticTopic(e: any) {
    const input = this.shadowRoot!.getElementById("listTitleInput") as HTMLInputElement;
    let ah = await this._dvm.threadsZvm.publishSemanticTopic(input.value);
    //console.log("onCreateList() res:", res)
    input.value = "";
    this._selectedTopicHash = ah;
  }


  /** */
  async onCreateThread(e: any) {
    const input = this.shadowRoot!.getElementById("threadInput") as HTMLInputElement;
    let ah = await this._dvm.threadsZvm.publishThreadFromSemanticTopic(this._selectedTopicHash, input.value);
    //console.log("onCreateList() res:", res)
    input.value = "";
    this._selectedThreadHash = ah;
  }


  /** */
  async onCreateTextMessage(e: any) {
    const input = this.shadowRoot!.getElementById("textMessageInput") as HTMLInputElement;
    let path_str = await this._dvm.threadsZvm.publishTextMessage(input.value, this._selectedThreadHash);
    console.log("onCreateTextMessage() res:", path_str);
    input.value = "";
    const msgList = this.shadowRoot!.getElementById("textMessageList") as TextMessageList;
    await msgList.probeLatestMessages()
  }


  /** */
  async onSemanticTopicSelect(topicAh: ActionHashB64) {
    console.log("onSemanticTopicSelect() CALLED", topicAh)
    await this._dvm.threadsZvm.probeThreads(topicAh);
    this._selectedTopicHash = topicAh;
  }


  /** */
  render() {
    console.log("<threads-test-page.render()> render()", this._initialized, this._selectedTopicHash);
    if (!this._initialized) {
      return html`<span>Loading...</span>`;
    }
    //console.log("\t Using threadsZvm.roleName = ", this._dvm.threadsZvm.cell.name)

    /** Render all */
    return html`
        <div>
            <button @click="${() => {
                console.log("refresh");
                //const el = this.shadowRoot.getElementById("test") as ThreadsTestPage; 
                //el.requestUpdate();
                this.refresh();
            }}">refresh
            </button>
            <button @click="${async () => {
                console.log("*** Scan All Semantic Topics:");
                await this.printChildren({anchor: "all_semantic_topics", linkIndex: 1, zomeIndex: 0});
            }
            }">Scan Semantic Topics
            </button>
            <button @click="${async () => {
                console.log("*** Scan Root Anchors:");
                await this.printRootAnchors();
            }
            }">Scan Root Anchors
            </button>
            <button @click="${async () => {
                console.log("*** Scan latest items");
                let res = await this._dvm.threadsZvm.zomeProxy.getLatestItems();
                console.log({res})
            }
            }">Scan latest entries
            </button>            
            <h1>Threads test page: <abbr title="${this.cell.agentPubKey}">${this._myNick}</abbr></h1>
            <semantic-topic-list id="threadList" .topic="${this._selectedTopicHash}"
                         @selected="${(e) => {this.onSemanticTopicSelect(e.detail)}}"></semantic-topic-list>            

            <thread-list id="threadList" .topic="${this._selectedTopicHash}"
                         @selected="${(e) => {this._selectedThreadHash = e.detail}}"></thread-list>
            <div>
                <label for="threadInput">Create new thread:</label>
                <input type="text" id="threadInput" name="purpose">
                <input type="button" value="create" @click=${this.onCreateThread}
                       .disabled="${this._selectedTopicHash === ''}">
            </div>
            <!-- Show Thread -->
            <div style="background: #fac8c8">
                <text-message-list id="textMessageList" .thread="${this._selectedThreadHash}"></text-message-list>
                <div>
                    <label for="threadInput">Add Message:</label>
                    <input type="text" id="textMessageInput" name="message">
                    <input type="button" value="create" @click=${this.onCreateTextMessage}
                           .disabled="${this._selectedThreadHash === ''}">
                </div>                
            </div>            
        </div>
        <!-- Anchor trees -->
        <div style="display: flex; flex-direction: row;margin-top:25px;">
            <anchor-tree style="width: 50%; overflow: auto;" 
                         @hashSelected="${(e) => {this._selectedTopicHash = e.detail}}"></anchor-tree>
            <link-list .rootHash="${this._selectedTopicHash}"
                       style="width: 50%; overflow: auto;"></link-list>
        </div>
    `;
  }


  /** */
  static get scopedElements() {
    return {
      "thread-list": ThreadList,
      "anchor-tree": AnchorTree,
      "link-list": LinkList,
      "text-message-list": TextMessageList,
      "semantic-topic-list": SemanticTopicList,
    }
  }
}
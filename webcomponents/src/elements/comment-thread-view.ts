import {css, html, PropertyValues} from "lit";
import {property, state, customElement} from "lit/decorators.js";
import {DnaElement} from "@ddd-qc/lit-happ";
import {ThreadsDvm} from "../viewModels/threads.dvm";
import {TextMessageInfo, ThreadsPerspective} from "../viewModels/threads.perspective";
import {getInitials} from "../utils";

import {ThreadsProfile} from "../viewModels/profiles.proxy";
import {ActionHashB64} from "@holochain/client";
import {consume} from "@lit-labs/context";
import {globalProfilesContext} from "../viewModels/happDef";
import {ProfilesZvm} from "../viewModels/profiles.zvm";

/** @ui5/webcomponents(-fiori) */
import "@ui5/webcomponents/dist/Input.js";
import "@ui5/webcomponents/dist/Avatar.js"
import "@ui5/webcomponents-fiori/dist/Bar.js";
import List from "@ui5/webcomponents/dist/List"
import "@ui5/webcomponents/dist/List.js"

import {inputBarStyleTemplate} from "../styles";
import {Thread} from "../viewModels/thread";



/**
 * @element
 */
@customElement("comment-thread-view")
export class CommentThreadView extends DnaElement<unknown, ThreadsDvm> {

  constructor() {
    super(ThreadsDvm.DEFAULT_BASE_ROLE_NAME);
    console.log("<comment-thread-view>.ctor()", this.threadHash)
  }

  @consume({ context: globalProfilesContext, subscribe: true })
  _profilesZvm!: ProfilesZvm;


  /** -- Properties -- */

  /** Hash of Thread to display */
  @property() threadHash: ActionHashB64 = ''
  /** Enable Input bar */
  @property() showInput: boolean = false

  /** Subject info */
  @property() subjectName?: string;
  @property() subjectType?: string;

  // TODO
  // /** View beads in chronological order, otherwise use timeReference as end-time and display older beads only. */
  // @property()
  // startFromBeginning: boolean = false;
  // /** */
  // @property()
  // timeReferenceMs: number = Date.now();
  // /** Number of beads to retrieve per 'get' */
  // @property()
  // batchSize: number = 20


  /** Observed perspective from zvm */
  @property({type: Object, attribute: false, hasChanged: (_v, _old) => true})
  threadsPerspective!: ThreadsPerspective;

  /** -- State variables -- */

  @state() private _loading = false;


  /** -- Getters -- */

  get listElem() : List {
    return this.shadowRoot.getElementById("textList") as List;
  }


  /** -- Methods -- */

  /**
   * In dvmUpdated() this._dvm is not already set!
   * Subscribe to ThreadsZvm
   */
  protected async dvmUpdated(newDvm: ThreadsDvm, oldDvm?: ThreadsDvm): Promise<void> {
    console.log("<comment-thread-view>.dvmUpdated()");
    if (oldDvm) {
      console.log("\t Unsubscribed to threadsZvm's roleName = ", oldDvm.threadsZvm.cell.name)
      oldDvm.threadsZvm.unsubscribe(this);
    }
    newDvm.threadsZvm.subscribe(this, 'threadsPerspective');
    console.log("\t Subscribed threadsZvm's roleName = ", newDvm.threadsZvm.cell.name)
    newDvm.threadsZvm.probeAllBeads(this.threadHash);
  }



  /** FOR DEBUGGING */
  shouldUpdate(changedProperties: PropertyValues<this>) {
    console.log("<comment-thread-view>.shouldUpdate()", changedProperties, this._dvm);
    if (changedProperties.has("_cell_via_context")) {
      this._cell = this._cell_via_context;
    }
    if (!this._dvm) {
      this.requestDvm();
    }
    return !!this._dvm;
  }


  /** */
  protected async willUpdate(changedProperties: PropertyValues<this>) {
    super.willUpdate(changedProperties);
    console.log("<comment-thread-view>.loadMessages()", changedProperties, !!this._dvm, this.threadHash);
    if (changedProperties.has("threadHash") && this._dvm) {
      console.log("<comment-thread-view>.willUpdate()", this.threadHash);
      this._dvm.threadsZvm.probeAllBeads(this.threadHash);
    }
  }


  /** */
  protected updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);
    try {
      const scrollContainer = this.listElem.shadowRoot.children[0].children[0];
      //console.log("<comment-thread-view>.updated() ", scrollContainer)
      console.log("<comment-thread-view>.updated() ", scrollContainer.scrollTop, scrollContainer.scrollHeight, scrollContainer.clientHeight)
      //this.listElem.scrollTo(0, this.listElem.scrollHeight);
      //this.listElem.scroll({top: this.listElem.scrollHeight / 2});
      //this.listElem.scrollIntoView({block: "end"});
      //this.listElem.scrollTop = this.listElem.scrollHeight / 2;
      //this.listElem.scrollTop = this.listElem.scrollHeight;
      //this.listElem.scrollIntoView(false);
    } catch(e) {
      // element not present
    }

    /** Fiddle with shadow parts CSS */
    /** -- Loading Done -- */
    const inputBar = this.shadowRoot.getElementById('commentInputBar') as HTMLElement;
    if (inputBar) {
      inputBar.shadowRoot.appendChild(inputBarStyleTemplate.content.cloneNode(true));
    }
  }


  /** */
  onLoadMore() {
    console.log("<comment-thread-view>.onLoadMore()");

    this.listElem.busy = true;
    // FIXME: Probe DHT
    this.listElem.busy = false;
  }


  /** */
  async onCreateComment(e) {
    const input = this.shadowRoot!.getElementById("commentInput") as HTMLInputElement;
    if (!input.value || input.value.length == 0) {
      return;
    }
    const thread = this._dvm.threadsZvm.getThread(this.threadHash);
    if (!thread) {
      console.error("Missing Comment thread");
      return;
    }
    const path_str = await this._dvm.publishTextMessage(input.value, this.threadHash);
    console.log("onCreateComment() res:", path_str);
    input.value = "";
  }


  /** */
  render() {
    console.log("<comment-thread-view>.render()", this.threadHash, this.showInput, this.subjectName);
    if (this.threadHash == "") {
      return html `<div style="color:#c10a0a">No comment thread selected</div>`;
    }

    const bg_color = this._loading? "#ededf0" : ""

    const pp = this._dvm.threadsZvm.getParticipationProtocol(this.threadHash);
    if (!pp) {
      return html `<div>Loading thread...</div>`;
    }
    // if (pp.subjectType == SEMANTIC_TOPIC_TYPE_NAME) {
    //   const topic = this._dvm.threadsZvm.getSemanticTopic(pp.subjectHash);
    //   if (!topic) {
    //     return html`
    //         <div>Loading thread topic...</div>`;
    //   }
    // } else {
    //
    // }


    const infos: TextMessageInfo[] = this._dvm.threadsZvm.getAllTextMessages(this.threadHash);

    console.log("<comment-thread-view>.render() len =", infos.length);

    const thread = this._dvm.threadsZvm.perspective.threads[this.threadHash];
    console.log("Has thread some unreads?", thread.hasUnreads());


    // <abbr title="${agent ? agent.nickname : "unknown"}">[${date_str}] ${tuple[2]}</abbr>
    let textLi = Object.values(infos).map(
      (info) => {
        console.log("<comment-thread-view> info", info);
        if (info == undefined) {
          return html``;
        }
        const date = new Date(info.creationTime / 1000); // Holochain timestamp is in micro-seconds, Date wants milliseconds
        const date_str = date.toLocaleString('en-US', {hour12: false});
        let agent = {nickname: "unknown", fields: {}} as ThreadsProfile;
        if (this._profilesZvm) {
          let maybeAgent = this._profilesZvm.perspective.profiles[info.author];
          if (maybeAgent) {
            agent = maybeAgent;
          }
        }
        const isNew = thread.latestProbeLogTime < info.creationTime;
        console.log("Is msg new?", isNew, thread.latestProbeLogTime, info.creationTime);

        const initials = getInitials(agent.nickname);
        const avatarUrl = agent.fields['avatar'];
        // const avatarUrl = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fassets-big.cdn-mousquetaires.com%2Fmedias%2Fdomain11440%2Fmedia5541%2F832861-ksed1135d3-ewhr.jpg&f=1&nofb=1&ipt=1d1b2046a44ff9ac2e55397563503192c1b3ff1b33a670f00c6b3c0bb7187efd&ipo=images";
        return html`
            <ui5-li additional-text="${date_str}" style="background: ${isNew? bg_color: '#e6e6e6'};" type="Inactive">
                ${info.message}
                <div slot="imageContent">                
                  ${avatarUrl? html`
                      <ui5-avatar style="box-shadow: 1px 1px 1px 1px rgba(130, 122, 122, 0.88)">
                          <img src=${avatarUrl}>
                      </ui5-avatar>                   
                          ` : html`
                        <ui5-avatar shape="Circle" initials=${initials} color-scheme="Accent2"></ui5-avatar>
                  `}
                </div>                    
            </ui5-li>`
      }
    );

    /** Different UI if no message found for thread */
    if (infos.length == 0) {
      textLi = [html`
            <ui5-li style="background: ${bg_color};">
                ${this.showInput? "Add first comment:" : "No comments found"}                       
            </ui5-li>`]
    }


    //<!--style="height: 400px" growing="Scroll" -->
    //<!-- @load-more=${this.onLoadMore}-->


    let maybeInput = html``;
    if (this.showInput) {
      maybeInput = html`
          <ui5-bar id="commentInputBar" design="FloatingFooter" style="margin:10px;width: auto;">
              <ui5-input id="commentInput" type="Text" placeholder="Comment..."
                         show-clear-icon
                         style="border:none;width:100%;"
                         @change=${this.onCreateComment}></ui5-input>
          </ui5-bar>`
    }

    const subjectType = this.subjectType? this.subjectType : pp.subjectType;
    const subjectName = this.subjectName? this.subjectName : pp.subjectHash;
    const title = `Comments on ${subjectType} "${subjectName}"`;

    // <h4 style="margin-left: 5px;"><abbr title="Thread: ${this.threadHash}">${title}</abbr></h4>
    /** render all */
    return html`
        <h4 style="margin-left: 5px;">${title}</h4>
        <ui5-list id="textList" style="background: ${bg_color};height: fit-content">
            ${textLi}
        </ui5-list>
        ${maybeInput}
    `;
  }

}

import {css, html} from "lit";
import {customElement, property, state} from "lit/decorators.js";
import {ActionHashB64} from "@holochain/client";
import {ZomeElement} from "@ddd-qc/lit-happ";
import {ThreadsZvm} from "../viewModels/threads.zvm";
import {ThreadsPerspective} from "../viewModels/threads.perspective";
import {Dictionary} from "@ddd-qc/cell-proxy";
import {CommentRequest} from "../utils";




/**
 *
 */
@customElement("semantic-topics-view")
export class SemanticTopicsView extends ZomeElement<ThreadsPerspective, ThreadsZvm> {

  constructor() {
    super(ThreadsZvm.DEFAULT_ZOME_NAME);
  }


  @state() private _isHovered: Dictionary<boolean> = {};


  // @state() private _itemLinks: ItemLink[];
  //
  //
  //
  // /** */
  // async scanRoot() {
  //   console.log("<semantic-topics-view>.scanRoot()");
  //   this._itemLinks = await this._zvm.zomeProxy.getLeafAnchors(ROOT_ANCHOR_SEMANTIC_TOPICS);
  // }


  /** */
  async toggleTreeItem(event:any) {
    // const busyIndicator = this.shadowRoot.getElementById("busy") as any; // Tree
    // let rootItem = event.detail.item /* as TreeItem */; // get the node that is toggled
    // console.log("toggleRootTreeItem()", rootItem.id, rootItem.getAttribute("anchor"))
    //
    // /* Handle AnchorBranch */
    // if (rootItem.id.length > 8 && rootItem.id.substring(0, 8) === "anchor__") {
    //   if (rootItem.expanded) {
    //     return;
    //   }
    //   event.preventDefault(); // do not let the toggle button switch yet
    //
    //   let itemTexts = [];
    //   for (const item of rootItem.items) {
    //     itemTexts.push(item.text);
    //   }
    //   busyIndicator.active = true; // block the tree from the user
    //
    //   const tas = await this._zvm.getAllSubAnchors(rootItem.getAttribute("anchor"));
    //   console.log({tas})
    //
    //   /** Handle LeafAnchor */
    //   if (tas.length == 0) {
    //     const linkKeys = Object.keys(ThreadsLinkTypeType);
    //     let itemHashs = [];
    //     for (const item of rootItem.items) {
    //       itemHashs.push(item.id);
    //     }
    //
    //     const leafLinks = await this._zvm.zomeProxy.getAllLeafLinksFromAnchor(rootItem.getAttribute("anchor"));
    //
    //     console.log({leafLinks})
    //     for (const leafLink of leafLinks) {
    //       const tag = new TextDecoder().decode(new Uint8Array(leafLink.tag));
    //       const hash = encodeHashToBase64(new Uint8Array(leafLink.target));
    //
    //       if (itemHashs.includes(hash)) {
    //         continue;
    //       }
    //       var newItem = document.createElement("ui5-tree-item") as any; // TreeItem
    //       newItem.text = hash;
    //       newItem.additionalText = tag? linkKeys[leafLink.index] + " | " + tag : linkKeys[leafLink.index];
    //       newItem.setAttribute("anchor", rootItem.anchor);
    //       newItem.id = hash;
    //       newItem.level = rootItem.level + 1;
    //       rootItem.appendChild(newItem); // add the newly fetched node to the tree
    //     }
    //   }
    //
    //   /** Handle BranchAnchor */
    //   for (const ta of tas) {
    //     const leafComponent = anchorLeaf(ta.anchor);
    //     /* Skip if item already exists */
    //     if (itemTexts.includes(leafComponent)) {
    //       continue;
    //     }
    //     let newItem = document.createElement("ui5-tree-item") as any; // TreeItem
    //     newItem.text = leafComponent;
    //     newItem.additionalText = ta.anchor;
    //     newItem.setAttribute("anchor", ta.anchor);
    //     newItem.id = "anchor__" + ta.anchor;
    //     newItem.hasChildren = true;
    //     newItem.level = rootItem.level + 1;
    //     rootItem.appendChild(newItem); // add the newly fetched node to the tree
    //   }
    //
    //   rootItem.toggle(); // now manually switch the toggle button
    //   busyIndicator.active = false; // unblock the tree
    //
    // }
  }



  /** */
  async clickTree(event) {
    //console.log("<semantic-topics-view> click event:", event.detail.item)
    if (event.detail.item.level == 2) {
      await this.updateComplete;
      this.dispatchEvent(new CustomEvent('selected', {detail: event.detail.item.id, bubbles: true, composed: true}));
    }

  }


  /** */
  onClickCommentPp(maybeCommentThread: ActionHashB64 | null, ppAh: ActionHashB64, subjectName: string) {
    this.dispatchEvent(new CustomEvent('commenting-clicked', { detail: {maybeCommentThread, subjectHash: ppAh, subjectType: "ParticipationProtocol", subjectName}, bubbles: true, composed: true }));
  }

  /** */
  onClickCommentTopic(maybeCommentThread: ActionHashB64 | null, ah: ActionHashB64, subjectName: string) {
    this.dispatchEvent(new CustomEvent<CommentRequest>('commenting-clicked', { detail: {maybeCommentThread, subjectHash: ah, subjectType: "SemanticTopic", subjectName}, bubbles: true, composed: true }));
  }



  /** */
  render() {
    console.log("<semantic-topics-view>.render()");

    // if (!this._leafLinks) {
    //   return html`Loading...`;
    // }

    let treeItems = Object.entries(this.perspective.allSemanticTopics).map(([topicHash, title]) => {
      /** Render threads for Topic */
      const topicThreads = this.perspective.threadsPerSubject[topicHash];
      //console.log("<semantic-topics-view>.render() topic:", title, topicThreads);

      let threads = [html``];
      if (topicThreads) {
        threads = Object.values(topicThreads).map((ppHash)=> {
          const thread = this.perspective.threads[ppHash];
          //const hasNewBeads = thread && thread.hasUnreads();
          const hasNewBeads = this.perspective.unreadThreads.includes(ppHash);
          //console.log("hasUnreads() thread", ppHash, thread.latestSearchLogTime);
          const threadIsNew = this.perspective.newThreads.includes(ppHash);
          //console.log("<semantic-topics-view>.render() thread:", thread.pp.purpose, thread, this.perspective.globalSearchLog.time);
          if (!thread.pp) {
            return html``;
          }

          /** Determine badge & buttons */
          const maybeCommentThread = this._zvm.getCommentThreadForSubject(ppHash);
          const hasUnreadComments = this._zvm.perspective.unreadThreads.includes(maybeCommentThread);

          let commentButton = html``;
          if (hasUnreadComments) {
            commentButton = html`<ui5-button icon="comment" tooltip="View Comment Thread" 
                                             design="Negative" class=${this._isHovered[ppHash]? "" : "transBtn"}
                                             @click="${(e) => this.onClickCommentPp(maybeCommentThread, ppHash, thread.pp.purpose)}"></ui5-button>`;
          } else {
            if (this._isHovered[ppHash]) {
              commentButton = maybeCommentThread != null
                ? html`
                          <ui5-button icon="comment" tooltip="View Comment Thread" design="Transparent"
                                      style="border:none;"
                                      @click="${(e) => this.onClickCommentPp(maybeCommentThread, ppHash, thread.pp.purpose)}"></ui5-button>`
                : html`
                          <ui5-button icon="sys-add" tooltip="Create Comment Thread" design="Transparent"
                                      style="border:none;"
                                      @click="${(e) => this.onClickCommentPp(maybeCommentThread, ppHash, thread.pp.purpose)}"></ui5-button>`;
            }
          }

          /** 'new' badge to display */
          let newBadge = html``;
          if (threadIsNew) {
            newBadge = html`<ui5-badge color-scheme="3" style="color:brown;">!</ui5-badge>`;
          }


          // @item-mouseover=${(e) => this._isHovered[ppHash] = true} @item-mouseout=${(e) => this._isHovered[ppHash] = false}
          return html`<ui5-tree-item-custom id=${ppHash} level="2" icon="number-sign" style="overflow:hidden;">
              <div slot="content" style="display:flex; overflow: hidden; align-items:center; font-weight:${hasNewBeads && !threadIsNew? "bold" : "normal"};">
                  <span style="height:18px;margin-right:10px; overflow:hidden; text-overflow:ellipsis;font-weight: ${hasNewBeads? "bold": ""}">${thread.pp.purpose}</span>
                  ${commentButton}
                  ${newBadge}                  
              </div>               
          </ui5-tree-item-custom>`
        })
      }

      /** Render Topic */
      const maybeCommentThread = this._zvm.getCommentThreadForSubject(topicHash);
      const topicIsNew = this.perspective.newSubjects[topicHash] != undefined;
      const isUnread = this._zvm.perspective.unreadSubjects.includes(topicHash);

      let commentButton = html``;
      if (isUnread) {
        commentButton = html`<ui5-button icon="comment" tooltip="View Comment Thread" 
                                             design="Negative" class=${this._isHovered[topicHash]? "" : "transBtn"}
                                             @click="${(e) => this.onClickCommentTopic(maybeCommentThread, topicHash, title)}"></ui5-button>`;
      } else {
        if (this._isHovered[topicHash]) {
          commentButton = maybeCommentThread != null
            ? html`
                      <ui5-button icon="comment" tooltip="View Comment Thread" design="Transparent" style="border:none;"
                                  @click="${(e) => this.onClickCommentTopic(maybeCommentThread, topicHash, title)}"></ui5-button>`
            : html`
                      <ui5-button icon="sys-add" style="padding:0px" tooltip="Create Comment Thread"
                                  style="border:none;" design="Transparent"
                                  @click="${(e) => this.onClickCommentTopic(maybeCommentThread, topicHash, title)}"></ui5-button>`;
        }
      }
      /** 'new' badge to display */
      let newBadge = html``;
      if (topicIsNew) {
        newBadge = html`<ui5-badge color-scheme="3" style="margin-top:10px; color:brown;">!</ui5-badge>`;
      }

      const topicHasUnreads = this.perspective.unreadSubjects.includes(topicHash);
      return html`
          <ui5-tree-item-custom id="${topicHash}" ?has-children="${!!topicThreads}"
                                expanded="${!!topicThreads}" show-toggle-button level="1" style="background: ${topicIsNew? "#DBE3EF" : ""};overflow: hidden;">
          <span slot="content" style="display:flex;overflow: hidden;">
              <span style="/*width:110px;*/height:18px;margin-top:8px; margin-right:10px; font-weight:${topicHasUnreads? "bold" : ""}; text-overflow:ellipsis;overflow:hidden;">${title}</span>
              <ui5-button icon="add" tooltip="Create a new Thread for this Topic" design="Transparent" @click=${async (e) => {
                  e.stopPropagation(); //console.log("topic clicked:", title);
                  await this.updateComplete;
                  this.dispatchEvent(new CustomEvent('createThreadClicked', {
                      detail: topicHash,
                      bubbles: true,
                      composed: true
                  }));
              }}></ui5-button>
              ${commentButton}
              ${newBadge}              
          </span>
              ${threads}
          </ui5-tree-item-custom>`
    });
    //console.log({treeItems})

    /** render all */
    return html`
      <ui5-busy-indicator id="busy" style="width: 100%">
        <ui5-tree id="semTree" mode="SingleSelect" no-data-text="No topics found"
                  @item-toggle="${this.toggleTreeItem}"
                  @item-click="${this.clickTree}"
                  @item-mouseover=${(e) => {this._isHovered[e.detail.item.id] = true; this.requestUpdate();}}
                  @item-mouseout=${(e) => {this._isHovered[e.detail.item.id] = false;}}
        >
          ${treeItems}
        </ui5-tree>
      </ui5-busy-indicator>
    `
  }


  /** */
  static get styles() {
    return [
      css`
        :host {
          background: #FBFCFD;
          display: block;
          overflow-y: auto;
          height: 100%;
        }

        #semTree {
          display: flex;
          flex-direction: column;
          /*width: 100%;*/
        }

        .transBtn {
          border:none;
          background:none;
        }
      `,

    ];
  }
}

import {css, html, PropertyValues, TemplateResult} from "lit";
import {property, state} from "lit/decorators.js";
import {ZomeElement} from "@ddd-qc/lit-happ";
import {ThreadsPerspective, ThreadsZvm} from "../viewModels/threads.zvm";
import {LeafLink, ThreadsLinkTypeType} from "../bindings/threads.types";
import {AnyDhtHashB64, decodeHashFromBase64, encodeHashToBase64} from "@holochain/client";

import "@ui5/webcomponents/dist/Tree.js"
import "@ui5/webcomponents/dist/TreeItem.js";
import "@ui5/webcomponents/dist/BusyIndicator.js";
import {ScopedZomeTypes} from "@ddd-qc/cell-proxy/dist/types";


/** */
function anchorLeaf(anchor: String): string {
  const subs = anchor.split(".");
  //console.log("anchorLeaf()", anchor, subs)
  if (subs.length < 2) {return subs[0]}
  return subs[subs.length - 2];
}


/**
 * @element
 */
export class LinkList extends ZomeElement<ThreadsPerspective, ThreadsZvm> {

  constructor() {
    super(ThreadsZvm.DEFAULT_ZOME_NAME);
    console.log("<link-list>.ctor()", this.rootHash);
  }


  @property() rootHash: AnyDhtHashB64;

  @state() private _rootLinks: LeafLink[];

  @state() private _linkTypes: ScopedZomeTypes;


  async scanRoot() {
    console.log("<link-list>.scanRoot()", this.rootHash);
    this._rootLinks = await this._zvm.zomeProxy.getAllLeafLinksFromHash(decodeHashFromBase64(this.rootHash));
  }


  /** */
   shouldUpdate(changedProperties: PropertyValues<this>) {
    super.shouldUpdate(changedProperties);
    //console.log("ZomeElement.shouldUpdate() start", !!this._zvm, this.installedCell);
    if (changedProperties.has("rootHash") && this._zvm) {
      this.scanRoot();
    }
    return true;
  }


  /** */
  protected async zvmUpdated(newZvm: ThreadsZvm, oldZvm?: ThreadsZvm): Promise<void> {
    console.log("<link-list>.zvmUpdated()", this.rootHash);
    const zi = await newZvm.zomeProxy.zomeInfo();
    console.log({zi});
    this._linkTypes = zi.zome_types.links
  }


  /** */
  renderLinkTree(): TemplateResult<1> {
    if (!this._rootLinks) {
      return html`No root set`
    }
    let children = this._rootLinks.map((ll) => {
        const tag = new TextDecoder().decode(new Uint8Array(ll.tag));
        const hash = encodeHashToBase64(new Uint8Array(ll.target));
        return html`<ui5-tree-item id="${hash}" text="${hash}" additional-text="${tag}"></ui5-tree-item>`
      });
    console.log({children})
    const header = "Root: " + this.rootHash;
    return html`
      <ui5-busy-indicator id="busy" class="full-width">
        <ui5-tree id="linkTree" mode="None" header-text="${header}" no-data-text="No links found"
                  @item-toggle="${this.toggleRootTreeItem}"
        >
          ${children}
        </ui5-tree>
      </ui5-busy-indicator>
    `
  }


  /** */
  async toggleRootTreeItem(event:any) {
    const busyIndicator = this.shadowRoot.getElementById("busy") as any; // Tree
    let rootItem = event.detail.item /* as TreeItem */; // get the node that is toggled
    console.log("toggleRootTreeItem()", rootItem.id, rootItem.getAttribute("anchor"))

    /* Handle AnchorBranch */
    if (rootItem.id.length > 8 && rootItem.id.substring(0, 8) === "anchor__") {
      if (rootItem.expanded) {
        return;
      }
      event.preventDefault(); // do not let the toggle button switch yet

      let itemTexts = [];
      for (const item of rootItem.items) {
        itemTexts.push(item.text);
      }
      busyIndicator.active = true; // block the tree from the user

      const tas = await this._zvm.getAllSubAnchors(rootItem.getAttribute("anchor"));
      console.log({tas})

      /** Handle LeafAnchor */
      if (tas.length == 0) {
        const linkKeys = Object.keys(ThreadsLinkTypeType);
        let itemHashs = [];
        for (const item of rootItem.items) {
          itemHashs.push(item.id);
        }

        const leafLinks = await this._zvm.zomeProxy.getAllLeafLinksFromAnchor(rootItem.getAttribute("anchor"));

        console.log({leafLinks})
        for (const leafLink of leafLinks) {
          const tag = new TextDecoder().decode(new Uint8Array(leafLink.tag));
          const hash = encodeHashToBase64(new Uint8Array(leafLink.target));

          if (itemHashs.includes(hash)) {
            continue;
          }
          var newItem = document.createElement("ui5-tree-item") as any; // TreeItem
          newItem.text = hash;
          newItem.additionalText = tag? linkKeys[leafLink.index] + " | " + tag : linkKeys[leafLink.index];
          newItem.setAttribute("anchor", rootItem.anchor);
          newItem.id = hash;
          newItem.level = rootItem.level + 1;
          rootItem.appendChild(newItem); // add the newly fetched node to the tree
        }
      }

      /** Handle BranchAnchor */
      for (const ta of tas) {
        const leafComponent = anchorLeaf(ta.anchor);
        /* Skip if item already exists */
        if (itemTexts.includes(leafComponent)) {
          continue;
        }
        let newItem = document.createElement("ui5-tree-item") as any; // TreeItem
        newItem.text = leafComponent;
        newItem.additionalText = ta.anchor;
        newItem.setAttribute("anchor", ta.anchor);
        newItem.id = "anchor__" + ta.anchor;
        newItem.hasChildren = true;
        newItem.level = rootItem.level + 1;
        rootItem.appendChild(newItem); // add the newly fetched node to the tree
      }

      rootItem.toggle(); // now manually switch the toggle button
      busyIndicator.active = false; // unblock the tree

    }
  }


  /** */
  render() {
    console.log(`<link-tree> render(): ${this.rootHash}`);

    // const zomeOptions = Object.entries(this._allEntryDefs).map(
    //   ([zomeName, _entryDef]) => {
    //     return html`<option>${zomeName}</option>`
    //   }
    // )

    let anchorTree = this.renderLinkTree();

    /** render all */
    return html`
        <div style="background: darkseagreen; padding-bottom: 5px">
          <h3>Link Tree component</h3>
          <div>
            ${anchorTree}
          </div>
        </div>
    `;
  }

}

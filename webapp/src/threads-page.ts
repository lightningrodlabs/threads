import {css, html, PropertyValues} from "lit";
import {property, state, customElement} from "lit/decorators.js";
import {delay, DnaElement, HAPP_ENV, HappBuildModeType} from "@ddd-qc/lit-happ";

import "@ddd-qc/path-explorer";

/** @ui5/webcomponents-fiori */
import "@ui5/webcomponents-fiori/dist/Bar.js";
import "@ui5/webcomponents-fiori/dist/NotificationListItem.js";
import "@ui5/webcomponents-fiori/dist/NotificationAction.js";
import "@ui5/webcomponents-fiori/dist/ShellBar.js";
import "@ui5/webcomponents-fiori/dist/ShellBarItem.js";
/** @ui5/webcomponents */
import "@ui5/webcomponents/dist/Avatar.js"
import "@ui5/webcomponents/dist/AvatarGroup.js"
import "@ui5/webcomponents/dist/Badge.js";
import "@ui5/webcomponents/dist/BusyIndicator.js";
import "@ui5/webcomponents/dist/Button.js";
import "@ui5/webcomponents/dist/CustomListItem.js";
import "@ui5/webcomponents/dist/Card.js";
import "@ui5/webcomponents/dist/CardHeader.js";
import "@ui5/webcomponents/dist/Dialog.js";
import "@ui5/webcomponents/dist/Icon.js";
import "@ui5/webcomponents/dist/Label.js";
import "@ui5/webcomponents/dist/List.js";
import "@ui5/webcomponents/dist/Input.js";
import "@ui5/webcomponents/dist/Menu.js";
import "@ui5/webcomponents/dist/MultiInput.js";
import "@ui5/webcomponents/dist/Option.js";
import "@ui5/webcomponents/dist/Popover.js";
import "@ui5/webcomponents/dist/ProgressIndicator.js";
import "@ui5/webcomponents/dist/features/InputSuggestions.js";
import "@ui5/webcomponents/dist/Select.js";
import "@ui5/webcomponents/dist/StandardListItem.js";
import "@ui5/webcomponents/dist/SuggestionItem.js";
import "@ui5/webcomponents/dist/Toast.js";
import "@ui5/webcomponents/dist/Tree.js"
import "@ui5/webcomponents/dist/TreeItem.js";
import "@ui5/webcomponents/dist/TreeItemCustom.js";

import Toast from "@ui5/webcomponents/dist/Toast";
import Dialog from "@ui5/webcomponents/dist/Dialog";
import Popover from "@ui5/webcomponents/dist/Popover";
import Input from "@ui5/webcomponents/dist/Input";

/** @ui5/webcomponents-icons */
//import "@ui5/webcomponents-icons/dist/allIcons-static.js";
import "@ui5/webcomponents-icons/dist/action-settings.js"
import "@ui5/webcomponents-icons/dist/activate.js"
import "@ui5/webcomponents-icons/dist/add.js"
import "@ui5/webcomponents-icons/dist/attachment.js"
import "@ui5/webcomponents-icons/dist/attachment-text-file.js"
import "@ui5/webcomponents-icons/dist/attachment-photo.js"
import "@ui5/webcomponents-icons/dist/attachment-video.js"
import "@ui5/webcomponents-icons/dist/attachment-audio.js"
import "@ui5/webcomponents-icons/dist/attachment-zip-file.js"
import "@ui5/webcomponents-icons/dist/chain-link.js"
import "@ui5/webcomponents-icons/dist/close-command-field.js"
import "@ui5/webcomponents-icons/dist/comment.js"
import "@ui5/webcomponents-icons/dist/document.js"
import "@ui5/webcomponents-icons/dist/document-text.js"
import "@ui5/webcomponents-icons/dist/delete.js"
import "@ui5/webcomponents-icons/dist/discussion.js"
import "@ui5/webcomponents-icons/dist/documents.js"
import "@ui5/webcomponents-icons/dist/dropdown.js"
import "@ui5/webcomponents-icons/dist/download.js"
import "@ui5/webcomponents-icons/dist/email.js"
import "@ui5/webcomponents-icons/dist/error.js"
import "@ui5/webcomponents-icons/dist/feedback.js"
import "@ui5/webcomponents-icons/dist/home.js"
import "@ui5/webcomponents-icons/dist/hide.js"
import "@ui5/webcomponents-icons/dist/inbox.js"
import "@ui5/webcomponents-icons/dist/information.js"
import "@ui5/webcomponents-icons/dist/number-sign.js"
import "@ui5/webcomponents-icons/dist/message-success.js"
import "@ui5/webcomponents-icons/dist/org-chart.js"
import "@ui5/webcomponents-icons/dist/open-folder.js"
import "@ui5/webcomponents-icons/dist/process.js"
import "@ui5/webcomponents-icons/dist/pdf-attachment.js"
import "@ui5/webcomponents-icons/dist/save.js"
import "@ui5/webcomponents-icons/dist/sys-add.js"
import "@ui5/webcomponents-icons/dist/show.js"
import "@ui5/webcomponents-icons/dist/synchronize.js"
import "@ui5/webcomponents-icons/dist/warning.js"
import "@ui5/webcomponents-icons/dist/workflow-tasks.js"

/**  */

import {Dictionary} from "@ddd-qc/cell-proxy";

import '@vaadin/grid/theme/lumo/vaadin-grid.js';
import '@vaadin/grid/theme/lumo/vaadin-grid-selection-column.js';

import {
  ThreadsDvm,
  ThreadsEntryType,
  ThreadsPerspective,
  CommentRequest,
  parseMentions,
  ChatThreadView,
  weClientContext,
  AnyLinkableHashB64,
  ThreadsDnaPerspective,
  globaFilesContext,
  NotifiableEventType,
  JumpEvent,
  AnyBead, decodeHrl, wePerspectiveContext, WePerspective, ParticipationProtocol
} from "@threads/elements";

import {
  decodeHashFromBase64,
  DnaHashB64,
  encodeHashToBase64,
} from "@holochain/client";

import {
  AppletId,
  AppletInfo, Hrl, WeNotification,
  WeServices,
} from "@lightningrodlabs/we-applet";
import {consume, ContextProvider, createContext} from "@lit/context";
import {shellBarStyleTemplate} from "@threads/elements";

//import "./input-bar";

import {Profile as ProfileMat} from "@ddd-qc/profiles-dvm";
import {FileTableItem} from "@ddd-qc/files/dist/elements/file-table";
import {FilesDvm, SplitObject} from "@ddd-qc/files";
import {StoreDialog} from "@ddd-qc/files/dist/elements/store-dialog";
import {HAPP_BUILD_MODE} from "@ddd-qc/lit-happ/dist/globals";
import {msg} from "@lit/localize";
import {setLocale} from "./localization";
import {composeNotificationTitle, renderAvatar} from "@threads/elements/dist/render";
import {toasty} from "@threads/elements/dist/toast";
import {stringifyHrl, wrapPathInSvg} from "@ddd-qc/we-utils";
import {mdiAlertOctagonOutline, mdiAlertOutline, mdiCheckCircleOutline, mdiInformationOutline, mdiCog} from "@mdi/js";
import {parseSearchInput} from "@threads/elements/dist/search";

// HACK: For some reason hc-sandbox gives the dna name as cell name instead of the role name...
const FILES_CELL_NAME = HAPP_BUILD_MODE == HappBuildModeType.Debug? 'dFiles' : 'rFiles';

console.log("FILES_CELL_NAME", FILES_CELL_NAME);


/**
 * @element
 */
@customElement("threads-page")
export class ThreadsPage extends DnaElement<ThreadsDnaPerspective, ThreadsDvm> {

  constructor() {
    super(ThreadsDvm.DEFAULT_BASE_ROLE_NAME);
    /** Create a fake appletId for testing without We */
    //fakeEntryHash().then((eh) => this.appletId = encodeHashToBase64(eh));

    this.addEventListener('beforeunload', (e) => {
      console.log("<threads-page> beforeunload", e);
      // await this._dvm.threadsZvm.commitSearchLogs();
    });

    new ContextProvider(this, wePerspectiveContext, this.wePerspective);
  }


  /** -- Fields -- */
  @state() private _initialized = false;
  @state() private _selectedThreadHash: AnyLinkableHashB64 = '';
  @state() private _selectedCommentThreadHash: AnyLinkableHashB64 = '';
  private _selectedThreadSubjectName: string = '';
  @state() private _createTopicHash: AnyLinkableHashB64 = '';

  @state() private _canShowComments = false;
  @state() private _canShowSearchResults = false;
  @state() private _canShowDebug = false;
  @state() private _appletToShow: DnaHashB64 | null = null;

  @state() private _canViewArchivedTopics = false;
  @state() private _currentCommentRequest?: CommentRequest;

  @state() private _splitObj?: SplitObject;

  @property() appletId: AppletId;

  @property({type: Object, attribute: false, hasChanged: (_v, _old) => true})
  threadsPerspective!: ThreadsPerspective;

  @consume({ context: globaFilesContext, subscribe: true })
  _filesDvm!: FilesDvm;

  @consume({ context: weClientContext, subscribe: true })
  weServices!: WeServices;

  private wePerspective: WePerspective = { applets: {}, attachables: {}};


  /** -- Getters -- */

  get createTopicDialogElem(): Dialog {
    return this.shadowRoot.getElementById("create-topic-dialog") as Dialog;
  }

  get createThreadDialogElem(): Dialog {
    return this.shadowRoot.getElementById("create-thread-dialog") as Dialog;
  }

  get profileDialogElem(): Dialog {
    return this.shadowRoot!.getElementById("profile-dialog") as Dialog;
  }


  /** -- Update -- */

  /** */
  protected async dvmUpdated(newDvm: ThreadsDvm, oldDvm?: ThreadsDvm): Promise<void> {
    console.log("<threads-page>.dvmUpdated()");
    if (oldDvm) {
      console.log("\t Unsubscribed to threadsZvm's roleName = ", oldDvm.threadsZvm.cell.name)
      oldDvm.threadsZvm.unsubscribe(this);
    }
    newDvm.threadsZvm.subscribe(this, 'threadsPerspective');
    console.log("\t Subscribed threadsZvm's roleName = ", newDvm.threadsZvm.cell.name)
    newDvm.probeAll();
    this._selectedThreadHash = '';
    this._initialized = true;
  }


  /** -- Update -- */

  /** */
  async onCreateTopic(e) {
    const input = this.shadowRoot!.getElementById("topicTitleInput") as HTMLInputElement;
    await this._dvm.publishSemanticTopic(input.value);
    //console.log("onCreateList() res:", res)
    input.value = "";
    this.createTopicDialogElem.close();
  }


  /** */
  async onCreateThread(e) {
    const input = this.shadowRoot!.getElementById("threadPurposeInput") as HTMLInputElement;
    const ah = await this._dvm.publishThreadFromSemanticTopic(this.appletId, this._createTopicHash, input.value)[1];
    //console.log("onCreateList() res:", res)
    input.value = "";
    this._selectedThreadHash = ah;
    this.createThreadDialogElem.close(false)
  }


  /** */
  async onCreateTextMessage(inputText: string) {
    console.log("onCreateTextMessage", inputText)

    const mentions = parseMentions(inputText);
    console.log("parseMentions", mentions);
    console.log("parseMentions reversed", this._dvm.profilesZvm.perspective.reversed);
    const mentionedAgents = this._dvm.profilesZvm.findProfiles(mentions);
    console.log("parseMentions mentionedAgents", mentionedAgents);

    let threadHash = this._selectedThreadHash;

    if (this._currentCommentRequest) {
      threadHash = await this.createCommentThread(this._currentCommentRequest);
      this._currentCommentRequest = undefined;
    }
    let res = await this._dvm.publishTypedBead(ThreadsEntryType.TextBead, inputText, threadHash, mentionedAgents);
    console.log("onCreateTextMessage() res:", res);

    // /** DEBUG */
    // if (this.weServices) {
    //   const entryInfo = await this.weServices.entryInfo([decodeHashFromBase64(this.cell.dnaHash), decodeHashFromBase64(ah)]);
    //   console.log("entryInfo2", this.cell.dnaHash, entryInfo);
    // }
  }


  /** */
  async onCreateHrlMessage() {
    const maybeHrlc = await this.weServices.userSelectHrl();
    if (!maybeHrlc) return;
    console.log("onCreateHrlMessage()", stringifyHrl(maybeHrlc.hrl), maybeHrlc);
    //const entryInfo = await this.weServices.entryInfo(maybeHrl.hrl);
    // FIXME make sure hrl is an entryHash
    /*let ah =*/ await this._dvm.publishTypedBead(ThreadsEntryType.AnyBead, maybeHrlc.hrl, this._selectedThreadHash);
  }


  /** */
  async onCreateSemanticTopic(topic: string) {
    await this._dvm.publishSemanticTopic(topic);
  }



  /** After first render only */
  async firstUpdated() {
    // this._initialized = true;
    console.log("<threads-page> firstUpdated() appletId", this.appletId);

    /** Generate test data */
    if (!this.appletId) {
      this.appletId = "FakeAppletId";
      //this.appletId = encodeHashToBase64(await emptyAppletId());
      console.warn("no appletId provided. A fake one has been generated", this.appletId);
    }
    //await this._dvm.threadsZvm.generateTestData(this.appletId);

    /** */
    const leftSide = this.shadowRoot.getElementById("leftSide");
    leftSide.style.background = "#B9CCE7";


    /** Grab all AppletIds */
    if (this.weServices) {
      console.log("<threads-page> firstUpdated() calling probeAllAppletIds()", this.weServices);
      const appletIds = await this._dvm.threadsZvm.probeAllAppletIds();
      console.log("<threads-page> appletIds", appletIds);
      for (const appletId of appletIds) {
        const appletInfo = await this.weServices.appletInfo(decodeHashFromBase64(appletId));
        console.log("<threads-page> firstUpdated() appletInfo for", appletId, appletInfo);
        this.wePerspective.applets[appletId] = appletInfo;
      }
    }
    this.requestUpdate();
    /** */
    this.pingAllOthers();
  }

  private _lastKnownNotificationIndex = 0;


  /** */
  protected async updated(_changedProperties: PropertyValues) {
    /** ??? */
    try {
      const chatView = this.shadowRoot.getElementById("chat-view") as ChatThreadView;
      const view = await chatView.updateComplete;
      //console.log("ChatView.parent.updated() ", view, chatView.scrollTop, chatView.scrollHeight, chatView.clientHeight)
      if (!view) {
        /** Request a new update for scrolling to work */
        chatView.requestUpdate();
      }
    } catch(e) {
      /** i.e. element not present */
    }

    /** Fiddle with shadow parts CSS */
    const shellBar = this.shadowRoot.getElementById('topicBar') as HTMLElement;
    if (shellBar) {
      shellBar.shadowRoot.appendChild(shellBarStyleTemplate.content.cloneNode(true));
    }

    /** Grab AttachableInfo for all AnyBeads */
    for (const [beadInfo, beadPair] of Object.entries(this.threadsPerspective.beads)) {
      if (beadInfo != ThreadsEntryType.AnyBead) {
        continue;
      }
      const anyBead = beadPair[1] as AnyBead;
      const hrl = decodeHrl(anyBead.value);
      const sHrl = stringifyHrl(hrl);
      if (!this.wePerspective.attachables[sHrl]) {
        this.wePerspective.attachables[sHrl] = await this.weServices.attachableInfo({hrl});
        this.requestUpdate();
      }
    }


    /** Create popups from signaled Notifications */
    const weNotifs = [];
    for (const notif of this.perspective.signaledNotifications.slice(this._lastKnownNotificationIndex)) {
      const author = this._dvm.profilesZvm.perspective.profiles[encodeHashToBase64(notif.author)] ? this._dvm.profilesZvm.perspective.profiles[encodeHashToBase64(notif.author)].nickname : "unknown";
      const canPopup = author != this.cell.agentPubKey || HAPP_BUILD_MODE == HappBuildModeType.Debug;
      //const date = new Date(notif.timestamp / 1000); // Holochain timestamp is in micro-seconds, Date wants milliseconds
      //const date_str = timeSince(date) + " ago";
      const [notifTitle, notifBody] = composeNotificationTitle(notif, this._dvm.threadsZvm, this._filesDvm, this.wePerspective);
      let message = `${notifBody} from @${author}.` ; // | ${date_str}`;
      /** in-app toast */
      if (canPopup) {
        toasty(notifTitle + " " + message);
      }
      /** We Notification */
      if (this.weServices) {
        const myNotif: WeNotification = {
          title: notifTitle,
          body: message,
          notification_type: JSON.stringify(notif.event),
          icon_src: wrapPathInSvg(mdiInformationOutline),
          urgency: 'high',
          timestamp: notif.timestamp / 1000,
        }
        weNotifs.push(myNotif);
      }
      this._lastKnownNotificationIndex += 1;
    }
    if (this.weServices && weNotifs.length > 0) {
      this.weServices.notifyWe(weNotifs);
    }
  }


  /** */
  async handleColorChange(e: any) {
    console.log("handleColorChange: " + e.target.lastValueEmitted)
    const color = e.target.lastValueEmitted;
    const profile = this._dvm.profilesZvm.getMyProfile()!;
    await this.setMyProfile(profile.nickname, profile.fields['avatar'], color)
  }


  /** */
  async setMyProfile(nickname: string, avatar: string, color: string) {
    console.log("updateProfile() called:", nickname)
    const fields: Dictionary<string> = {};
    fields['color'] = color;
    fields['avatar'] = avatar;
    try {
      if (this._dvm.profilesZvm.getProfile(this._dvm.cell.agentPubKey)) {
        await this._dvm.profilesZvm.updateMyProfile({nickname, fields});
      } else {
        await this._dvm.profilesZvm.createMyProfile({nickname, fields});
      }
    } catch (e) {
      console.log("createMyProfile() failed");
      console.log(e);
    }
  }


  /** */
  private async onSaveProfile(profile: ProfileMat) {
    console.log("onSaveProfile()", profile)
    try {
      await this._dvm.profilesZvm.updateMyProfile(profile);
    } catch(e) {
      await this._dvm.profilesZvm.createMyProfile(profile);
    }
    this.profileDialogElem.close(false);
    this.requestUpdate();
  }


  /** */
  async pingActiveOthers() {
    //if (this._currentSpaceEh) {
    console.log("Pinging All Active");
    const currentPeers = this._dvm.allCurrentOthers(this._dvm.profilesZvm.getAgents());
    await this._dvm.pingPeers(undefined, currentPeers);
    //}
  }


  /** */
  async pingAllOthers() {
    //if (this._currentSpaceEh) {
    const agents = this._dvm.profilesZvm.getAgents().filter((agentKey) => agentKey != this.cell.agentPubKey);
    console.log("Pinging All Others", agents);
    await this._dvm.pingPeers(undefined, agents);
    //}
  }


  /** */
  async onCommentingClicked(e: CustomEvent<CommentRequest>) {
    console.log("onCommentingClicked()", e);
    const request = e.detail;

    if (request.viewType == "side") {
      const threadHash = request.maybeCommentThread? request.maybeCommentThread : await this.createCommentThread(request);
      this._canShowComments = true;
      this._selectedCommentThreadHash = threadHash;
      this._selectedThreadSubjectName = request.subjectName;
      return;
    }

    if (!request.maybeCommentThread) {
      this._currentCommentRequest = request;
      //this._selectedThreadSubjectName = request.subjectName;
      return;
    }
  }

  /** */
  async createCommentThread(request: CommentRequest) {
    const pp: ParticipationProtocol = {
        purpose: "comment",
        rules: "N/A",
        subject: {
          hash: decodeHashFromBase64(request.subjectHash),
          typeName: request.subjectType,
          //appletHash: decodeHashFromBase64(this.appletId),
          appletId: this.appletId,
          dnaHash: decodeHashFromBase64(this.cell.dnaHash),
        }
    };
    const [ppAh, _ppMat] = await this._dvm.threadsZvm.publishParticipationProtocol(pp);
    return ppAh;
  }


  /** */
  onAppletSelected(e) {
    console.log("onAppletSelected()", e);
    const selectedOption = e.detail.selectedOption;
    console.log("onAppletSelected() selectedOption", e.detail.selectedOption);
    if (selectedOption.id == "topics-option") {
      this._appletToShow = null;
    } else {
      this._appletToShow = selectedOption.id;
    }
    this.requestUpdate();
  }


  /** */
  onDnaThreadSelected(e) {
    console.log("onDnaThreadSelected()", e);
    if (e.detail.type == ThreadsEntryType.ParticipationProtocol) {
        this._selectedThreadHash = e.detail.target;
    }
  }

  @state() private _hideFiles = true;


  /** */
  uploadFile() {
    var input = document.createElement('input');
    input.type = 'file';
    input.onchange = async (e:any) => {
      console.log("target upload file", e);
      const file = e.target.files[0];
      // if (file.size > this._dvm.dnaProperties.maxParcelSize) {
      //   //toastError(`File is too big ${prettyFileSize(file.size)}. Maximum file size: ${prettyFileSize(this._dvm.dnaProperties.maxParcelSize)}`)
      //   return;
      // }
      this._splitObj = await this._filesDvm.startPublishFile(file, [], async (eh) => {
        console.log("<threads-page> startPublishFile callback", eh);
        /*let ah =*/ this._dvm.publishTypedBead(ThreadsEntryType.EntryBead, eh, this._selectedThreadHash);
        this._splitObj = undefined;
      });
      console.log("uploadFile()", this._splitObj);
    }
    input.click();
  }


  /** */
  async onJump(e: CustomEvent<JumpEvent>) {
    //console.log("requesting jump to bead", e.detail);
    if (NotifiableEventType.Fork in e.detail.type) {
      this._selectedThreadHash = e.detail.hash;
    }
    if (NotifiableEventType.Reply in e.detail.type || NotifiableEventType.Mention in e.detail.type) {
      //const tuple = await this._dvm.threadsZvm.zomeProxy.getTextMessage(decodeHashFromBase64(e.detail));
      //this._selectedThreadHash = encodeHashToBase64(tuple[2].bead.forProtocolAh);
      const beadInfo = await this._dvm.threadsZvm.getBeadInfo(e.detail.hash);
      this._selectedThreadHash = encodeHashToBase64(beadInfo.bead.ppAh);
    }
    if (NotifiableEventType.Dm in e.detail.type) {
      // TODO
    }
    const popover = this.shadowRoot.getElementById("notifPopover") as Popover;
    if (popover.isOpen()) {
      popover.close();
    }
    this._canShowSearchResults = false;
  }


  /** */
  downloadTextFile(filename: string, content: string): void {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }


  /** */
  render() {
    console.log("<threads-page>.render()", this._initialized, this._selectedThreadHash, this._dvm.profilesZvm);

    let centerSide = html`<h1 style="margin:auto;">${msg("No thread selected")}</h1>`
    let threadTitle = "Threads";
    if (this._selectedThreadHash) {
      const thread = this.threadsPerspective.threads.get(this._selectedThreadHash);
      if (!thread) {
        this._dvm.threadsZvm.fetchPp(this._selectedThreadHash);
      } else {
        const maybeSemanticTopicThread = this.threadsPerspective.allSemanticTopics[thread.pp.subject.hash];
        let topic = "Reply";
         if (maybeSemanticTopicThread) {
           const [semTopic, _topicHidden] = maybeSemanticTopicThread;
           threadTitle = thread.name;
           topic = semTopic;
         } else {
           threadTitle = `Thread about Message `;
         }

        /** Check uploading state */
        let pct = 100;
        if (this._splitObj) {
          /** auto refresh since we can't observe filesDvm */
          delay(500).then(() => {this.requestUpdate()});
          pct = Math.ceil(this._filesDvm.perspective.uploadState.chunks.length / this._filesDvm.perspective.uploadState.splitObj.numChunks * 100)
        }

        centerSide = html`
            <chat-thread-view id="chat-view" .threadHash=${this._selectedThreadHash}
                              @selected=${(e) => this.onThreadSelected(e.detail)}
            ></chat-thread-view>
            ${this._splitObj? html`
              <div id="uploadCard">
                <div style="padding:5px;">Uploading ${this._filesDvm.perspective.uploadState.file.name}</div>
                <ui5-progress-indicator style="width:100%;" value=${pct}></ui5-progress-indicator>
              </div>
            ` : html`
            <div class="reply-info" style="display: ${this._currentCommentRequest? "block" : "none"}">
              Thread about "${this._currentCommentRequest? this._currentCommentRequest.subjectName : ''}"
              <ui5-button icon="delete" design="Transparent"
                          style="border:none; padding:0px"
                          @click=${(e) => {this._currentCommentRequest = undefined;}}></ui5-button>
            </div>
            <threads-input-bar .profilesZvm=${this._dvm.profilesZvm} .topic=${topic}
                               .showHrlBtn=${!!this.weServices}
                               @input=${(e) => {e.preventDefault(); this.onCreateTextMessage(e.detail)}}
                               @upload=${(e) => {e.preventDefault(); this.uploadFile()}}
                               @grab_hrl=${async (e) => {e.preventDefault(); this.onCreateHrlMessage()}}
            ></threads-input-bar>`
            }
        `;
      }
    }


    /** This agent's profile info */
    let myProfile = this._dvm.profilesZvm.getMyProfile();
    if (!myProfile) {
      myProfile = {nickname: "unknown", fields: {lang: "en"}} as ProfileMat;
    }
    let lang = myProfile.fields['lang'];
    if (!lang || lang == "") {
      lang = "en";
    }
    setLocale(lang);

    const avatar = renderAvatar(this._dvm.profilesZvm, this.cell.agentPubKey, "S");

    //console.log("this._appletInfos", JSON.parse(JSON.stringify(this._appletInfos)));
    console.log("this.wePerspective.applets", this.wePerspective.applets, myProfile);
    let appletOptions = Object.entries(this.wePerspective.applets).map(([appletId, appletInfo]) => {
      console.log("appletInfo", appletInfo);
      if (!appletInfo) {
        return html``;
      }
      return html`<ui5-option id=${appletId} icon="discussion">${appletInfo.appletName}</ui5-option>`;
    }
    );
    console.log("appletOptions", appletOptions);


    let fileTable = html``;
    if (!this._hideFiles) {
      const publicItems = Object.entries(this._filesDvm.deliveryZvm.perspective.publicParcels)
          .map(([ppEh, [description, timestamp, author]]) => {
            //const [description, timestamp, author] = this.deliveryPerspective.publicParcels[ppEh];
            const isLocal = !!this._filesDvm.deliveryZvm.perspective.localPublicManifests[ppEh];
            return {ppEh, description, timestamp, author, isLocal, isPrivate: false} as FileTableItem;
          });
      console.log("dFiles dnaProperties", this._filesDvm.dnaProperties);
      console.log("dFiles filesDvm cell", this._filesDvm.cell);
      fileTable = html`
        <cell-context .cell=${this._filesDvm.cell}>
            <h2>Public Files</h2>
            <button @click=${(e) => {
                const storeDialogElem = this.shadowRoot.querySelector("store-dialog") as StoreDialog;
                storeDialogElem.open(false);
            }}>Add Public file</button>
            <store-dialog></store-dialog>        
            <file-table .items=${publicItems}></file-table>
            <activity-timeline></activity-timeline>
        </cell-context>          
      `;
    }

    const searchValue = this.shadowRoot.getElementById("search-field")? (this.shadowRoot.getElementById("search-field") as Input).value : "";
    const searchParameters = parseSearchInput(searchValue, this._dvm.profilesZvm.perspective);

    /** Render all */
    return html`
        <div id="mainDiv" @commenting-clicked=${this.onCommentingClicked}>
            <div id="leftSide">
                <ui5-select id="dna-select" class="select" style="background:#B9CCE7; width:auto; margin:0px;"
                            @change=${this.onAppletSelected}>
                    ${appletOptions}
                        <!--<ui5-option id=${this.appletId}>Threads</ui5-option>-->
                    <ui5-option id="topics-option" icon="org-chart" selected>Topics</ui5-option>
                </ui5-select>
                ${this._appletToShow ? html`
                    <applet-threads-tree .appletId=${this._appletToShow ? this._appletToShow : this.appletId}
                                         @selected="${this.onDnaThreadSelected}"></applet-threads-tree>
                ` : html`
                    <semantic-topics-view
                            .showArchivedTopics=${this._canViewArchivedTopics} 
                            @createThreadClicked=${(e) => {
                                this._createTopicHash = e.detail;
                                this.createThreadDialogElem.show()
                            }}
                            @selected=${(e) => this.onThreadSelected(e.detail)}
                    ></semantic-topics-view>

                    <ui5-button icon="add" style="margin:10px 30px 0px 30px;"
                                @click=${() => {
                                    console.log("createTopicDialogElem", this.createTopicDialogElem);
                                    this.createTopicDialogElem.show()
                                }}>
                        ${msg("Add New Topic")}
                    </ui5-button>
                    ${this._canViewArchivedTopics? html`
                      <ui5-button icon="hide" design="Attention"
                                  style="margin:10px 30px 10px 30px;"
                                  @click=${this.onShowArchiveTopicsBtn}>
                        ${msg("Hide Archived Topics")}
                      </ui5-button>
                    ` : html`
                    <ui5-button icon="show"
                                style="margin:10px 30px 10px 30px;"
                                @click=${this.onShowArchiveTopicsBtn}>
                      ${msg("View Archived Topics")}
                    </ui5-button>
                    `}                    
                    <ui5-button icon="save" design="Positive"
                                style="margin:10px 30px 10px 30px;"
                                @click=${this.onCommitBtn}>
                       ${msg("Mark all as read")}
                    </ui5-button>
                    <hr style="width:100%;margin:0px;color:aliceblue;"/>
                `}

                    <!--
                <div style="display:flex; flex-direction:row; height:44px; border:1px solid #fad0f1;background:#f1b0b0">
                    <ui5-button design="Transparent" icon="action-settings" tooltip="Go to settings"
                                @click=${async () => {
                    await this.updateComplete;
                    this.dispatchEvent(new CustomEvent('debug', {detail: true, bubbles: true, composed: true}));
                }}
                    ></ui5-button>
                    <ui5-button icon="activate" tooltip="Commit logs" design="Transparent"
                                @click=${this.onCommitBtn}></ui5-button>
                </div> -->
                <div id="profile-div" style="display: flex; flex-direction: row">
                    ${avatar}
                    <div style="display: flex; flex-direction: column; align-items: stretch;padding-top:18px;margin-left:5px;">
                        <div><abbr title=${this.cell.agentPubKey}>${myProfile.nickname}</abbr></div>
                            <!-- <div style="font-size: small">${this.cell.agentPubKey}</div> -->
                    </div>
                    <ui5-button style="margin-top:10px;"
                                design="Transparent" icon="action-settings" tooltip="Edit profile"
                                @click=${() => this.profileDialogElem.show()}
                    ></ui5-button>
                    <ui5-button style="margin-top:10px;"
                                design="Transparent" icon="download" tooltip="Export"
                                @click=${() => {
                                  const content = this._dvm.exportPerspective();
                                    this.downloadTextFile("dump.json", content);
                                }}></ui5-button>
                    <ui5-button style="margin-top:10px;"
                                design="Transparent" icon="open-folder" tooltip="Import"
                                @click=${() => {
                                        console.log("onImport()");
                                        //console.log("<store-dialog> localOnly", localOnly, this._localOnly);
                                        var input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = ".json";
                                        input.onchange = async (e:any) => {
                                            console.log("onImport() target download file", e);
                                            const file = e.target.files[0];
                                            if (!file) {
                                              console.error("No file selected");
                                              return;
                                            }
                                            const reader = new FileReader();
                                            reader.onload = (e) => {
                                                const contents = reader.result as string;
                                                //console.log(contents);
                                                this._dvm.importPerspective(contents);
                                            };
                                            // Read the file as text
                                            reader.readAsText(file);
                                        }
                                        input.click();
                                    
                                    //this.downloadTextFile("dump.json", content);
                                }}></ui5-button>         
                        <!--
                    <ui5-button style="margin-top:10px;"
                                design="Transparent" icon="documents" tooltip="Refresh"
                                @click=${() => {this._hideFiles = !this._hideFiles;}}></ui5-button>
                    -->
                  <!-- <ui5-button style="margin-top:10px;"
                                design="Transparent" icon="synchronize" tooltip="Refresh"
                                @click=${this.refresh}></ui5-button>  -->
                </div>
            </div>
            <div id="mainSide">
              <ui5-shellbar id="topicBar" primary-title=${threadTitle}
                            show-search-field show-notifications
                            notifications-count=${Object.keys(this._dvm.threadsZvm.perspective.inbox).length? Object.keys(this._dvm.threadsZvm.perspective.inbox).length : ""} 
                            @notifications-click=${() => {
                              const popover = this.shadowRoot.getElementById("notifPopover") as Popover;
                              if (popover.isOpen()) {
                                popover.close();
                                return;
                              }
                              const shellbar = this.shadowRoot.getElementById("topicBar");
                              popover.showAt(shellbar);
              }}>
                  <ui5-input id="search-field" slot="searchField" placeholder=${msg('Search')} show-clear-icon
                             @focusin=${(e) => {
                                 //console.log("<search-field>@focusin", e);
                                 let searchElem = this.shadowRoot.getElementById("search-field") as Input;
                                 let searchPopElem = this.shadowRoot.getElementById("searchPopover") as Popover;
                                 searchPopElem.showAt(searchElem, true);
                                 //searchPopElem.headerText = `${msg("SEARCH FOR")}: ${searchElem.value}`;
                             }}
                             @input=${(e) => {
                                 //console.log("<search-field>@input", e.keyCode, e);
                                 let searchElem = this.shadowRoot.getElementById("search-field") as Input;
                                 let searchPopElem = this.shadowRoot.getElementById("searchPopover") as Popover;
                                 if (searchElem.value == "") {
                                   searchPopElem.close();
                                   this._canShowSearchResults = false;
                                   return;
                                 }
                                 searchPopElem.showAt(searchElem, true);
                                 searchPopElem.headerText = `${msg("SEARCH FOR")}: ${searchElem.value}`;
                             }}
                             @keypress=${(e) => {
                               //console.log("<search-field>@change", e.keyCode, e);
                               //let searchElem = this.shadowRoot.getElementById("search-field") as Input;
                               let searchPopElem = this.shadowRoot.getElementById("searchPopover") as Popover;
                               //let searchResultElem = this.shadowRoot.getElementById("search-result-panel") as Popover;      
                               if (e.keyCode === 13) {
                                 searchPopElem.close();
                                 this._canShowSearchResults = true;
                                 this.requestUpdate(); // !important
                               }
                             }}                             
                  ></ui5-input>
                      <!--<ui5-shellbar-item icon="chain-link" tooltip="Toggle Debug" @click=${() => {this._dvm.dumpLogs(); this._canShowDebug = !this._canShowDebug;}}></ui5-shellbar-item> -->
                  <ui5-shellbar-item id="cmtButton" icon="comment" tooltip="Toggle Comments" @click=${() => {this._canShowComments = !this._canShowComments;}}></ui5-shellbar-item>
              </ui5-shellbar>

                <ui5-popover id="searchPopover" header-text="SEARCH FOR: " hide-arrow placement-type="Bottom" horizontal-align="Stretch">
                    <div class="popover-content">
                        <ui5-list mode="SingleSelect" separators="None">
                            <!-- <ui5-li-groupheader class="search-group-header">${msg("message contains")}</ui5-li-groupheader>
                            <ui5-li>Channels</ui5-li>
                            <ui5-li>FIXME</ui5-li>
                            <ui5-li>FIXME</ui5-li>
                            <hr style="color:#f4f4f4"/> -->
                            <ui5-li-groupheader class="search-group-header">${msg("Search Options")}</ui5-li-groupheader>
                            <ui5-li><b>in:</b> <i>thread name</i></ui5-li>
                            <ui5-li><b>from:</b> <i>user</i></ui5-li>
                            <ui5-li><b>mentions:</b> <i>user</i></ui5-li>
                            <ui5-li><b>before:</b> <i>date</i></ui5-li>
                            <ui5-li><b>after:</b> <i>date</i></ui5-li>
                        </ui5-list>
                    </div>
                </ui5-popover>
                
                <ui5-popover id="notifPopover" placement-type="Bottom" horizontal-align="Right" style="max-width: 500px">
                    <notification-list @jump=${this.onJump}></notification-list>
                </ui5-popover>

              <div id="lowerSide">
                <div id="centerSide">
                    ${centerSide}
                    ${fileTable}
                </div>
                <div id="commentSide"
                     style="display:${this._canShowComments ? 'flex' : 'none'}; flex-direction:column; background:#d8e4f4;min-width: 350px;">
                    <comment-thread-view .threadHash=${this._selectedCommentThreadHash} showInput="true"
                                         .subjectName="${this._selectedThreadSubjectName}"></comment-thread-view>
                </div>
                  <!-- <peer-list></peer-list> -->
                  <div id="rightSide" style="display: ${this._canShowSearchResults? "block" : "none"}">
                      <search-result-panel .parameters=${searchParameters} @jump=${this.onJump}></search-result-panel>                 
                  </div>
                  <anchor-tree id="debugSide"
                               style="display:${this._canShowDebug ? 'block' : 'none'};background:#f4d8db;"></anchor-tree>
              </div>
            </div>
         <!-- DIALOGS -->
        <!-- ProfileDialog -->
        <ui5-dialog id="profile-dialog" header-text="Edit Profile">
            <threads-edit-profile
                    allowCancel
                    .profile="${myProfile}"
                    .saveProfileLabel= ${msg('Edit Profile')}
                    @cancel-edit-profile=${() => this.profileDialogElem.close(false)}
                    @lang-selected=${(e: CustomEvent) => {
                      console.log("set locale", e.detail);
                      setLocale(e.detail)
                    }}
                    @save-profile=${(e: CustomEvent) => this.onSaveProfile(e.detail)}
            ></threads-edit-profile>
        </ui5-dialog>
        <!-- CreateTopicDialog -->
        <ui5-dialog id="create-topic-dialog" header-text="Create Topic">
            <section>
                <div>
                    <ui5-label for="topicTitleInput" required>Title:</ui5-label>
                    <ui5-input id="topicTitleInput" @keydown=${(e) => {
                        if (e.keyCode === 13) {
                            e.preventDefault();
                            this.onCreateTopic(e);
                        }
                    }}></ui5-input>
                </div>
            </section>
            <div slot="footer">
                <ui5-button id="createTopicDialogButton"
                            style="margin-top:5px" design="Emphasized" @click=${this.onCreateTopic}>Create
                </ui5-button>
                <ui5-button style="margin-top:5px" @click=${() => this.createTopicDialogElem.close(false)}>Cancel
                </ui5-button>
            </div>
        </ui5-dialog>
        <!-- CreateThreadDialog -->
        <ui5-dialog id="create-thread-dialog" header-text="Create new channel">
            <section>
                <div>
                    <ui5-label for="threadPurposeInput" required>Purpose:</ui5-label>
                    <ui5-input id="threadPurposeInput" @keydown=${(e) => {
                        if (e.keyCode === 13) {
                            e.preventDefault();
                            this.onCreateThread(e);
                        }
                    }}></ui5-input>
                </div>
            </section>
            <div slot="footer" style:
            "display:flex;">
            <ui5-button id="createThreadDialogButton" style="margin-top:5px" design="Emphasized"
                        @click=${this.onCreateThread} >Create
            </ui5-button>
            <ui5-button style="margin-top:5px" @click=${(e) => this.createThreadDialogElem.close(false)}>Cancel
            </ui5-button>
            </div>
        </ui5-dialog>
    `;
  }



  /** */
  async onThreadSelected(threadHash: AnyLinkableHashB64) {
    console.log("onThreadSelected()", threadHash)
    //this._dvm.threadsZvm.probeLatestBeads(threadHash)
    // const beadLinks = await this._dvm.threadsZvm.probeLatestBeads({ppAh: decodeHashFromBase64(threadHash), targetCount: 20})
    // console.log("onThreadSelected() beads found: ", beadLinks.length);
    this._selectedThreadHash = threadHash;
  }


  /** */
  async refresh(_e?: any) {
    await this._dvm.threadsZvm.probeInbox();
    console.log("Inbox:", Object.keys(this._dvm.threadsZvm.perspective.inbox).length);
    // const mentionsList = this.shadowRoot.getElementById("mentionsList") as MentionsList;
    // mentionsList.requestUpdate();
  }


  // /** */
  // async refresh(_e?: any) {
  //   await this._dvm.probeAll();
  //   await this.pingAllOthers();
  //   await this._dvm.threadsZvm.probeSubjectTypes(this.cell.dnaHash);
  //
  //   console.log("mentions:", this._dvm.threadsZvm.perspective.mentions.length);
  //
  //   /** DEBUGGING */
  //   //await this._dvm.generateTestSignals();
  //   let latestLogDate = new Date(this.threadsPerspective.globalProbeLog.time / 1000);
  //   console.debug("refresh()", latestLogDate)
  //   await this._dvm.threadsZvm.probeAllLatest();
  // }


  /** */
  async onCommitBtn(_e?: any) {
    toasty("All marked 'read'");
    await this._dvm.threadsZvm.commitProbeLogs();
  }


  /** */
  onShowArchiveTopicsBtn(_e?: any) {
    this._canViewArchivedTopics = !this._canViewArchivedTopics;
  }



  /** */
  static get styles() {
    return [
      css`
        :host {
          background: #FBFCFD;
          display: block;
          height: inherit;
        }

        .reply-info {
          background: #b4c4be;
          margin: 0px 10px -9px 10px;
          padding: 5px;
          border: 1px solid black;
        }
        .ui5-select-label-root {
          font-size: larger;
          font-weight: bold;
        }

        #mainDiv {
          display: flex;
          flex-direction: row;
          height: inherit;
        }

        #leftSide {
          background: #B9CCE7;
          width: 275px;
          min-width: 275px;
          display: flex;
          flex-direction: column;
          border: 0.01em solid #A3ACB9;
        }

        #mainSide {
          width: 100%;
          display: flex;
          flex-direction: column;
        }

        #lowerSide {
          display: flex;
          flex-direction: row;
          flex: 1;
          overflow-y: auto;
        }

        #centerSide {
          width: 100%;
          background: #FBFCFD;
          display: flex;
          flex-direction: column;
          margin-bottom: 5px;
        }

        #topicBar {
          background: #DBE3EF;
          /*border: 1px solid dimgray;*/
        }

        #topicBar::part(root) {
          /*background: #DBE3EF;*/
          /*border: 1px solid dimgray;*/
        }


        #rightSide {
          width: 500px;
          /*height: 100vh;*/
          background: #eaeaea;
          /*display: flex;*/
          /*flex-direction: column;*/
          background: #B9CCE7;
        }

        .chatAvatar {
          margin-top: 5px;
          margin-left: 5px;
          margin-bottom: 5px;
          margin-right: 5px;
          min-width: 48px;
        }

        #threadTitle {
          font-size: 18px;
          font-weight: bold;
        }

        #uploadCard {
          margin:auto;
          /*margin-left:10px;*/
          min-width: 350px;
          width: 90%;
          padding: 5px;
          display: flex;
          flex-direction: column;
          border:1px solid black;
          background: beige;
        }

        .popover-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-top: -20px;
          margin-left: -12px;
        }

        .flex-column {
          display: flex;
          flex-direction: column;
        }

        .popover-footer {
          display: flex;
          justify-content: flex-end;
          width: 100%;
          align-items: center;
          padding: 0.5rem 0;
        }

        .search-group-header {
          text-transform: uppercase;
          padding-top: 0px;
        }
      `,

    ];
  }
}

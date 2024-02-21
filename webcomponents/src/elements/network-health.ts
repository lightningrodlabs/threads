import {css, html, LitElement, PropertyValues} from "lit";
import {property, state, customElement} from "lit/decorators.js";
import {consume} from "@lit/context";

import '@weblogin/trendchart-elements';
import {appProxyContext} from "../contexts";
import {AppProxy, str2CellId} from "@ddd-qc/cell-proxy";
import {NetworkInfo, Timestamp} from "@holochain/client";
import {delay} from "@ddd-qc/lit-happ";
import {THREADS_DEFAULT_ROLE_NAME} from "../bindings/threads.types";

/**
 * @element
 */
@customElement("network-health")
export class NetworkHealth extends LitElement {


  @consume({ context: appProxyContext, subscribe: true})
  _appProxy: AppProxy;


  /* Auto update */
  updated() {
    this.onQueryNetworkInfo(undefined);
  }

  /** */
  render() {
    console.log("<network-health>.render()");

    if (!this._appProxy) {
      return html`no app proxy found via context`;
    }

    const allNetworkLogs = this._appProxy.networkInfoLogs;

    //const queryBtn = html`<ui5-button @click=${this.onQueryNetworkInfo}>Query</ui5-button>`
    const queryBtn = html``;

    if (Object.keys(allNetworkLogs).length == 0) {
      return html`no logs available ${queryBtn}`;
    }

    // /* Grab role_threads cell */
    // let cellLogs: [Timestamp, NetworkInfo][] = [];
    // for (const [cellIdStr, infoPair] of Object.entries(allNetworkLogs)) {
    //     const hcls  = this._appProxy.getLocations(str2CellId(cellIdStr));
    //     const cellName = this._appProxy.getCellName(hcls[0]);
    //     console.log("<network-health>.render() cellName", cellName);
    //     if (cellName == THREADS_DEFAULT_ROLE_NAME) {
    //       cellLogs = infoPair;
    //       break;
    //     }
    // }

    let cellLogs: [Timestamp, NetworkInfo][] = Object.entries(allNetworkLogs)[0][1];
    if (cellLogs.length == 0) {
      return html`no logs found ${queryBtn}`;
    }
    if (cellLogs.length > 20) {
      cellLogs = cellLogs.slice(-20);
    }

    const latestInfo = cellLogs[cellLogs.length - 1][1];

    const arcPct = (latestInfo.arc_size * 100).toFixed(0);
    const fetchKB = (latestInfo.fetch_pool_info.op_bytes_to_fetch / 1024).toFixed(0);

    const allFetchKBs = cellLogs.map(([ts, info]) => info.fetch_pool_info.op_bytes_to_fetch / 1024)

    const startingZero = allFetchKBs.length > 1? "" : "0,"

    //const lineValues = "[0,1,2,50,10,85,20,5,48]"; // testing values
    const lineValues = "[" + startingZero + allFetchKBs.join(", ") + "]";
    //console.log("<network-health>.render()", lineValues);


    /** */
    return html`
        <div id="pies">
          <div class="item">
            <div class="chart">
                <tc-pie id="peer-pie" tooltip="Peers" values="[${latestInfo.current_number_of_peers}]" shape-size="6" .max=${latestInfo.total_network_peers} static=""></tc-pie>
                <ui5-icon class="pie-icon" name="person-placeholder"></ui5-icon>
            </div>
            <div>
              <span>${latestInfo.current_number_of_peers} / ${latestInfo.total_network_peers}</span>
              <br/>
              <span>Peers</span>
            </div>
          </div>
          <div class="item">
              <div class="chart">
                  <tc-pie id="arc-pie" values="[${arcPct}]" shape-size="6" max="100" static=""></tc-pie>
                  <ui5-icon class="pie-icon" name="cloud"></ui5-icon>
              </div>
              <div>
                <span>${arcPct}%</span>
                <br/>
                <span>Arc</span>
              </div>
          </div>
        </div>
        <div id="fetch">
          <div class="title">
              <div id="fetch-title">
                <div>${fetchKB} KB</div>
                <div>Expected data</div>
              </div>
              <ui5-icon name="product" style="height: 1.5rem; width: 1.5rem;"></ui5-icon>
          </div>
          <tc-line values=${lineValues} tooltip="@V KB" min="0">
          </tc-line>
        </div>
        ${queryBtn}
    `;

  }


  /** */
  async onQueryNetworkInfo(e) {
    console.log("onQueryNetworkInfo()")
    this.dispatchEvent(new CustomEvent('queryNetworkInfo', {detail: null, bubbles: true, composed: true}));
    await delay(2000)
    this.requestUpdate();
  }


   /** */
  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 220px;
          /*overflow: clip;*/
        }

        .title {
          display: flex;
          flex-direction: row;
          padding: 8px;
        }
        
        #fetch-title {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        #pies {
          display: flex;
          flex-direction: row;
          gap: 15px;
        }

        .chart {
          width: 3rem;
          height: 3rem;
          box-sizing: border-box;
        }

        .item {
          display: flex;
          flex-direction: row;
          gap: 6px;
        }

        #peer-pie {
          --shape-color: #51A7E1;
          --area-color: #000000;
          --area-opacity: 0.1;
          width: 100%;
          height: 100%;
        }

        #arc-pie {
          --shape-color: #c52f2f;
          --area-color: #000000;
          --area-opacity: 0.1;
          width: 100%;
          height: 100%;
        }

        .pie-icon {
          width: 100%;
          margin-top: -35px;
          margin-bottom: 50px;
        }

        #fetch {
          background: rgb(242, 242, 242);
          border-radius: 15px;
        }
        
        tc-line {
          width: 100%;
          padding-bottom: 7px;
          --area-color: #a4c1e6;
          --area-opacity: 0.5;
          box-sizing: border-box;
        }
      `,

    ];
  }

}
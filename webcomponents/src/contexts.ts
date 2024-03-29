import {createContext} from "@lit/context";
import {FilesDvm} from "@ddd-qc/files";
import {AppletInfo, AttachableLocationAndInfo} from "@lightningrodlabs/we-applet";
import {AppProxy, Dictionary} from "@ddd-qc/cell-proxy";
import {WeServicesEx} from "@ddd-qc/we-utils";

export const THIS_APPLET_ID = "__this"

export const SUBJECT_TYPE_TYPE_NAME = "SubjectType";
export const PP_TYPE_NAME = "ParticipationProtocol";

export const weClientContext = createContext<WeServicesEx>('we_client');
//export const wePerspectiveContext = createContext<WePerspective>('we_perspective');
export const globaFilesContext = createContext<FilesDvm>('global/files');

export const appProxyContext = createContext<AppProxy>('_threads_app_proxy');


// /** */
// export interface WePerspective {
//   /** AppletHash -> AppletInfo */
//   applets: Dictionary<AppletInfo>,
//   /** sHrl -> AttachableLocationAndInfo */
//   attachables: Dictionary<AttachableLocationAndInfo>,
// }

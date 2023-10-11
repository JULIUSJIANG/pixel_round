import IndexGlobal from "../IndexGlobal.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MCRootStatusExperimentStatus from "./MCRootStatusExperimentStatus.js";
import MCRootStatusExperimentStatusSmooth from "./MCRootStatusExperimentStatusSmooth.js";
import MCRootStatus from "./MCRootStatus.js";
import MCRoot from "./MCRoot.js";
import MCRootStatusExperimentStatusCreate from "./MCRootStatusExperimentStatusCreate.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import DomExperimentLeft from "../ui/DomExperimentLeft.js";

export default class MCRootStatusExperiment extends MCRootStatus {

    listStatus = new Array <MCRootStatusExperimentStatus> ();

    mapIdToStatus = new Map <number, MCRootStatusExperimentStatus> ();

    constructor (mcRoot: MCRoot, id: number, name: string) {
        super (mcRoot, id, name);

        this.statusCreate = new MCRootStatusExperimentStatusCreate (this, 0);
        this.statusPreview = new MCRootStatusExperimentStatusSmooth (this, 1);
    }

    currStatus: MCRootStatusExperimentStatus;

    statusCreate: MCRootStatusExperimentStatusCreate;

    statusPreview: MCRootStatusExperimentStatusSmooth;

    enter (status: MCRootStatusExperimentStatus) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.onExit ();
        };
        this.currStatus.onEnter ();
        MgrData.inst.set (MgrDataItem.MC_STATUS_EXP_STATUS, this.currStatus.id);
    }

    onInit (): void {
        this.enter (this.mapIdToStatus.get (MgrData.inst.get (MgrDataItem.MC_STATUS_EXP_STATUS)));
    }

    onDisplay (): ReactComponentExtendInstance {
        return ReactComponentExtend.instantiateTag (
            MgrDomDefine.TAG_DIV,
            {
                style: {
                    [MgrDomDefine.STYLE_HEIGHT]: MgrDomDefine.STYLE_WIDTH_PERCENTAGE_0,
                    [MgrDomDefine.STYLE_FLEX_GROW]: 1,

                    [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                    [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW
                }
            },

            ReactComponentExtend.instantiateComponent (DomExperimentLeft, null),
            IndexGlobal.mcExp ().currStatus.onRender (),
        );
    }
}
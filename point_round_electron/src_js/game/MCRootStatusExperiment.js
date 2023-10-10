import IndexGlobal from "../IndexGlobal.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MCRootStatusExperimentStatusSmooth from "./MCRootStatusExperimentStatusSmooth.js";
import MCRootStatus from "./MCRootStatus.js";
import MCRootStatusExperimentStatusCreate from "./MCRootStatusExperimentStatusCreate.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import DomExperimentLeft from "../ui/DomExperimentLeft.js";
export default class MCRootStatusExperiment extends MCRootStatus {
    constructor(mcRoot, id, name) {
        super(mcRoot, id, name);
        this.listStatus = new Array();
        this.mapIdToStatus = new Map();
        this.statusCreate = new MCRootStatusExperimentStatusCreate(this, 0);
        this.statusPreview = new MCRootStatusExperimentStatusSmooth(this, 1);
    }
    enter(status) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.onExit();
        }
        ;
        this.currStatus.onEnter();
        MgrData.inst.set(MgrDataItem.DETAIL_MACHINE_STATUS, this.currStatus.id);
    }
    onInit() {
        for (let i = 0; i < this.listStatus.length; i++) {
            let listStatusI = this.listStatus[i];
            listStatusI.onInit();
        }
        ;
        this.enter(this.mapIdToStatus.get(MgrData.inst.get(MgrDataItem.DETAIL_MACHINE_STATUS)));
    }
    onDisplay() {
        return ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_HEIGHT]: MgrDomDefine.STYLE_WIDTH_PERCENTAGE_0,
                [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW
            }
        }, ReactComponentExtend.instantiateComponent(DomExperimentLeft, null), IndexGlobal.mcExp().currStatus.onRender());
    }
}

import IndexGlobal from "../IndexGlobal.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MCRootStatusExperimentDetailStatusSmooth from "./MCRootStatusExperimentDetailStatusSmooth.js";
import MCRootStatus from "./MCRootStatus.js";
import MCRootStatusExperimentDetailStatusCreate from "./MCRootStatusExperimentDetailStatusCreate.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import DomExperimentLeft from "../ui/DomExperimentLeft.js";
import MCRootStatusExperimentDragStatusHover from "./MCRootStatusExperimentDragStatusHover.js";
import MCRootStatusExperimentDragStatusTargeted from "./MCRootStatusExperimentDragStatusTargeted.js";
import MCRootStatusExperimentDragStatusIdle from "./MCRootStatusExperimentDragStatusIdle.js";
export default class MCRootStatusExperiment extends MCRootStatus {
    constructor(mcRoot, id, name) {
        super(mcRoot, id, name);
        this.detailListStatus = new Array();
        this.detailMapIdToStatus = new Map();
        this.detailStatusCreate = new MCRootStatusExperimentDetailStatusCreate(this, 0);
        this.detailStatusPreview = new MCRootStatusExperimentDetailStatusSmooth(this, 1);
        this.dragStatusIdle = new MCRootStatusExperimentDragStatusIdle(this);
        this.dargStatusHover = new MCRootStatusExperimentDragStatusHover(this);
        this.dragStatusTargeted = new MCRootStatusExperimentDragStatusTargeted(this);
    }
    detailEnter(status) {
        let rec = this.detailCurrStatus;
        this.detailCurrStatus = status;
        if (rec) {
            rec.onExit();
        }
        ;
        this.detailCurrStatus.onEnter();
        MgrData.inst.set(MgrDataItem.MC_STATUS_EXP_STATUS, this.detailCurrStatus.id);
    }
    dragEnter(status) {
        let rec = this.dragCurrStatus;
        this.dragCurrStatus = status;
        if (rec) {
            rec.onExit();
        }
        ;
        this.dragCurrStatus.onEnter();
    }
    onInit() {
        this.detailEnter(this.detailMapIdToStatus.get(MgrData.inst.get(MgrDataItem.MC_STATUS_EXP_STATUS)));
        this.dragEnter(this.dragStatusIdle);
    }
    onDisplay() {
        return ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_HEIGHT]: MgrDomDefine.STYLE_WIDTH_PERCENTAGE_0,
                [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW
            }
        }, ReactComponentExtend.instantiateComponent(DomExperimentLeft, null), IndexGlobal.mcExp().detailCurrStatus.onRender());
    }
}

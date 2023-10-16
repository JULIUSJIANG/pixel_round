import IndexGlobal from "../IndexGlobal.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MCRootStatusExperimentDetailStatus from "./MCRootStatusExperimentDetailStatus.js";
import MCRootStatusExperimentDetailStatusSmooth from "./MCRootStatusExperimentDetailStatusSmooth.js";
import MCRootStatus from "./MCRootStatus.js";
import MCRoot from "./MCRoot.js";
import MCRootStatusExperimentDetailStatusCreate from "./MCRootStatusExperimentDetailStatusCreate.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import DomExperimentLeft from "../ui/DomExperimentLeft.js";
import ExpImg from "./ExpImg.js";
import MCRootStatusDrawingBoardDragStatusIdle from "./MCRootStatusDrawingBoardDragStatusIdle.js";
import MCRootStatusExperimentDragStatusHover from "./MCRootStatusExperimentDragStatusHover.js";
import MCRootStatusExperimentDragStatusTargeted from "./MCRootStatusExperimentDragStatusTargeted.js";
import MCRootStatusExperimentDragStatus from "./MCRootStatusExperimentDragStatus.js";
import MCRootStatusExperimentDetailStatusCreateStatusIdle from "./MCRootStatusExperimentDetailStatusCreateStatusIdle.js";
import MCRootStatusExperimentDragStatusIdle from "./MCRootStatusExperimentDragStatusIdle.js";

export default class MCRootStatusExperiment extends MCRootStatus {

    constructor (mcRoot: MCRoot, id: number, name: string) {
        super (mcRoot, id, name);

        this.detailStatusCreate = new MCRootStatusExperimentDetailStatusCreate (this, 0);
        this.detailStatusPreview = new MCRootStatusExperimentDetailStatusSmooth (this, 1);

        this.dragStatusIdle = new MCRootStatusExperimentDragStatusIdle (this);
        this.dargStatusHover = new MCRootStatusExperimentDragStatusHover (this);
        this.dragStatusTargeted = new MCRootStatusExperimentDragStatusTargeted (this);
    }

    detailListStatus = new Array <MCRootStatusExperimentDetailStatus> ();

    detailMapIdToStatus = new Map <number, MCRootStatusExperimentDetailStatus> ();

    detailCurrStatus: MCRootStatusExperimentDetailStatus;

    detailStatusCreate: MCRootStatusExperimentDetailStatusCreate;

    detailStatusPreview: MCRootStatusExperimentDetailStatusSmooth;

    detailEnter (status: MCRootStatusExperimentDetailStatus) {
        let rec = this.detailCurrStatus;
        this.detailCurrStatus = status;
        if (rec) {
            rec.onExit ();
        };
        this.detailCurrStatus.onEnter ();
        MgrData.inst.set (MgrDataItem.MC_STATUS_EXP_STATUS, this.detailCurrStatus.id);
    }

    dragTargetStart: ExpImg;

    dragTargetHover: ExpImg;

    dragStatusIdle: MCRootStatusExperimentDragStatusIdle;

    dargStatusHover: MCRootStatusExperimentDragStatusHover;

    dragStatusTargeted: MCRootStatusExperimentDragStatusTargeted;

    dragCurrStatus: MCRootStatusExperimentDragStatus;

    dragEnter (status: MCRootStatusExperimentDragStatus) {
        let rec = this.dragCurrStatus;
        this.dragCurrStatus = status;
        if (rec) {
            rec.onExit ();
        };
        this.dragCurrStatus.onEnter ();
    }

    onInit (): void {
        this.detailEnter (this.detailMapIdToStatus.get (MgrData.inst.get (MgrDataItem.MC_STATUS_EXP_STATUS)));
        this.dragEnter (this.dragStatusIdle);
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
            IndexGlobal.mcExp ().detailCurrStatus.onRender (),
        );
    }
}
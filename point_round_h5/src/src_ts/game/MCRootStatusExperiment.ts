import IndexGlobal from "../IndexGlobal";
import MgrData from "../mgr/MgrData";
import MgrDataItem from "../mgr/MgrDataItem";
import MCRootStatusExperimentDetailStatus from "./MCRootStatusExperimentDetailStatus";
import MCRootStatusExperimentDetailStatusSmooth from "./MCRootStatusExperimentDetailStatusSmooth";
import MCRootStatus from "./MCRootStatus";
import MCRoot from "./MCRoot";
import MCRootStatusExperimentDetailStatusCreate from "./MCRootStatusExperimentDetailStatusCreate";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance";
import ReactComponentExtend from "../common/ReactComponentExtend";
import MgrDomDefine from "../mgr/MgrDomDefine";
import DomExperimentLeft from "../ui/DomExperimentLeft";
import ExpImg from "./ExpImg";
import MCRootStatusExperimentDragStatusHover from "./MCRootStatusExperimentDragStatusHover";
import MCRootStatusExperimentDragStatusTargeted from "./MCRootStatusExperimentDragStatusTargeted";
import MCRootStatusExperimentDragStatus from "./MCRootStatusExperimentDragStatus";
import MCRootStatusExperimentDragStatusIdle from "./MCRootStatusExperimentDragStatusIdle";

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
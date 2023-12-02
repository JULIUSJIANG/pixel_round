import IndexGlobal from "../IndexGlobal";
import ReactComponentExtend from "../common/ReactComponentExtend";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance";
import MgrDomDefine from "../mgr/MgrDomDefine";
import MgrGlobal from "../mgr/MgrGlobal";
import DomDrawingBoardLeft from "../ui/DomDrawingBoardLeft";
import DomDrawingBoardRightEmpty from "../ui/DomDrawingBoardRightEmpty";
import DomDrawingBoardRightPaint from "../ui/DomDrawingBoardRightPaint";
import DomDrawingBoardRightPaintCanvas from "../ui/DomDrawingBoardRightPaintCanvas";
import DBImg from "./DBImg";
import MCRoot from "./MCRoot";
import MCRootStatus from "./MCRootStatus";
import MCRootStatusDrawingBoardDragStatus from "./MCRootStatusDrawingBoardDragStatus";
import MCRootStatusDrawingBoardDragStatusHover from "./MCRootStatusDrawingBoardDragStatusHover";
import MCRootStatusDrawingBoardDragStatusIdle from "./MCRootStatusDrawingBoardDragStatusIdle";
import MCRootStatusDrawingBoardDragStatusTargeted from "./MCRootStatusDrawingBoardDragStatusTargeted";
import MCRootStatusDrawingBoardHoverStatus from "./MCRootStatusDrawingBoardHoverStatus";
import MCRootStatusDrawingBoardHoverStatusEntered from "./MCRootStatusDrawingBoardHoverStatusEntered";
import MCRootStatusDrawingBoardHoverStatusLeaved from "./MCRootStatusDrawingBoardHoverStatusLeaved";
import MCRootStatusDrawingBoardOpStatus from "./MCRootStatusDrawingBoardOpStatus";
import MCRootStatusDrawingBoardOpStatusEraser from "./MCRootStatusDrawingBoardOpStatusEraser";
import MCRootStatusDrawingBoardOpStatusPencil from "./MCRootStatusDrawingBoardOpStatusPencil";
import MCRootStatusDrawingBoardOpStatusStraw from "./MCRootStatusDrawingBoardOpStatusStraw";
import MCRootStatusDrawingBoardTouchPos from "./MCRootStatusDrawingBoardTouchPos";
import MCRootStatusDrawingBoardTouchStatus from "./MCRootStatusDrawingBoardTouchStatus";
import MCRootStatusDrawingBoardTouchStatusEnded from "./MCRootStatusDrawingBoardTouchStatusEnded";
import MCRootStatusDrawingBoardTouchStatusMoved from "./MCRootStatusDrawingBoardTouchStatusMoved";
import MCRootStatusDrawingBoardTouchStatusStarted from "./MCRootStatusDrawingBoardTouchStatusStarted";

/**
 * 根状态机 - 状态 - 画板模式
 */
class MCRootStatusDrawingBoard extends MCRootStatus {

    constructor (mcRoot: MCRoot, id: number, name: string) {
        super (mcRoot, id, name);

        this.touchPosStart = new MCRootStatusDrawingBoardTouchPos (this);
        this.touchPosMove = new MCRootStatusDrawingBoardTouchPos (this);
        this.touchPosEnd = new MCRootStatusDrawingBoardTouchPos (this);
        this.touchCurrentPos = this.touchPosMove;

        this.opStatusPencil = new MCRootStatusDrawingBoardOpStatusPencil (this, 0, `画笔 [A]`, `KeyA`);
        this.opStatusStraw = new MCRootStatusDrawingBoardOpStatusStraw (this, 1, `拾色器 [S]`, `KeyS`);
        this.opStatusEraser = new MCRootStatusDrawingBoardOpStatusEraser (this, 2, `橡皮擦 [D]`, `KeyD`);

        this.touchStatusEnded = new MCRootStatusDrawingBoardTouchStatusEnded (this);
        this.touchStatusStarted = new MCRootStatusDrawingBoardTouchStatusStarted (this);
        this.touchStatusMoved = new MCRootStatusDrawingBoardTouchStatusMoved (this);

        this.hoverStatusEntered = new MCRootStatusDrawingBoardHoverStatusEntered (this);
        this.hoverStatusLeaved = new MCRootStatusDrawingBoardHoverStatusLeaved (this);

        this.dragStatusIdle = new MCRootStatusDrawingBoardDragStatusIdle (this);
        this.dargStatusHover = new MCRootStatusDrawingBoardDragStatusHover (this);
        this.dragStatusTargeted = new MCRootStatusDrawingBoardDragStatusTargeted (this);
    }

    onInit (): void {
        this.opEnter (this.opStatusPencil);
        this.touchEnter (this.touchStatusEnded);
        this.hoverEnter (this.hoverStatusLeaved);
        this.dragEnter (this.dragStatusIdle);

        MgrGlobal.inst.evtKey.on ((evt) => {
            console.log (evt);
            this.touchCurrStatus.onCode (evt);
        });
    }
    
    opListStatus = new Array <MCRootStatusDrawingBoardOpStatus> ();
    
    opMapIdToStatus = new Map <number, MCRootStatusDrawingBoardOpStatus> ();

    opStatusPencil: MCRootStatusDrawingBoardOpStatusPencil;

    opStatusEraser: MCRootStatusDrawingBoardOpStatusEraser;

    opStatusStraw: MCRootStatusDrawingBoardOpStatusStraw;

    opCurrStatus: MCRootStatusDrawingBoardOpStatus;

    opMapCodeToStatus = new Map <string, MCRootStatusDrawingBoardOpStatus> ();

    opEnter (status: MCRootStatusDrawingBoardOpStatus) {
        let rec = this.opCurrStatus;
        this.opCurrStatus = status;
        if (rec) {
            rec.onExit ();
        };
        this.opCurrStatus.onEnter ();
    }

    touchPosStart: MCRootStatusDrawingBoardTouchPos;

    touchPosMove: MCRootStatusDrawingBoardTouchPos;

    touchPosEnd: MCRootStatusDrawingBoardTouchPos;

    touchCurrentPos: MCRootStatusDrawingBoardTouchPos;

    touchStatusEnded: MCRootStatusDrawingBoardTouchStatusEnded;

    touchStatusStarted: MCRootStatusDrawingBoardTouchStatusStarted;

    touchStatusMoved: MCRootStatusDrawingBoardTouchStatusMoved;

    touchCurrStatus: MCRootStatusDrawingBoardTouchStatus;

    touchEnter (status: MCRootStatusDrawingBoardTouchStatus) {
        let rec = this.touchCurrStatus;
        this.touchCurrStatus = status;
        if (rec) {
            rec.onExit ();
        };
        this.opCurrStatus.onEnter ();
    }

    hoverStatusEntered: MCRootStatusDrawingBoardHoverStatusEntered;

    hoverStatusLeaved: MCRootStatusDrawingBoardHoverStatusLeaved;

    hoverCurrStatus: MCRootStatusDrawingBoardHoverStatus;

    hoverEnter (status: MCRootStatusDrawingBoardHoverStatus) {
        let rec = this.hoverCurrStatus;
        this.hoverCurrStatus = status;
        if (rec) {
            rec.onExit ();
        };
        this.hoverCurrStatus.onEnter ();
    }

    dragTargetStart: DBImg;

    dragTargetHover: DBImg;

    dragStatusIdle: MCRootStatusDrawingBoardDragStatusIdle;

    dargStatusHover: MCRootStatusDrawingBoardDragStatusHover;

    dragStatusTargeted: MCRootStatusDrawingBoardDragStatusTargeted;

    dragCurrStatus: MCRootStatusDrawingBoardDragStatus;

    dragEnter (status: MCRootStatusDrawingBoardDragStatus) {
        let rec = this.dragCurrStatus;
        this.dragCurrStatus = status;
        if (rec) {
            rec.onExit ();
        };
        this.dragCurrStatus.onEnter ();
    }

    onDisplay (): ReactComponentExtendInstance {
        let instDisplay: ReactComponentExtendInstance;
        let currentImg = IndexGlobal.inst.dbCurrent ();;
        // 有可用图片
        if (currentImg != null) {
            instDisplay = ReactComponentExtend.instantiateComponent (DomDrawingBoardRightPaint, null)
        }   
        else {
            instDisplay = ReactComponentExtend.instantiateComponent (DomDrawingBoardRightEmpty, null);
        };
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

            ReactComponentExtend.instantiateComponent (DomDrawingBoardLeft, null),
            instDisplay,
        );
    }

    /**
     * 要捕获的组件
     */
    dom: DomDrawingBoardRightPaintCanvas;
    /**
     * 捕获 dom
     */
    catchDom (dom: DomDrawingBoardRightPaintCanvas) {
        this.dom = dom;
    }
}

export default MCRootStatusDrawingBoard;
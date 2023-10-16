import IndexGlobal from "../IndexGlobal.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import MgrGlobal from "../mgr/MgrGlobal.js";
import DomDrawingBoardLeft from "../ui/DomDrawingBoardLeft.js";
import DomDrawingBoardRightEmpty from "../ui/DomDrawingBoardRightEmpty.js";
import DomDrawingBoardRightPaint from "../ui/DomDrawingBoardRightPaint.js";
import MCRootStatus from "./MCRootStatus.js";
import MCRootStatusDrawingBoardDragStatusHover from "./MCRootStatusDrawingBoardDragStatusHover.js";
import MCRootStatusDrawingBoardDragStatusIdle from "./MCRootStatusDrawingBoardDragStatusIdle.js";
import MCRootStatusDrawingBoardDragStatusTargeted from "./MCRootStatusDrawingBoardDragStatusTargeted.js";
import MCRootStatusDrawingBoardHoverStatusEntered from "./MCRootStatusDrawingBoardHoverStatusEntered.js";
import MCRootStatusDrawingBoardHoverStatusLeaved from "./MCRootStatusDrawingBoardHoverStatusLeaved.js";
import MCRootStatusDrawingBoardOpStatusEraser from "./MCRootStatusDrawingBoardOpStatusEraser.js";
import MCRootStatusDrawingBoardOpStatusPencil from "./MCRootStatusDrawingBoardOpStatusPencil.js";
import MCRootStatusDrawingBoardOpStatusStraw from "./MCRootStatusDrawingBoardOpStatusStraw.js";
import MCRootStatusDrawingBoardTouchPos from "./MCRootStatusDrawingBoardTouchPos.js";
import MCRootStatusDrawingBoardTouchStatusEnded from "./MCRootStatusDrawingBoardTouchStatusEnded.js";
import MCRootStatusDrawingBoardTouchStatusMoved from "./MCRootStatusDrawingBoardTouchStatusMoved.js";
import MCRootStatusDrawingBoardTouchStatusStarted from "./MCRootStatusDrawingBoardTouchStatusStarted.js";
/**
 * 根状态机 - 状态 - 画板模式
 */
class MCRootStatusDrawingBoard extends MCRootStatus {
    constructor(mcRoot, id, name) {
        super(mcRoot, id, name);
        this.opListStatus = new Array();
        this.opMapIdToStatus = new Map();
        this.opMapCodeToStatus = new Map();
        this.touchPosStart = new MCRootStatusDrawingBoardTouchPos(this);
        this.touchPosMove = new MCRootStatusDrawingBoardTouchPos(this);
        this.touchPosEnd = new MCRootStatusDrawingBoardTouchPos(this);
        this.touchCurrentPos = this.touchPosMove;
        this.opStatusPencil = new MCRootStatusDrawingBoardOpStatusPencil(this, 0, `画笔 [1]`, `Digit1`);
        this.opStatusStraw = new MCRootStatusDrawingBoardOpStatusStraw(this, 1, `拾色器 [2]`, `Digit2`);
        this.opStatusEraser = new MCRootStatusDrawingBoardOpStatusEraser(this, 2, `橡皮擦 [3]`, `Digit3`);
        this.touchStatusEnded = new MCRootStatusDrawingBoardTouchStatusEnded(this);
        this.touchStatusStarted = new MCRootStatusDrawingBoardTouchStatusStarted(this);
        this.touchStatusMoved = new MCRootStatusDrawingBoardTouchStatusMoved(this);
        this.hoverStatusEntered = new MCRootStatusDrawingBoardHoverStatusEntered(this);
        this.hoverStatusLeaved = new MCRootStatusDrawingBoardHoverStatusLeaved(this);
        this.dragStatusIdle = new MCRootStatusDrawingBoardDragStatusIdle(this);
        this.dargStatusHover = new MCRootStatusDrawingBoardDragStatusHover(this);
        this.dragStatusTargeted = new MCRootStatusDrawingBoardDragStatusTargeted(this);
    }
    onInit() {
        this.opEnter(this.opStatusPencil);
        this.touchEnter(this.touchStatusEnded);
        this.hoverEnter(this.hoverStatusLeaved);
        this.dragEnter(this.dragStatusIdle);
        MgrGlobal.inst.evtKey.on((evt) => {
            this.touchCurrStatus.onCode(evt);
        });
    }
    opEnter(status) {
        let rec = this.opCurrStatus;
        this.opCurrStatus = status;
        if (rec) {
            rec.onExit();
        }
        ;
        this.opCurrStatus.onEnter();
    }
    touchEnter(status) {
        let rec = this.touchCurrStatus;
        this.touchCurrStatus = status;
        if (rec) {
            rec.onExit();
        }
        ;
        this.opCurrStatus.onEnter();
    }
    hoverEnter(status) {
        let rec = this.hoverCurrStatus;
        this.hoverCurrStatus = status;
        if (rec) {
            rec.onExit();
        }
        ;
        this.hoverCurrStatus.onEnter();
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
    onDisplay() {
        let instDisplay;
        let currentImg = IndexGlobal.inst.dbCurrent();
        ;
        // 有可用图片
        if (currentImg != null) {
            instDisplay = ReactComponentExtend.instantiateComponent(DomDrawingBoardRightPaint, null);
        }
        else {
            instDisplay = ReactComponentExtend.instantiateComponent(DomDrawingBoardRightEmpty, null);
        }
        ;
        return ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_HEIGHT]: MgrDomDefine.STYLE_WIDTH_PERCENTAGE_0,
                [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW
            }
        }, ReactComponentExtend.instantiateComponent(DomDrawingBoardLeft, null), instDisplay);
    }
    /**
     * 捕获 dom
     */
    catchDom(dom) {
        this.dom = dom;
    }
}
export default MCRootStatusDrawingBoard;

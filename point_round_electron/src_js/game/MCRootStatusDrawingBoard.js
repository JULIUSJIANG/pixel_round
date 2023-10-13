import IndexGlobal from "../IndexGlobal.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import DomDrawingBoardLeft from "../ui/DomDrawingBoardLeft.js";
import DomDrawingBoardRightEmpty from "../ui/DomDrawingBoardRightEmpty.js";
import DomDrawingBoardRightPaint from "../ui/DomDrawingBoardRightPaint.js";
import MCRootStatus from "./MCRootStatus.js";
import MCRootStatusDrawingBoardHoverStatusEntered from "./MCRootStatusDrawingBoardHoverStatusEntered.js";
import MCRootStatusDrawingBoardHoverStatusLeaved from "./MCRootStatusDrawingBoardHoverStatusLeaved.js";
import MCRootStatusDrawingBoardOpStatusEraser from "./MCRootStatusDrawingBoardOpStatusEraser.js";
import MCRootStatusDrawingBoardOpStatusPencil from "./MCRootStatusDrawingBoardOpStatusPencil.js";
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
        this.touchPosStart = new MCRootStatusDrawingBoardTouchPos(this);
        this.touchPosMove = new MCRootStatusDrawingBoardTouchPos(this);
        this.touchPosEnd = new MCRootStatusDrawingBoardTouchPos(this);
        this.touchCurrentPos = this.touchPosMove;
        this.opStatusPencil = new MCRootStatusDrawingBoardOpStatusPencil(this, 0, `画笔`);
        this.opStatusEraser = new MCRootStatusDrawingBoardOpStatusEraser(this, 1, `橡皮擦`);
        this.touchStatusEnded = new MCRootStatusDrawingBoardTouchStatusEnded(this);
        this.touchStatusStarted = new MCRootStatusDrawingBoardTouchStatusStarted(this);
        this.touchStatusMoved = new MCRootStatusDrawingBoardTouchStatusMoved(this);
        this.hoverStatusEntered = new MCRootStatusDrawingBoardHoverStatusEntered(this);
        this.hoverStatusLeaved = new MCRootStatusDrawingBoardHoverStatusLeaved(this);
    }
    onInit() {
        this.opEnter(this.opStatusPencil);
        this.touchEnter(this.touchStatusEnded);
        this.hoverEnter(this.hoverStatusLeaved);
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
    onDisplay() {
        let instDisplay;
        let currentImg = this.getCurrentCache();
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
     * 获取当前的缓存
     * @returns
     */
    getCurrentCache() {
        return IndexGlobal.inst.dbMapIdToImg.get(MgrData.inst.get(MgrDataItem.DB_CURRENT_IMG));
    }
    /**
     * 捕获 dom
     */
    catchDom(dom) {
        this.dom = dom;
    }
}
export default MCRootStatusDrawingBoard;

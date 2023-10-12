import JWebgl from "../common/JWebgl.js";
import JWebglColor from "../common/JWebglColor.js";
import DomDrawingBoardRightPaintCanvasSource from "../ui/DomDrawingBoardRightPaintCanvasSource.js";
import MCRootStatusDrawingBoard from "./MCRootStatusDrawingBoard.js";

/**
 * 根状态机 - 状态 - 画板模式 - 交互状态
 */
class MCRootStatusDrawingBoardTouchStatus {

    relMachine: MCRootStatusDrawingBoard;

    constructor (relMachine: MCRootStatusDrawingBoard) {
        this.relMachine = relMachine;
    }

    /**
     * 事件派发 - 进入状态
     */
    onEnter () {

    }

    /**
     * 事件派发 - 离开状态
     */
    onExit () {

    }

    /**
     * 事件派发 - 交互开始
     */
    onStart (dataSrc: DomDrawingBoardRightPaintCanvasSource) {

    }

    /**
     * 事件派发 - 交互中
     */
    onMove (dataSrc: DomDrawingBoardRightPaintCanvasSource) {

    }

    /**
     * 事件派发 - 交互结束
     */
    onEnd (dataSrc: DomDrawingBoardRightPaintCanvasSource) {

    }

    /**
     * 操作更新
     * @param dataSrc 
     */
    onOpUpdate (dataSrc: DomDrawingBoardRightPaintCanvasSource) {

    }

    /**
     * 事件派发 - 绘制
     */
    onFocusDraw (dataSrc: DomDrawingBoardRightPaintCanvasSource) {

    }
}

export default MCRootStatusDrawingBoardTouchStatus;
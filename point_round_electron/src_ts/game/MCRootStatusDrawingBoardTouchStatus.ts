import DomDrawingBoardRightPaintCanvas from "../ui/DomDrawingBoardRightPaintCanvas.js";
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
    onStart (dataSrc: DomDrawingBoardRightPaintCanvas) {

    }

    /**
     * 事件派发 - 交互中
     */
    onMove (dataSrc: DomDrawingBoardRightPaintCanvas) {

    }

    /**
     * 事件派发 - 交互结束
     */
    onEnd (dataSrc: DomDrawingBoardRightPaintCanvas) {

    }

    /**
     * 操作更新
     * @param dataSrc 
     */
    onOpUpdate (dataSrc: DomDrawingBoardRightPaintCanvas) {

    }

    /**
     * 事件派发 - 绘制
     */
    onFocusDraw (dataSrc: DomDrawingBoardRightPaintCanvas) {

    }
}

export default MCRootStatusDrawingBoardTouchStatus;
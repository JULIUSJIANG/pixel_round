import DomDrawingBoardRightPaintCanvas from "../ui/DomDrawingBoardRightPaintCanvas.js";
import DBImg from "./DBImg.js";
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

    /**
     * 事件派发 - 拖拽开始
     */
    onDragStart (dbImg: DBImg) {

    }

    /**
     * 事件派发 - 拖拽结束
     */
    onDragEnd () {

    }

    /**
     * 事件派发 - 拖拽进入
     */
    onDragEnter (dbImg: DBImg) {

    }

    /**
     * 事件派发 - 拖拽离开
     */
    onDragLeave () {

    }
}

export default MCRootStatusDrawingBoardTouchStatus;
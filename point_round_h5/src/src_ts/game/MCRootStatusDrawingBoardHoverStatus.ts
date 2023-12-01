import JWebgl from "../common/JWebgl";
import JWebglColor from "../common/JWebglColor";
import DomDrawingBoardRightPaintCanvas from "../ui/DomDrawingBoardRightPaintCanvas";
import MCRootStatusDrawingBoard from "./MCRootStatusDrawingBoard";

/**
 * 根状态机 - 状态 - 画板模式 - 进出状态
 */
class MCRootStatusDrawingBoardHoverStatus {

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
     * 事件派发 - 进入画布
     */
    onHoverEnter () {

    }

    /**
     * 事件派发 - 离开画布
     */
    onHoverExit () {

    }

    /**
     * 事件派发 - 操作更新
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

export default MCRootStatusDrawingBoardHoverStatus;
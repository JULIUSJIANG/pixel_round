import JWebgl from "../common/JWebgl.js";
import JWebglColor from "../common/JWebglColor.js";
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
     * @param canvasX 
     * @param canvasY 
     */
    onStart (canvasX: number, canvasY: number) {

    }

    /**
     * 事件派发 - 交互中
     * @param canvasX 
     * @param canvasY 
     */
    onMove (canvasX: number, canvasY: number) {

    }

    /**
     * 事件派发 - 交互结束
     * @param canvasX 
     * @param canvasY 
     */
    onEnd (canvasX: number, canvasY: number) {

    }

    /**
     * 事件派发 - 绘制
     */
    onFocusDraw (jWebgl: JWebgl, color: JWebglColor) {

    }
}

export default MCRootStatusDrawingBoardTouchStatus;
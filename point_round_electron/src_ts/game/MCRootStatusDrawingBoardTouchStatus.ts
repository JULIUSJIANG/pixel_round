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

    onStart (canvasX: number, canvasY: number) {

    }

    onMove (canvasX: number, canvasY: number) {

    }

    onEnd (canvasX: number, canvasY: number) {

    }
}

export default MCRootStatusDrawingBoardTouchStatus;
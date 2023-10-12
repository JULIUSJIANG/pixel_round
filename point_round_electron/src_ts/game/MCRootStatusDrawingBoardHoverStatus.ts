import MCRootStatusDrawingBoard from "./MCRootStatusDrawingBoard.js";

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
}

export default MCRootStatusDrawingBoardHoverStatus;
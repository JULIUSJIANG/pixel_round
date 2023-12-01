import DBImg from "./DBImg";
import MCRootStatusDrawingBoard from "./MCRootStatusDrawingBoard";

/**
 * 根状态 - 状态 - 画板模式 - 拖拽状态
 */
class MCRootStatusDrawingBoardDragStatus {

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
     * 拖拽开始
     * @param dbImg 
     */
    onStart (dbImg: DBImg) {

    }

    /**
     * 拖拽结束
     */
    onEnd () {

    }

    /**
     * 拖拽目标进入
     * @param dbImg 
     */
    onTargetEnter (dbImg: DBImg) {

    }

    /**
     * 拖拽目标离开
     */
    onTargetEnterLeave () {

    }
}

export default MCRootStatusDrawingBoardDragStatus;
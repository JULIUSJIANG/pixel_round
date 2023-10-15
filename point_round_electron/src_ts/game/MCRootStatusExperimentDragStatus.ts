import DBImg from "./DBImg.js";
import ExpImg from "./ExpImg.js";
import MCRootStatusDrawingBoard from "./MCRootStatusDrawingBoard.js";
import MCRootStatusExperiment from "./MCRootStatusExperiment.js";

/**
 * 根状态 - 状态 - 画板模式 - 拖拽状态
 */
class MCRootStatusExperimentDragStatus {

    relMachine: MCRootStatusExperiment;

    constructor (relMachine: MCRootStatusExperiment) {
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
    onStart (expImg: ExpImg) {

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
    onTargetEnter (expImg: ExpImg) {

    }

    /**
     * 拖拽目标离开
     */
    onTargetEnterLeave () {

    }
}

export default MCRootStatusExperimentDragStatus;
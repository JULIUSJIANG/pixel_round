import CornerMachine from "./CornerMachine.js";
import CornerTypeRSSide from "./CornerTypeRSSide.js";

/**
 * 角状态机 - 状态
 */
class CornerMachineStatus {

    relMachine: CornerMachine;

    constructor (relMachine: CornerMachine) {
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
     * 事件派发 - 获取拐角类型
     * @returns 
     */
    onGetCornerType () {
        return CornerTypeRSSide.none;
    }
}

export default CornerMachineStatus;
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance";
import MCRoot from "./MCRoot";

/**
 * 根状态机 - 状态
 */
class MCRootStatus {

    relMC: MCRoot;

    id: number;

    name: string;

    constructor (mcRoot: MCRoot, id: number, name: string) {
        this.relMC = mcRoot;
        this.id = id;
        this.name = name;

        this.relMC.listStatus.push (this);
        this.relMC.mapIdToStatus.set (this.id, this);
    }

    /**
     * 事件派发 - 初始化
     */
    onInit () {

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
     * 要展示的实例
     */
    onDisplay (): ReactComponentExtendInstance {
        return null;
    }
}

export default MCRootStatus;
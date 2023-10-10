/**
 * 根状态机 - 状态
 */
class MCRootStatus {
    constructor(mcRoot, id, name) {
        this.relMC = mcRoot;
        this.id = id;
        this.name = name;
        this.relMC.listStatus.push(this);
        this.relMC.mapIdToStatus.set(this.id, this);
    }
    /**
     * 事件派发 - 初始化
     */
    onInit() {
    }
    /**
     * 事件派发 - 进入状态
     */
    onEnter() {
    }
    /**
     * 事件派发 - 离开状态
     */
    onExit() {
    }
    /**
     * 要展示的实例
     */
    onDisplay() {
        return null;
    }
}
export default MCRootStatus;

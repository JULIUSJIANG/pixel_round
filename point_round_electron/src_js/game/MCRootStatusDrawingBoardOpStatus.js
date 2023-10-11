/**
 * 根状态机 - 状态 - 画板模式 - 操作状态
 */
class MCRootStatusDrawingBoardOpStatus {
    constructor(relMachine, id, name) {
        this.relMachine = relMachine;
        this.id = id;
        this.name = name;
        this.relMachine.opListStatus.push(this);
        this.relMachine.opMapIdToStatus.set(this.id, this);
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
}
export default MCRootStatusDrawingBoardOpStatus;

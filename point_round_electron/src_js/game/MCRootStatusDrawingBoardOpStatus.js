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
    /**
     * 更新状态
     */
    onUpdate(dataSrc, x, y, w, h) {
    }
    /**
     * 执行状态
     */
    onDo(dataSrc, x, y, w, h) {
    }
}
export default MCRootStatusDrawingBoardOpStatus;
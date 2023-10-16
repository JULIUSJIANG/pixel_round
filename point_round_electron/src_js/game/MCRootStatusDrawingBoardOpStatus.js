/**
 * 根状态机 - 状态 - 画板模式 - 操作状态
 */
class MCRootStatusDrawingBoardOpStatus {
    constructor(relMachine, id, name, code) {
        this.relMachine = relMachine;
        this.id = id;
        this.name = name;
        this.code = code;
        this.relMachine.opListStatus.push(this);
        this.relMachine.opMapIdToStatus.set(this.id, this);
        this.relMachine.opMapCodeToStatus.set(this.code, this);
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
    /**
     * 进行准星提示
     * @param dataSrc
     */
    onFocusDraw(dataSrc) {
    }
}
export default MCRootStatusDrawingBoardOpStatus;

/**
 * 根状态机 - 状态 - 画板模式 - 交互状态
 */
class MCRootStatusDrawingBoardTouchStatus {
    constructor(relMachine) {
        this.relMachine = relMachine;
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
     * 事件派发 - 交互开始
     */
    onStart(dataSrc) {
    }
    /**
     * 事件派发 - 交互中
     */
    onMove(dataSrc) {
    }
    /**
     * 事件派发 - 交互结束
     */
    onEnd(dataSrc) {
    }
    /**
     * 操作更新
     * @param dataSrc
     */
    onOpUpdate(dataSrc) {
    }
    /**
     * 事件派发 - 绘制
     */
    onFocusDraw(dataSrc) {
    }
    /**
     * 事件派发 - 拖拽开始
     */
    onDragStart(dbImg) {
    }
    /**
     * 事件派发 - 拖拽结束
     */
    onDragEnd() {
    }
    /**
     * 事件派发 - 拖拽进入
     */
    onDragEnter(dbImg) {
    }
    /**
     * 事件派发 - 拖拽离开
     */
    onDragLeave() {
    }
}
export default MCRootStatusDrawingBoardTouchStatus;

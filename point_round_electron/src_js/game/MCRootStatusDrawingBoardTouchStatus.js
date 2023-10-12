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
     * @param canvasX
     * @param canvasY
     */
    onStart(canvasX, canvasY) {
    }
    /**
     * 事件派发 - 交互中
     * @param canvasX
     * @param canvasY
     */
    onMove(canvasX, canvasY) {
    }
    /**
     * 事件派发 - 交互结束
     * @param canvasX
     * @param canvasY
     */
    onEnd(canvasX, canvasY) {
    }
    /**
     * 事件派发 - 绘制
     */
    onFocusDraw(jWebgl, color) {
    }
}
export default MCRootStatusDrawingBoardTouchStatus;

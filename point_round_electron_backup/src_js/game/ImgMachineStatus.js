/**
 * 图片存档的状态机 - 状态
 */
class ImgMachineStatus {
    constructor(machine) {
        this.relMachine = machine;
    }
    /**
     * 事件派发 - 状态机被创造
     */
    onCreate() {
    }
    /**
     * 事件派发 - 状态机被销毁
     */
    onDestroy() {
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
     * 事件派发 - 简略图已绘制
     * @param jWebgl
     * @param width
     * @param height
     */
    onCached() {
    }
    /**
     * 收到数据 - 左内边距
     * @param val
     */
    onValPaddingLeft(val) {
    }
    /**
     * 收到数据 - 右内边距
     * @param val
     */
    onValPaddingRight(val) {
    }
    /**
     * 收到数据 - 上内边距
     * @param val
     */
    onValPaddingTop(val) {
    }
    /**
     * 收到数据 - 下内边距
     * @param val
     */
    onValPaddingBottom(val) {
    }
    /**
     * 收到数据 - 颗粒宽度
     * @param val
     */
    onValPixelWidth(val) {
    }
    /**
     * 收到数据 - 颗粒高度
     * @param val
     */
    onValPixelHeight(val) {
    }
    /**
     * 平滑优先的数据变化
     * @param val
     */
    onValColorFirst(colorIdA, colorIdB, val) {
    }
}
export default ImgMachineStatus;

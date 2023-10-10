import ImgMachine from "./ImgMachine.js";

/**
 * 图片存档的状态机 - 状态
 */
class ImgMachineStatus {
    /**
     * 归属的状态机
     */
    relMachine: ImgMachine;

    constructor (machine: ImgMachine) {
        this.relMachine = machine;
    }

    /**
     * 事件派发 - 状态机被创造
     */
    onCreate () {

    }

    /**
     * 事件派发 - 状态机被销毁
     */
    onDestroy () {

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
     * 事件派发 - 简略图已绘制
     * @param jWebgl 
     * @param width 
     * @param height 
     */
    onCached () {

    }

    /**
     * 收到数据 - 左内边距
     * @param val 
     */
    onValPaddingLeft (val: number) {

    }
    /**
     * 收到数据 - 右内边距
     * @param val 
     */
    onValPaddingRight (val: number) {

    }
    /**
     * 收到数据 - 上内边距
     * @param val 
     */
    onValPaddingTop (val: number) {

    }
    /**
     * 收到数据 - 下内边距
     * @param val 
     */
    onValPaddingBottom (val: number) {

    }
    /**
     * 收到数据 - 颗粒宽度
     * @param val 
     */
    onValPixelWidth (val: number) {

    }
    /**
     * 收到数据 - 颗粒高度
     * @param val 
     */
    onValPixelHeight (val: number) {

    }
}

export default ImgMachineStatus;
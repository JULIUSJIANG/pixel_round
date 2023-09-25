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
     * 事件派发 - 尺寸参数发生变化
     */
    onSizeChanged () {

    }
}

export default ImgMachineStatus;
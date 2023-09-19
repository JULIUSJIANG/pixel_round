class ImgMachineStatus {
    constructor(machine) {
        this.relMachine = machine;
    }
    onEnter() {
    }
    onExit() {
    }
    /**
     * 尺寸参数发生变化
     */
    onSizeChanged() {
    }
    /**
     * 事件派发 - 简略图已绘制
     * @param jWebgl
     * @param width
     * @param height
     */
    onPixelDrawed(jWebgl, width, height) {
    }
}
export default ImgMachineStatus;

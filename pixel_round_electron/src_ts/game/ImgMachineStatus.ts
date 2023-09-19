import JWebgl from "../common/JWebgl.js";
import ImgMachine from "./ImgMachine.js";

class ImgMachineStatus {

    relMachine: ImgMachine;

    constructor (machine: ImgMachine) {
        this.relMachine = machine;
    }

    onEnter () {

    }

    onExit () {

    }

    /**
     * 尺寸参数发生变化
     */
    onSizeChanged () {

    }

    /**
     * 事件派发 - 简略图已绘制
     * @param jWebgl 
     * @param width 
     * @param height 
     */
    onPixelDrawed (jWebgl: JWebgl, width: number, height: number) {

    }
}

export default ImgMachineStatus;
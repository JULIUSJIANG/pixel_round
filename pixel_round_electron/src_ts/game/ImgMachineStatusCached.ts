import MgrData from "../mgr/MgrData.js";
import ImgMachineStatus from "./ImgMachineStatus.js";

/**
 * 状态 - 图像信息缓存完毕
 */
class ImgMachineStatusCached extends ImgMachineStatus {

    onEnter (): void {
        this.relMachine.rel.refreshCorner ();
    }

    onSizeChanged (): void {
        this.relMachine.enter (this.relMachine.statusLoaded);
    }

    /**
     * 收到数据 - 左内边距
     * @param val 
     */
    onValPaddingLeft (val: number) {
        this.relMachine.dataInst.paddingLeft = val;
        this.onSizeChanged ();
    }
    /**
     * 收到数据 - 右内边距
     * @param val 
     */
    onValPaddingRight (val: number) {
        this.relMachine.dataInst.paddingRight = val;
        this.onSizeChanged ();
    }
    /**
     * 收到数据 - 上内边距
     * @param val 
     */
    onValPaddingTop (val: number) {
        this.relMachine.dataInst.paddingTop = val;
        this.onSizeChanged ();
    }
    /**
     * 收到数据 - 下内边距
     * @param val 
     */
    onValPaddingBottom (val: number) {
        this.relMachine.dataInst.paddingBottom = val;
        this.onSizeChanged ();
    }
    /**
     * 收到数据 - 颗粒宽度
     * @param val 
     */
    onValPixelWidth (val: number) {
        this.relMachine.dataInst.pixelWidth = val;
        this.onSizeChanged ();
    }
    /**
     * 收到数据 - 颗粒高度
     * @param val 
     */
    onValPixelHeight (val: number) {
        this.relMachine.dataInst.pixelHeight = val;
        this.onSizeChanged ();
    }
    /**
     * 平滑优先的数据变化
     * @param colorIdA 
     * @param colorIdB 
     * @param val 
     */
    onValColorFirst (colorIdA: number, colorIdB: number, val: boolean): void {
        this.relMachine.dataInst.colorTable [colorIdA] [colorIdB] = val;
        this.relMachine.rel.refreshCorner ();
        MgrData.inst.callDataChange ();
    }
}

export default ImgMachineStatusCached;
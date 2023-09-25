import ImgMachineStatus from "./ImgMachineStatus.js";
/**
 * 状态 - 图像信息缓存完毕
 */
class ImgMachineStatusCached extends ImgMachineStatus {
    onSizeChanged() {
        this.relMachine.enter(this.relMachine.statusLoaded);
    }
    /**
     * 收到数据 - 左内边距
     * @param val
     */
    onValPaddingLeft(val) {
        this.relMachine.dataInst.paddingLeft = val;
        this.onSizeChanged();
    }
    /**
     * 收到数据 - 右内边距
     * @param val
     */
    onValPaddingRight(val) {
        this.relMachine.dataInst.paddingRight = val;
        this.onSizeChanged();
    }
    /**
     * 收到数据 - 上内边距
     * @param val
     */
    onValPaddingTop(val) {
        this.relMachine.dataInst.paddingTop = val;
        this.onSizeChanged();
    }
    /**
     * 收到数据 - 下内边距
     * @param val
     */
    onValPaddingBottom(val) {
        this.relMachine.dataInst.paddingBottom = val;
        this.onSizeChanged();
    }
    /**
     * 收到数据 - 颗粒宽度
     * @param val
     */
    onValPixelWidth(val) {
        this.relMachine.dataInst.pixelWidth = val;
        this.onSizeChanged();
    }
    /**
     * 收到数据 - 颗粒高度
     * @param val
     */
    onValPixelHeight(val) {
        this.relMachine.dataInst.pixelHeight = val;
        this.onSizeChanged();
    }
}
export default ImgMachineStatusCached;

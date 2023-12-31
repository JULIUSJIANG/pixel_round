import SmoothMachineStatus from "./SmoothMachineStatus.js";
/**
 * 状态 - 图像信息缓存完毕
 */
class SmoothMachineStatusCached extends SmoothMachineStatus {
    onSizeChanged() {
        this.relMachine.enter(this.relMachine.statusLoaded);
    }
    /**
     * 收到数据 - 左内边距
     * @param val
     */
    onValPaddingLeft(val) {
        this.relMachine.dataInst.expImgData.paddingLeft = val;
        this.onSizeChanged();
    }
    /**
     * 收到数据 - 右内边距
     * @param val
     */
    onValPaddingRight(val) {
        this.relMachine.dataInst.expImgData.paddingRight = val;
        this.onSizeChanged();
    }
    /**
     * 收到数据 - 上内边距
     * @param val
     */
    onValPaddingTop(val) {
        this.relMachine.dataInst.expImgData.paddingTop = val;
        this.onSizeChanged();
    }
    /**
     * 收到数据 - 下内边距
     * @param val
     */
    onValPaddingBottom(val) {
        this.relMachine.dataInst.expImgData.paddingBottom = val;
        this.onSizeChanged();
    }
    /**
     * 收到数据 - 颗粒宽度
     * @param val
     */
    onValPixelWidth(val) {
        this.relMachine.dataInst.expImgData.pixelWidth = val;
        this.onSizeChanged();
    }
    /**
     * 收到数据 - 颗粒高度
     * @param val
     */
    onValPixelHeight(val) {
        this.relMachine.dataInst.expImgData.pixelHeight = val;
        this.onSizeChanged();
    }
}
export default SmoothMachineStatusCached;

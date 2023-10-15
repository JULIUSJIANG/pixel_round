import SmoothMachineStatus from "./SmoothMachineStatus.js";
/**
 * 状态 - 图片加载完毕
 */
class SmoothMachineStatusLoaded extends SmoothMachineStatus {
    onEnter() {
        this.relMachine.rel.argsSmooth.init(this.relMachine.assetsImg.image, 1, 1, this.relMachine.dataInst.expImgData.paddingTop, this.relMachine.dataInst.expImgData.paddingRight, this.relMachine.dataInst.expImgData.paddingBottom, this.relMachine.dataInst.expImgData.paddingLeft, this.relMachine.dataInst.expImgData.pixelWidth, this.relMachine.dataInst.expImgData.pixelHeight);
        this.relMachine.rel.imgWidthShowAll = (this.relMachine.assetsImg.image.width + Math.max(this.relMachine.dataInst.expImgData.paddingLeft, 0) + Math.max(this.relMachine.dataInst.expImgData.paddingRight, 0));
        this.relMachine.rel.imgHeightShowAll = (this.relMachine.assetsImg.image.height + Math.max(this.relMachine.dataInst.expImgData.paddingBottom, 0) + Math.max(this.relMachine.dataInst.expImgData.paddingTop, 0));
    }
    onCached() {
        this.relMachine.enter(this.relMachine.statusCached);
    }
}
export default SmoothMachineStatusLoaded;

import ImgMachineStatus from "./ImgMachineStatus.js";
/**
 * 状态 - 图片加载完毕
 */
class ImgMachineStatusLoaded extends ImgMachineStatus {
    onEnter() {
        this.relMachine.rel.imgWidth = this.relMachine.assetsImg.image.width;
        this.relMachine.rel.imgHeight = this.relMachine.assetsImg.image.height;
        this.relMachine.rel.imgWidthWithPadding = (this.relMachine.rel.imgWidth + this.relMachine.dataInst.paddingLeft + this.relMachine.dataInst.paddingRight);
        this.relMachine.rel.imgHeightWidthPadding = (this.relMachine.rel.imgHeight + this.relMachine.dataInst.paddingBottom + this.relMachine.dataInst.paddingTop);
        this.relMachine.rel.textureWidth = Math.ceil(this.relMachine.rel.imgWidthWithPadding / this.relMachine.dataInst.pixelWidth);
        this.relMachine.rel.textureHeight = Math.ceil(Math.ceil(this.relMachine.rel.imgHeightWidthPadding / this.relMachine.dataInst.pixelHeight));
        this.relMachine.rel.imgWidthShowAll = (this.relMachine.rel.imgWidth + Math.max(this.relMachine.dataInst.paddingLeft, 0) + Math.max(this.relMachine.dataInst.paddingRight, 0));
        this.relMachine.rel.imgHeightShowAll = (this.relMachine.rel.imgHeight + Math.max(this.relMachine.dataInst.paddingBottom, 0) + Math.max(this.relMachine.dataInst.paddingTop, 0));
    }
    onCached() {
        this.relMachine.enter(this.relMachine.statusCached);
    }
}
export default ImgMachineStatusLoaded;

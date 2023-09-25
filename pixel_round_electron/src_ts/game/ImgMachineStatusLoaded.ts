import MgrData from "../mgr/MgrData.js";
import ImgMachineStatus from "./ImgMachineStatus.js";
import TextureGroup from "./TextureGroup.js";

/**
 * 状态 - 图片加载完毕
 */
class ImgMachineStatusLoaded extends ImgMachineStatus {

    onEnter (): void {
        this.relMachine.rel.imgWidth = this.relMachine.assetsImg.image.width;
        this.relMachine.rel.imgHeight = this.relMachine.assetsImg.image.height;
        this.relMachine.rel.imgWidthPadding = (this.relMachine.rel.imgWidth + this.relMachine.dataInst.paddingLeft + this.relMachine.dataInst.paddingRight);
        this.relMachine.rel.imgHeightPadding = (this.relMachine.rel.imgHeight + this.relMachine.dataInst.paddingBottom + this.relMachine.dataInst.paddingTop);
        this.relMachine.rel.imgWidthPaddingScaled = Math.ceil (this.relMachine.rel.imgWidthPadding / this.relMachine.dataInst.pixelWidth);
        this.relMachine.rel.imgHeightPaddingScaled = Math.ceil (Math.ceil (this.relMachine.rel.imgHeightPadding / this.relMachine.dataInst.pixelHeight));
        this.relMachine.rel.imgWidthAll = (this.relMachine.rel.imgWidth + Math.max (this.relMachine.dataInst.paddingLeft, 0) + Math.max (this.relMachine.dataInst.paddingRight, 0));
        this.relMachine.rel.imgHeightAll = (this.relMachine.rel.imgHeight + Math.max (this.relMachine.dataInst.paddingBottom, 0) + Math.max (this.relMachine.dataInst.paddingTop, 0));
    }

    onCached (): void {
        this.relMachine.enter (this.relMachine.statusCached);
    }
}

export default ImgMachineStatusLoaded;
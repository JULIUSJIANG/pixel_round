import DomImageSmoothRS from "../ui/DomImageSmoothRS.js";
import SmoothMachineStatus from "./SmoothMachineStatus.js";

/**
 * 状态 - 图片加载完毕
 */
class SmoothMachineStatusLoaded extends SmoothMachineStatus {

    onEnter (): void {
        this.relMachine.rel.argsSmooth.init (
            DomImageSmoothRS.exp,
            this.relMachine.assetsImg.image,

            1,
            1,

            this.relMachine.dataInst.paddingTop,
            this.relMachine.dataInst.paddingRight,
            this.relMachine.dataInst.paddingBottom,
            this.relMachine.dataInst.paddingLeft,

            this.relMachine.dataInst.pixelWidth,
            this.relMachine.dataInst.pixelHeight,
        );

        this.relMachine.rel.imgWidthShowAll = (this.relMachine.assetsImg.image.width + Math.max (this.relMachine.dataInst.paddingLeft, 0) + Math.max (this.relMachine.dataInst.paddingRight, 0));
        this.relMachine.rel.imgHeightShowAll = (this.relMachine.assetsImg.image.height + Math.max (this.relMachine.dataInst.paddingBottom, 0) + Math.max (this.relMachine.dataInst.paddingTop, 0));
    }

    onCached (): void {
        this.relMachine.enter (this.relMachine.statusCached);
    }
}

export default SmoothMachineStatusLoaded;
import JWebgl from "../common/JWebgl.js";
import JWebglEnum from "../common/JWebglEnum.js";
import objectPool from "../common/ObjectPool.js";
import TextureColor from "./TextureColor.js";
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

    private _analyseListOffset = [-1, 0, 1];

    /**
     * 进行油漆桶解析
     * @param x 油漆桶位置 x
     * @param y 油漆桶位置 y
     * @param colorTarget 油漆桶蔓延的目标颜色
     * @returns 
     */
    paintBucket (x: number, y: number, colorGroup: TextureGroup) {
        // x 越界，忽略
        if (x < 0 || this.relMachine.rel.imgWidthPaddingScaled <= x) {
            return;
        };
        // y 越界，忽略
        if (y < 0 || this.relMachine.rel.imgHeightPaddingScaled <= y) {
            return;
        };
        // 内存索引
        let idx = y * this.relMachine.rel.imgWidthPaddingScaled + x;
        // 已被其他油漆桶蔓延
        if (this.relMachine.rel.listXYToTextureGroup [idx] != null) {
            return;
        };
        // 该位置的颜色不对的话，忽略
        let color = this.relMachine.rel.binXYToColor [y * this.relMachine.rel.imgWidthPaddingScaled + x];
        if (color != colorGroup.colorId) {
            return;
        };
        // 否则进行组标记
        this.relMachine.rel.listXYToTextureGroup [idx] = colorGroup;
        // 尝试对临近的 9 格进行蔓延
        for (let i = 0; i < this._analyseListOffset.length; i++) {
            let analyseListOffsetI = this._analyseListOffset [i];
            for (let j = 0; j < this._analyseListOffset.length; j++) {
                let analyseListOffsetJ = this._analyseListOffset [j];
                this.paintBucket (x + analyseListOffsetI, y + analyseListOffsetJ, colorGroup);
            };
        };
    }
}

export default ImgMachineStatusLoaded;
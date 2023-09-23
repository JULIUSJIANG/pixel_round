import JWebgl from "../common/JWebgl.js";
import JWebglEnum from "../common/JWebglEnum.js";
import objectPool from "../common/ObjectPool.js";
import MgrData from "../mgr/MgrData.js";
import TextureColor from "./TextureColor.js";
import ImgMachineStatus from "./ImgMachineStatus.js";
import TextureGroup from "./TextureGroup.js";
import TexturePixel from "./TexturePixel.js";
import CornerTypeRSBoth from "./CornerTypeRSBoth.js";

class ImgMachineStatusIdle extends ImgMachineStatus {

    /**
     * 用于颜色去重
     */
    private _setColor = new Set <number> ();

    onPixelDrawed (jWebgl: JWebgl, width: number, height: number): void {
        this.relMachine.rel.imgWidth = width;
        this.relMachine.rel.imgHeight = height;

        // 回收颜色对象
        for (let i = 0; i < this.relMachine.rel.listColor.length; i++) {
            let listColorI = this.relMachine.rel.listColor [i];
            objectPool.push (listColorI);
        };
        this.relMachine.rel.listColor.length = 0;

        // 回收分块记录
        for (let i = 0; i < this.relMachine.rel.listTextureGroup.length; i++) {
            let listImgPixelGroupAllI = this.relMachine.rel.listTextureGroup [i];
            objectPool.push (listImgPixelGroupAllI);
        };
        this.relMachine.rel.listTextureGroup.length = 0;

        // 回收像素对象
        for (let i = 0; i < this.relMachine.rel.listXYToTexturePixel.length; i++) {
            let listXYToTexturePixelI = this.relMachine.rel.listXYToTexturePixel [i];
            objectPool.push (listXYToTexturePixelI);
        };
        this.relMachine.rel.listXYToTexturePixel.length = 0;

        this.relMachine.rel.binXYToRgbaSize = this.relMachine.rel.imgWidth * this.relMachine.rel.imgHeight * 4;
        let binRgbaLength = this.relMachine.rel.binXYToRgba.length;
        // 尺寸不够，扩容
        if (binRgbaLength < this.relMachine.rel.binXYToRgbaSize) {
            while (binRgbaLength < this.relMachine.rel.binXYToRgbaSize) {
                binRgbaLength *= 2;
            };
            this.relMachine.rel.binXYToRgba = new Uint8Array (binRgbaLength);
        };
        jWebgl.canvasWebglCtx.readPixels (0, 0, this.relMachine.rel.imgWidth, this.relMachine.rel.imgHeight, JWebglEnum.TexImage2DFormat.RGBA, JWebglEnum.VertexAttriPointerType.UNSIGNED_BYTE, this.relMachine.rel.binXYToRgba);

        this.relMachine.rel.binXYToColorSize = this.relMachine.rel.imgWidth * this.relMachine.rel.imgHeight;
        let binColorLength = this.relMachine.rel.binXYToColor.length;
        // 尺寸不够，扩容
        if (binColorLength < this.relMachine.rel.binXYToColorSize) {
            while (binColorLength < this.relMachine.rel.binXYToColorSize) {
                binColorLength *= 2;
            };
            this.relMachine.rel.binXYToColor = new Uint32Array (binColorLength);
        };

        // 合并颜色值到一个数上面去
        for (let i = 0; i < this.relMachine.rel.binXYToColorSize; i++) {
            this.relMachine.rel.binXYToColor [i] = 0;
            for (let j = 0; j < 4; j++) {
                this.relMachine.rel.binXYToColor [i] <<= 8;
                this.relMachine.rel.binXYToColor [i] += this.relMachine.rel.binXYToRgba [i * 4 + j];
            };
        };

        // 颜色去重，保留下来的颜色都各不一样
        this._setColor.clear ();
        for (let i = 0; i < this.relMachine.rel.binXYToColorSize; i++) {
            let binColorI = this.relMachine.rel.binXYToColor [i];
            this._setColor.add (binColorI);
        };

        // 初始化颜色表对象
        if (!this._setColor.has (0)) {
            this._setColor.add (0);
        };
        this._setColor.forEach ((color) => {
            let colorBackup = color;
            let colorA = color % 256;
            color >>= 8;
            let colorB = color % 256;
            color >>= 8;
            let colorG = color % 256;
            color >>= 8;
            let colorR = color % 256;
            color >>= 8;

            let colorInst = objectPool.pop (TextureColor.poolType);
            colorInst.init (colorBackup, 0, colorR / 255, colorG / 255, colorB / 255, colorA / 255);
            this.relMachine.rel.listColor.push (colorInst);
        });

        // 更新序号
        this.relMachine.rel.listColor.sort ((a, b) => {
            return a.id - b.id;
        });
        for (let i = 0; i < this.relMachine.rel.listColor.length; i++) {
            let listColorI = this.relMachine.rel.listColor [i];
            listColorI.idx = i;
        };

        // 更新索引
        this.relMachine.rel.mapIdToColor.clear ();
        for (let i = 0; i < this.relMachine.rel.listColor.length; i++) {
            let listColorI = this.relMachine.rel.listColor [i];
            this.relMachine.rel.mapIdToColor.set (listColorI.id, listColorI);
        };

        // 更新分块
        this.relMachine.rel.listXYToTextureGroup.length = this.relMachine.rel.binXYToColorSize;
        this.relMachine.rel.listXYToTextureGroup.fill (null);
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                // 索引
                let idx = y * width + x;
                // 当前组
                let currentGroup = this.relMachine.rel.listXYToTextureGroup [idx];
                // 已有当前组，忽略
                if (currentGroup != null) {
                    continue;
                };
                // 为该块创建颜色组，并且开始蔓延
                let color = this.relMachine.rel.binXYToColor [idx];
                currentGroup = TextureGroup.create (color);
                this.relMachine.rel.listTextureGroup.push (currentGroup);
                this.paintBucket (x, y, currentGroup);
            };
        };

        // 分块数据的缓存
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                // 索引
                let idx = y * width + x;
                // 当前组
                let currentGroup = this.relMachine.rel.listXYToTextureGroup [idx];
                currentGroup.addPos (x, y);
            };
        };
        for (let i = 0; i < this.relMachine.rel.listTextureGroup.length; i++) {
            let listImgPixelGroupAllI = this.relMachine.rel.listTextureGroup [i];
            listImgPixelGroupAllI.cache ();
        };
        this.relMachine.rel.listTextureGroup.sort ((a, b) => {
            return a.areaVolume - b.areaVolume;
        });
        this.relMachine.rel.listTextureGroupNotEmpty.length = 0;
        for (let i = 0; i < this.relMachine.rel.listTextureGroup.length; i++) {
            let listImgPixelGroupAllI = this.relMachine.rel.listTextureGroup [i];
            if (listImgPixelGroupAllI.colorObj.data255 [3] == 0) {
                continue;
            };
            this.relMachine.rel.listTextureGroupNotEmpty.push (listImgPixelGroupAllI);
        };

        // 填充像素记录
        this.relMachine.rel.listXYToTexturePixel.length = this.relMachine.rel.binXYToColorSize;
        this.relMachine.rel.listXYToTexturePixel.fill (null);
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                // 索引
                let idx = y * width + x;
                // 像素记录
                let texturePixel = TexturePixel.create (this.relMachine.rel, x, y);
                this.relMachine.rel.listXYToTexturePixel [idx] = texturePixel;
            };
        };
        // 确定各个角的平滑类型
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                // 索引
                let idx = y * width + x;
                let texturePixel = this.relMachine.rel.listXYToTexturePixel [idx];
                texturePixel.cornerLT.rsBoth = this.relMachine.rel.getCornerType (x, y, - 0.5,   0.5);
                texturePixel.cornerRT.rsBoth = this.relMachine.rel.getCornerType (x, y,   0.5,   0.5);
                texturePixel.cornerRB.rsBoth = this.relMachine.rel.getCornerType (x, y,   0.5, - 0.5);
                texturePixel.cornerLB.rsBoth = this.relMachine.rel.getCornerType (x, y, - 0.5, - 0.5);
            };
        };

        this.relMachine.enter (this.relMachine.statusInited);
        MgrData.inst.callDataChange ();
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
        if (x < 0 || this.relMachine.rel.imgWidth <= x) {
            return;
        };
        // y 越界，忽略
        if (y < 0 || this.relMachine.rel.imgHeight <= y) {
            return;
        };
        // 内存索引
        let idx = y * this.relMachine.rel.imgWidth + x;
        // 已被其他油漆桶蔓延
        if (this.relMachine.rel.listXYToTextureGroup [idx] != null) {
            return;
        };
        // 该位置的颜色不对的话，忽略
        let color = this.relMachine.rel.binXYToColor [y * this.relMachine.rel.imgWidth + x];
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

export default ImgMachineStatusIdle;
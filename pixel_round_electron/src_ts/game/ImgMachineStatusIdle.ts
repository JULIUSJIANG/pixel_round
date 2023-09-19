import JWebgl from "../common/JWebgl.js";
import JWebglEnum from "../common/JWebglEnum.js";
import objectPool from "../common/ObjectPool.js";
import MgrData from "../mgr/MgrData.js";
import DetailMachineStatusPreviewColor from "./DetailMachineStatusPreviewColor.js";
import ImgMachineStatus from "./ImgMachineStatus.js";
import ImgPixelGroup from "./ImgPixelGroup.js";

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
        for (let i = 0; i < this.relMachine.rel.listImgPixelGroupAll.length; i++) {
            let listImgPixelGroupAllI = this.relMachine.rel.listImgPixelGroupAll [i];
            objectPool.push (listImgPixelGroupAllI);
        };
        this.relMachine.rel.listImgPixelGroupAll.length = 0;

        this.relMachine.rel.binRgbaSize = this.relMachine.rel.imgWidth * this.relMachine.rel.imgHeight * 4;
        let binRgbaLength = this.relMachine.rel.binRgba.length;
        // 尺寸不够，扩容
        if (binRgbaLength < this.relMachine.rel.binRgbaSize) {
            while (binRgbaLength < this.relMachine.rel.binRgbaSize) {
                binRgbaLength *= 2;
            };
            this.relMachine.rel.binRgba = new Uint8Array (binRgbaLength);
        };
        jWebgl.canvasWebglCtx.readPixels (0, 0, this.relMachine.rel.imgWidth, this.relMachine.rel.imgHeight, JWebglEnum.TexImage2DFormat.RGBA, JWebglEnum.VertexAttriPointerType.UNSIGNED_BYTE, this.relMachine.rel.binRgba);

        this.relMachine.rel.binColorSize = this.relMachine.rel.imgWidth * this.relMachine.rel.imgHeight;
        let binColorLength = this.relMachine.rel.binColor.length;
        // 尺寸不够，扩容
        if (binColorLength < this.relMachine.rel.binColorSize) {
            while (binColorLength < this.relMachine.rel.binColorSize) {
                binColorLength *= 2;
            };
            this.relMachine.rel.binColor = new Uint32Array (binColorLength);
        };

        // 合并颜色值到一个数上面去
        for (let i = 0; i < this.relMachine.rel.binColorSize; i++) {
            this.relMachine.rel.binColor [i] = 0;
            for (let j = 0; j < 4; j++) {
                this.relMachine.rel.binColor [i] <<= 8;
                this.relMachine.rel.binColor [i] += this.relMachine.rel.binRgba [i * 4 + j];
            };
        };

        // 颜色去重，保留下来的颜色都各不一样
        this._setColor.clear ();
        for (let i = 0; i < this.relMachine.rel.binColorSize; i++) {
            let binColorI = this.relMachine.rel.binColor [i];
            this._setColor.add (binColorI);
        };

        // 初始化颜色表对象
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

            let colorInst = objectPool.pop (DetailMachineStatusPreviewColor.poolType);
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
        this.relMachine.rel.listImgPixelGroup.length = this.relMachine.rel.binColorSize;
        this.relMachine.rel.listImgPixelGroup.fill (null);
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                // 索引
                let idx = y * width + x;
                // 当前组
                let currentGroup = this.relMachine.rel.listImgPixelGroup [idx];
                // 已有当前组，忽略
                if (currentGroup != null) {
                    continue;
                };
                // 为该块创建颜色组，并且开始蔓延
                let color = this.relMachine.rel.binColor [idx];
                currentGroup = ImgPixelGroup.create (color);
                this.relMachine.rel.listImgPixelGroupAll.push (currentGroup);
                this.paintBucket (x, y, currentGroup);
            };
        };
        console.log (`颜色分块数量 [${this.relMachine.rel.listImgPixelGroupAll.length}]`);

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
    paintBucket (x: number, y: number, colorGroup: ImgPixelGroup) {
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
        if (this.relMachine.rel.listImgPixelGroup [idx] != null) {
            return;
        };
        // 该位置的颜色不对的话，忽略
        let color = this.relMachine.rel.binColor [y * this.relMachine.rel.imgWidth + x];
        if (color != colorGroup.color) {
            return;
        };
        // 否则进行组标记
        this.relMachine.rel.listImgPixelGroup [idx] = colorGroup;
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
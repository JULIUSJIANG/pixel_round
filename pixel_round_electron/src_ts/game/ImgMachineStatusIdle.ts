import JWebgl from "../common/JWebgl.js";
import JWebglEnum from "../common/JWebglEnum.js";
import objectPool from "../common/ObjectPool.js";
import MgrData from "../mgr/MgrData.js";
import DetailMachineStatusPreviewColor from "./DetailMachineStatusPreviewColor.js";
import ImgMachineStatus from "./ImgMachineStatus.js";

class ImgMachineStatusIdle extends ImgMachineStatus {

    /**
     * 用于颜色去重
     */
    private _setColor = new Set <number> ();

    onPixelDrawed (jWebgl: JWebgl, width: number, height: number): void {
        this.relMachine.rel.imgWidth = width;
        this.relMachine.rel.imgHeight = height;

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

        // 回收颜色对象
        for (let i = 0; i < this.relMachine.rel.listColor.length; i++) {
            let listColorI = this.relMachine.rel.listColor [i];
            objectPool.push (listColorI);
        };
        this.relMachine.rel.listColor.length = 0;

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

        this.relMachine.enter (this.relMachine.statusInited);
        MgrData.inst.callDataChange ();
    }
}

export default ImgMachineStatusIdle;
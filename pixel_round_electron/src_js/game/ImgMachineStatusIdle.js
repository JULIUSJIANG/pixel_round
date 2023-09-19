import JWebglEnum from "../common/JWebglEnum.js";
import objectPool from "../common/ObjectPool.js";
import MgrData from "../mgr/MgrData.js";
import DetailMachineStatusPreviewColor from "./DetailMachineStatusPreviewColor.js";
import ImgMachineStatus from "./ImgMachineStatus.js";
class ImgMachineStatusIdle extends ImgMachineStatus {
    constructor() {
        super(...arguments);
        /**
         * 用于颜色去重
         */
        this._setColor = new Set();
    }
    onPixelDrawed(jWebgl, width, height) {
        console.log(`刷新缓存`);
        this.relMachine.imgWidth = width;
        this.relMachine.imgHeight = height;
        this.relMachine.binRgbaSize = this.relMachine.imgWidth * this.relMachine.imgHeight * 4;
        let binRgbaLength = this.relMachine.binRgba.length;
        // 尺寸不够，扩容
        if (binRgbaLength < this.relMachine.binRgbaSize) {
            while (binRgbaLength < this.relMachine.binRgbaSize) {
                binRgbaLength *= 2;
            }
            ;
            this.relMachine.binRgba = new Uint8Array(binRgbaLength);
        }
        ;
        jWebgl.canvasWebglCtx.readPixels(0, 0, this.relMachine.imgWidth, this.relMachine.imgHeight, JWebglEnum.TexImage2DFormat.RGBA, JWebglEnum.VertexAttriPointerType.UNSIGNED_BYTE, this.relMachine.binRgba);
        this.relMachine.binColorSize = this.relMachine.imgWidth * this.relMachine.imgHeight;
        let binColorLength = this.relMachine.binColor.length;
        // 尺寸不够，扩容
        if (binColorLength < this.relMachine.binColorSize) {
            while (binColorLength < this.relMachine.binColorSize) {
                binColorLength *= 2;
            }
            ;
            this.relMachine.binColor = new Uint32Array(binColorLength);
        }
        ;
        // 合并颜色值到一个数上面去
        for (let i = 0; i < this.relMachine.binColorSize; i++) {
            this.relMachine.binColor[i] = 0;
            for (let j = 0; j < 4; j++) {
                this.relMachine.binColor[i] << 8;
                this.relMachine.binColor[i] += this.relMachine.binColor[i * 4 + j];
            }
            ;
        }
        ;
        // 颜色去重，保留下来的颜色都各不一样
        this._setColor.clear();
        for (let i = 0; i < this.relMachine.binColorSize; i++) {
            let binColorI = this.relMachine.binColor[i];
            this._setColor.add(binColorI);
        }
        ;
        // 回收颜色对象
        for (let i = 0; i < this.relMachine.listColor.length; i++) {
            let listColorI = this.relMachine.listColor[i];
            objectPool.push(listColorI);
        }
        ;
        this.relMachine.listColor.length = 0;
        // 初始化颜色表对象
        this._setColor.forEach((color) => {
            let colorBackup = color;
            let colorA = color % 256;
            color >> 8;
            let colorB = color % 256;
            color >> 8;
            let colorG = color % 256;
            color >> 8;
            let colorR = color % 256;
            color >> 8;
            let colorInst = objectPool.pop(DetailMachineStatusPreviewColor.poolType);
            colorInst.init(colorBackup, 0, colorR / 255, colorG / 255, colorB / 255, colorA / 255);
            this.relMachine.listColor.push(colorInst);
        });
        // 更新序号
        this.relMachine.listColor.sort((a, b) => {
            return a.id - b.id;
        });
        for (let i = 0; i < this.relMachine.listColor.length; i++) {
            let listColorI = this.relMachine.listColor[i];
            listColorI.idx = i;
        }
        ;
        // 更新索引
        this.relMachine.mapIdToColor.clear();
        for (let i = 0; i < this.relMachine.listColor.length; i++) {
            let listColorI = this.relMachine.listColor[i];
            this.relMachine.mapIdToColor.set(listColorI.id, listColorI);
        }
        ;
        this.relMachine.enter(this.relMachine.statusInited);
        MgrData.inst.callDataChange();
    }
}
export default ImgMachineStatusIdle;

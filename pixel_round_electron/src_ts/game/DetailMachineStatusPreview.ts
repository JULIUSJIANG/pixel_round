import JWebglColor from "../common/JWebglColor.js";
import objectPool from "../common/ObjectPool.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import DomRightPreview from "../ui/DomRightPreview.js";
import DetailMachineStatus from "./DetailMachineStatus.js";
import DetailMachineStatusPreviewColor from "./DetailMachineStatusPreviewColor.js";

export default class DetailMachineStatusPreview extends DetailMachineStatus {

    onExit (): void {
        this.clearCache ();
    }

    onCreate (): void {
        this.relMachine.enter (this.relMachine.statusCreate);
    }

    onImg (id: number): void {
        MgrData.inst.set (MgrDataItem.CURRENT_IMG, id);
        this.clearCache ();
    }

    onRender(): ReactComponentExtendInstance {
        return ReactComponentExtend.instantiateComponent (DomRightPreview, null);
    }

    pixelWidth: number = 1;
    pixelHeight: number = 1;
    pixelBin = new Uint32Array (1);

    onPixels (width: number, height: number, dataColor: Uint32Array) {
        this.pixelWidth = width;
        this.pixelHeight = height;
        if (this.pixelBin.length < dataColor.length) {
            let size = this.pixelBin.length;
            while (size < dataColor.length) {
                size *= 2;
            };
            this.pixelBin = new Uint32Array (size);
        };
        let count = this.pixelWidth * this.pixelHeight;
        for (let i = 0; i < count; i++) {
            this.pixelBin [i] = dataColor [i];
        };
    }

    colorTableCurrent = new Array <number> ();
    colorTableTemp = new Array <number> ();

    listColor = new Array <DetailMachineStatusPreviewColor> ();
    mapNumToColor = new Map <number, DetailMachineStatusPreviewColor> ();

    onColorTable (colorSet: Set <number>) {
        this.colorTableTemp.length = 0;
        colorSet.forEach ((val) => {
            this.colorTableTemp.push (val);
        });
        this.colorTableTemp.sort ((a, b) => {
            return a - b;
        });
        if (this.checkEqual ()) {
            return;
        };
        this.colorTableCurrent.length = 0;
        this.colorTableCurrent.push (...this.colorTableTemp);

        // 正式更新颜色表
        for (let i = 0; i < this.listColor.length; i++) {
            let listColorI = this.listColor [i];
            objectPool.push (listColorI);
        };
        this.listColor.length = 0;

        // 初始化颜色表对象
        for (let i = 0; i < this.colorTableCurrent.length; i++) {
            let colorTableCurrentI = this.colorTableCurrent [i];
            let a = colorTableCurrentI % 256;
            colorTableCurrentI = colorTableCurrentI >> 8;
            let b = colorTableCurrentI % 256;
            colorTableCurrentI = colorTableCurrentI >> 8;
            let g = colorTableCurrentI % 256;
            colorTableCurrentI = colorTableCurrentI >> 8;
            let r = colorTableCurrentI % 256;

            let colorInst = objectPool.pop (DetailMachineStatusPreviewColor.poolType);
            colorInst.init (this.colorTableCurrent [i], i, r / 255, g / 255, b / 255, a / 255);
            this.listColor.push (colorInst);
        };

        // 记录下 id 到实例的索引
        this.mapNumToColor.clear ();
        for (let i = 0; i < this.listColor.length; i++) {
            let listColorI = this.listColor [i];
            this.mapNumToColor.set (listColorI.id, listColorI);
        };

        MgrData.inst.callDataChange ();
    }

    checkEqual () {
        // 长度不一致，肯定不一样
        if (this.colorTableCurrent.length != this.colorTableTemp.length) {
            return false;
        };
        // 其中某个不一样
        let count = this.colorTableCurrent.length;
        for (let i = 0; i < count; i++) {
            if (this.colorTableCurrent [i] != this.colorTableTemp [i]) {
                return false;
            };
        };
        return true;
    }

    clearCache () {
        this.colorTableCurrent.length = 0;
    }
}
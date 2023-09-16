import JWebglColor from "../common/JWebglColor.js";
import objectPool from "../common/ObjectPool.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import DomRightPreview from "../ui/DomRightPreview.js";
import DetailMachineStatus from "./DetailMachineStatus.js";

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

    colorTableCurrent = new Array <number> ();
    colorTableTemp = new Array <number> ();

    listColor = new Array <JWebglColor> ();

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

        for (let i = 0; i < this.colorTableCurrent.length; i++) {
            let colorTableCurrentI = this.colorTableCurrent [i];
            let a = colorTableCurrentI % 256;
            colorTableCurrentI = colorTableCurrentI >> 8;
            let b = colorTableCurrentI % 256;
            colorTableCurrentI = colorTableCurrentI >> 8;
            let g = colorTableCurrentI % 256;
            colorTableCurrentI = colorTableCurrentI >> 8;
            let r = colorTableCurrentI % 256;

            let colorInst = objectPool.pop (JWebglColor.poolType);
            colorInst.init (r / 255, g / 255, b / 255, a / 255);
            this.listColor.push (colorInst);
        };
        MgrData.inst.callDataChange ();
        console.log (`this.colorTableCurrent.length[${this.colorTableCurrent.length}]`, this.colorTableCurrent, this.listColor);
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
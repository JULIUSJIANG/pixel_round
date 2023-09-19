import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import DomRightPreview from "../ui/DomRightPreview.js";
import DetailMachineStatus from "./DetailMachineStatus.js";
import ImgMachine from "./ImgMachine.js";
export default class DetailMachineStatusPreview extends DetailMachineStatus {
    constructor() {
        super(...arguments);
        /**
         * 图片宽
         */
        this.imgWidth = 1;
        /**
         * 图片高
         */
        this.imgHeight = 1;
        /**
         * 每四个数字代表一个颜色
         */
        this.binRgba = new Uint8Array(1);
        this.binRgbaSize = 4;
        /**
         * 每个数字代表一个颜色
         */
        this.binColor = new Uint32Array(1);
        this.binColorSize = 1;
        /**
         * 所有颜色
         */
        this.listColor = new Array();
        /**
         * 标识到具体颜色的映射
         */
        this.mapIdToColor = new Map();
    }
    onEnter() {
        this.onImg(MgrData.inst.get(MgrDataItem.CURRENT_IMG));
    }
    onCreate() {
        this.relMachine.enter(this.relMachine.statusCreate);
    }
    onImg(id) {
        MgrData.inst.set(MgrDataItem.CURRENT_IMG, id);
        let rec = this.imgMachine;
        this.imgMachine = new ImgMachine(this, id);
        if (rec) {
            rec.onDestroy();
        }
        ;
        this.imgMachine.onCreate();
    }
    onRender() {
        return ReactComponentExtend.instantiateComponent(DomRightPreview, null);
    }
}

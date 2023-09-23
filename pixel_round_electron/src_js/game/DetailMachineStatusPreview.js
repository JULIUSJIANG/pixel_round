import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import DomRightPreview from "../ui/DomRightPreview.js";
import DetailMachineStatus from "./DetailMachineStatus.js";
import ImgMachine from "./ImgMachine.js";
import CornerMachine from "./CornerMachine.js";
export default class DetailMachineStatusPreview extends DetailMachineStatus {
    constructor(machine, id) {
        super(machine, id);
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
        this.binXYToRgba = new Uint8Array(1);
        this.binXYToRgbaSize = 4;
        /**
         * 每个数字代表一个颜色
         */
        this.binXYToColor = new Uint32Array(1);
        this.binXYToColorSize = 1;
        /**
         * 所有颜色
         */
        this.listColor = new Array();
        /**
         * 标识到具体颜色的映射
         */
        this.mapIdToColor = new Map();
        /**
         * 存储分块信息的集合，与位置相关
         */
        this.listXYToTextureGroup = new Array();
        /**
         * 仅关注类型
         */
        this.listTextureGroup = new Array();
        /**
         * 仅关注类型 - 不为空
         */
        this.listTextureGroupNotEmpty = new Array();
        /**
         * 所有像素的记录
         */
        this.listXYToTexturePixel = new Array();
        this._cornerMachine = new CornerMachine(this);
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
    /**
     * 获取角的裁切类型
     * @param posCurrentX
     * @param posCurrentY
     */
    getCornerType(posCurrentX, posCurrentY, vecForwardX, vecForwardY) {
        let vecRightX = vecForwardX;
        let vecRightY = -vecForwardY;
        let rsSideLeft = this._cornerMachine.getCornerType(posCurrentX, posCurrentY, vecForwardX, vecForwardY, vecRightX, vecRightY);
        let rsSideRight = this._cornerMachine.getCornerType(posCurrentX, posCurrentY, vecForwardX, vecForwardY, -vecRightX, -vecRightY);
        return rsSideLeft.onRight(rsSideRight);
    }
}

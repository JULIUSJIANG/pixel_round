import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import DomExperimentRightPreview from "../ui/DomExperimentRightPreview.js";
import MCRootStatusExperimentDetailStatus from "./MCRootStatusExperimentDetailStatus.js";
import SmoothMachine from "./SmoothMachine.js";
import objectPool from "../common/ObjectPool.js";
import DomImageSmooth from "../ui/DomImageSmooth.js";
import IndexGlobal from "../IndexGlobal.js";
export default class MCRootStatusExperimentDetailStatusSmooth extends MCRootStatusExperimentDetailStatus {
    constructor(machine, id) {
        super(machine, id);
        /**
         * 每四个数字代表一个颜色
         */
        this.binXYToRgbaUint = new Uint8Array(1);
        this.binXYToRgbaUintSize = 4;
        /**
         * 每个数字代表一个颜色
         */
        this.binXYToColorUint = new Uint32Array(1);
        this.binXYToColorUintSize = 1;
        /**
         * 所有颜色
         */
        this.listColor = new Array();
        /**
         * 标识到具体颜色的映射
         */
        this.mapIdToColor = new Map();
        this.argsSmooth = objectPool.pop(DomImageSmooth.Args.poolType);
    }
    onEnter() {
        this.onImg(MgrData.inst.get(MgrDataItem.EXP_CURRENT_IMG));
    }
    onCreate() {
        this.relMachine.detailEnter(this.relMachine.detailStatusCreate);
    }
    onImg(id) {
        MgrData.inst.set(MgrDataItem.EXP_CURRENT_IMG, id);
        let rec = this.imgMachine;
        this.imgMachine = new SmoothMachine(this, id);
        if (rec) {
            rec.onDestroy();
        }
        ;
        this.imgMachine.onCreate();
        let expImg = IndexGlobal.inst.expMapIdToImg.get(id);
        expImg.uint8CurrStatus.onSelected();
    }
    onRender() {
        return ReactComponentExtend.instantiateComponent(DomExperimentRightPreview, null);
    }
}

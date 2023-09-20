import CreateMachine from "./game/CreateMachine.js";
import DetailMachine from "./game/DetailMachine.js";
import MgrData from "./mgr/MgrData.js";
import MgrDataItem from "./mgr/MgrDataItem.js";
import DomRightStepRS from "./ui/DomRightStepRS.js";
class IndexGlobal {
    init() {
        this.detailMachine = new DetailMachine(this);
        this.detailMachine.enter(this.detailMachine.mapIdToStatus.get(MgrData.inst.get(MgrDataItem.DETAIL_MACHINE_STATUS)));
        this.createMachine = new CreateMachine(this);
        this.stepRSCurrent = DomRightStepRS.step4Merge;
    }
    onStep(stepRS) {
        if (this.stepRSCurrent == stepRS) {
            return;
        }
        ;
        this.stepRSCurrent = stepRS;
        MgrData.inst.callDataChange();
    }
}
(function (IndexGlobal) {
    IndexGlobal.inst = new IndexGlobal();
    /**
     * 缩略图边长
     */
    IndexGlobal.IMG_MINI_SIZE = 100;
    /**
     * 缩略图列数
     */
    IndexGlobal.IMG_LIST_COLUMN_COUNT = 1;
    /**
     * 纹素尺寸到屏幕尺寸的转换
     */
    IndexGlobal.PIXEL_TEX_TO_SCREEN = 16;
    /**
     * 高清值，每个屏幕像素对应多少个渲染缓冲区像素
     */
    IndexGlobal.ANTINA = 2;
})(IndexGlobal || (IndexGlobal = {}));
export default IndexGlobal;

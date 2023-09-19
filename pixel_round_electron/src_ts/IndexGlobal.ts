import CreateMachine from "./game/CreateMachine.js";
import DetailMachine from "./game/DetailMachine.js";
import MgrData from "./mgr/MgrData.js";
import MgrDataItem from "./mgr/MgrDataItem.js";

class IndexGlobal {

    detailMachine: DetailMachine;

    createMachine: CreateMachine;

    init () {
        this.detailMachine = new DetailMachine (this);
        this.detailMachine.enter (this.detailMachine.mapIdToStatus.get (MgrData.inst.get (MgrDataItem.DETAIL_MACHINE_STATUS)));
        this.createMachine = new CreateMachine (this);
    }
}

namespace IndexGlobal {

    export const inst = new IndexGlobal ();

    /**
     * 缩略图边长
     */
    export const IMG_MINI_SIZE = 100;

    /**
     * 缩略图列数
     */
    export const IMG_LIST_COLUMN_COUNT = 1;

    /**
     * 纹素尺寸到屏幕尺寸的转换
     */
    export const PIXEL_TEX_TO_SCREEN = 16;

    /**
     * 高清值，每个屏幕像素对应多少个渲染缓冲区像素
     */
    export const ANTINA = 2;
}

export default IndexGlobal;
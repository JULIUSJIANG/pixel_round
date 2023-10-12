import MCRootStatusExperimentStatusCreate from "./game/MCRootStatusExperimentStatusCreate.js";
import MCRoot from "./game/MCRoot.js";
import MgrData from "./mgr/MgrData.js";
import MgrDataItem from "./mgr/MgrDataItem.js";
import MgrSdk from "./mgr/MgrSdk.js";
import DBImg from "./game/DBImg.js";

class IndexGlobal {
    /**
     * 根状态机
     */
    mcRoot: MCRoot;

    /**
     * 初始化
     */
    init () {
        // 勾选了默认打开调试工具
        if (MgrData.inst.get (MgrDataItem.AUTO_DEBUG_TOOLS)) {
            MgrSdk.inst.core.openDebugTools ();
        };

        // 缓存图片数据
        let listImg = MgrData.inst.get (MgrDataItem.DB_LIST_IMG_DATA);
        for (let i = 0; i < listImg.length; i++) {
            let listImgI = listImg [i];
            this.dbAddCache (listImgI);
        };

        this.mcRoot = new MCRoot (this);
        this.mcRoot.onInit ();
    }

    /**
     * 绘板数据的集合
     */
    dbListImg = new Array <DBImg> ();
    /**
     * 标识到绘板数据的映射
     */
    dbMapIdToImg = new Map <number, DBImg> ();

    /**
     * 添加缓存
     * @param imgData 
     */
    dbAddCache (imgData: MgrDataItem.DBImgData) {
        let dbImg = new DBImg (imgData);
        this.dbListImg.push (dbImg);
        this.dbMapIdToImg.set (dbImg.dbImgData.id, dbImg);
    }

    /**
     * 删除某索引的记录
     * @param idx 
     */
    dbDelete (idx: number) {
        let rec = this.dbListImg [idx];
        this.dbMapIdToImg.delete (rec.dbImgData.id);
        this.dbListImg.splice (idx, 1);
        MgrData.inst.get (MgrDataItem.DB_LIST_IMG_DATA).splice (idx, 1);
    }

    /**
     * 创建画板
     * @param width 
     * @param height 
     */
    dbCreate (width: number, height: number) {
        let id = MgrData.inst.get (MgrDataItem.SEED);
        id++;
        MgrData.inst.set (MgrDataItem.SEED, id);
        let imgData: MgrDataItem.DBImgData = {
            id: id,
            dataOrigin: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC`,
            width: width,
            height: height
        };
        MgrData.inst.get (MgrDataItem.DB_LIST_IMG_DATA).push (imgData);
        this.dbAddCache (imgData);
        return id;
    }
}

namespace IndexGlobal {

    export const inst = new IndexGlobal ();

    /**
     * 绘画状态机
     * @returns 
     */
    export function mcDB () {
        return inst.mcRoot.statusDrawingBoard;
    }

    /**
     * 实验状态机
     * @returns 
     */
    export function mcExp () {
        return inst.mcRoot.statusExperiment;
    }

    /**
     * 实验状态机 - 创建
     */
    export function mcExpCreate () {
        return inst.mcRoot.statusExperiment.statusCreate;
    }

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
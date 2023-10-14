import MCRoot from "./game/MCRoot.js";
import MgrData from "./mgr/MgrData.js";
import MgrDataItem from "./mgr/MgrDataItem.js";
import MgrSdk from "./mgr/MgrSdk.js";
import DBImg from "./game/DBImg.js";
class IndexGlobal {
    constructor() {
        /**
         * 绘板数据的集合
         */
        this.dbListImg = new Array();
        /**
         * 标识到绘板数据的映射
         */
        this.dbMapIdToImg = new Map();
    }
    /**
     * 初始化
     */
    init() {
        // 勾选了默认打开调试工具
        if (MgrData.inst.get(MgrDataItem.AUTO_DEBUG_TOOLS)) {
            MgrSdk.inst.core.openDebugTools();
        }
        ;
        // 缓存图片数据
        let listImg = MgrData.inst.get(MgrDataItem.DB_LIST_IMG_DATA);
        for (let i = 0; i < listImg.length; i++) {
            let listImgI = listImg[i];
            this.dbAddCache(listImgI);
        }
        ;
        this.mcRoot = new MCRoot(this);
        this.mcRoot.onInit();
    }
    /**
     * 添加缓存
     * @param imgData
     */
    dbAddCache(imgData) {
        let dbImg = new DBImg(imgData);
        this.dbListImg.push(dbImg);
        this.dbMapIdToImg.set(dbImg.dbImgData.id, dbImg);
    }
    /**
     * 删除某索引的记录
     * @param idx
     */
    dbDelete(idx) {
        let rec = this.dbListImg[idx];
        this.dbMapIdToImg.delete(rec.dbImgData.id);
        this.dbListImg.splice(idx, 1);
        MgrData.inst.get(MgrDataItem.DB_LIST_IMG_DATA).splice(idx, 1);
    }
    /**
     * 创建画板
     * @param width
     * @param height
     */
    dbCreate(width, height) {
        let id = MgrData.inst.get(MgrDataItem.SEED);
        id++;
        MgrData.inst.set(MgrDataItem.SEED, id);
        let imgData = {
            id: id,
            dataOrigin: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC`,
            width: width,
            height: height
        };
        MgrData.inst.get(MgrDataItem.DB_LIST_IMG_DATA).push(imgData);
        this.dbAddCache(imgData);
        return id;
    }
}
(function (IndexGlobal) {
    IndexGlobal.inst = new IndexGlobal();
    /**
     * 绘画状态机
     * @returns
     */
    function mcDB() {
        return IndexGlobal.inst.mcRoot.statusDrawingBoard;
    }
    IndexGlobal.mcDB = mcDB;
    /**
     * 实验状态机
     * @returns
     */
    function mcExp() {
        return IndexGlobal.inst.mcRoot.statusExperiment;
    }
    IndexGlobal.mcExp = mcExp;
    /**
     * 实验状态机 - 创建
     */
    function mcExpCreate() {
        return IndexGlobal.inst.mcRoot.statusExperiment.statusCreate;
    }
    IndexGlobal.mcExpCreate = mcExpCreate;
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
    /**
     * 新建的画板宽度
     */
    IndexGlobal.DB_SIZE_NEW = 64;
    /**
     * 最大的画板尺寸
     */
    IndexGlobal.DB_SIZE_MAX = 256;
    /**
     * 像素尺寸到屏幕尺寸的转换 - 最小值
     */
    IndexGlobal.DB_PIXEL_TO_SCREEN_MIN = 2;
    /**
     * 像素尺寸到屏幕尺寸的转换 - 最大值
     */
    IndexGlobal.DB_PIXEL_TO_SCREEN_MAX = 64;
})(IndexGlobal || (IndexGlobal = {}));
export default IndexGlobal;

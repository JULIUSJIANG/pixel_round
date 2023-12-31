import MCRoot from "./game/MCRoot.js";
import MgrData from "./mgr/MgrData.js";
import MgrDataItem from "./mgr/MgrDataItem.js";
import MgrSdk from "./mgr/MgrSdk.js";
import DBImg from "./game/DBImg.js";
import DomImageSmoothRS from "./ui/DomImageSmoothRS.js";
import ExpImg from "./game/ExpImg.js";
import FileColumnRS from "./ui/FileColumnRS.js";
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
        /**
         * 实验数据的集合
         */
        this.expListImg = new Array();
        /**
         * 标识到实验数据的映射
         */
        this.expMapIdToImg = new Map();
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
        let dbListImg = MgrData.inst.get(MgrDataItem.DB_LIST_IMG_DATA);
        for (let i = 0; i < dbListImg.length; i++) {
            let dbListImgI = dbListImg[i];
            this.dbAddCache(dbListImgI);
        }
        ;
        this.dbSelect(MgrData.inst.get(MgrDataItem.DB_CURRENT_IMG));
        // 缓存实验数据
        let expListImg = MgrData.inst.get(MgrDataItem.EXP_LIST_IMG_DATA);
        for (let i = 0; i < expListImg.length; i++) {
            let expListImgI = expListImg[i];
            this.expAddCache(expListImgI);
        }
        ;
        this.expSelect(MgrData.inst.get(MgrDataItem.EXP_CURRENT_IMG));
        this.mcRoot = new MCRoot(this);
        this.mcRoot.onInit();
    }
    /**
     * 当前的绘板存档
     * @returns
     */
    dbCurrent() {
        return this.dbMapIdToImg.get(MgrData.inst.get(MgrDataItem.DB_CURRENT_IMG));
    }
    /**
     * 选择
     * @param id
     */
    dbSelect(id) {
        MgrData.inst.set(MgrDataItem.DB_CURRENT_IMG, id);
        if (this.dbCurrent()) {
            this.dbCurrent().uint8CurrStatus.onSelected();
        }
        ;
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
    /**
     * 迁移
     * @param idxFrom
     * @param idxTo
     */
    dbMove(idxFrom, idxTo) {
        // 缓存图片数据
        let listImg = MgrData.inst.get(MgrDataItem.DB_LIST_IMG_DATA);
        let listImgFrom = listImg[idxFrom];
        listImg.splice(idxFrom, 1);
        listImg.splice(idxTo, 0, listImgFrom);
        let dbListImgFrom = this.dbListImg[idxFrom];
        this.dbListImg.splice(idxFrom, 1);
        this.dbListImg.splice(idxTo, 0, dbListImgFrom);
    }
    /**
     * 当前的实验图
     * @returns
     */
    expCurrent() {
        return this.expMapIdToImg.get(MgrData.inst.get(MgrDataItem.EXP_CURRENT_IMG));
    }
    /**
     * 选择
     * @param id
     */
    expSelect(id) {
        MgrData.inst.set(MgrDataItem.EXP_CURRENT_IMG, id);
        if (this.expCurrent()) {
            this.expCurrent().uint8CurrStatus.onSelected();
        }
        ;
    }
    /**
     * 加入到缓存
     * @param imgData
     */
    expAddCache(imgData) {
        let expImg = new ExpImg(imgData);
        this.expListImg.push(expImg);
        this.expMapIdToImg.set(expImg.expImgData.id, expImg);
    }
    /**
     * 创建实例
     * @param dataUrl
     */
    expCreate(dataUrl, width, height) {
        let id = MgrData.inst.get(MgrDataItem.SEED);
        id++;
        MgrData.inst.set(MgrDataItem.SEED, id);
        let imgData = {
            id: id,
            dataOrigin: dataUrl,
            width: width,
            height: height,
            paddingTop: 0,
            paddingRight: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            pixelWidth: 1,
            pixelHeight: 1
        };
        MgrData.inst.get(MgrDataItem.EXP_LIST_IMG_DATA).push(imgData);
        this.expAddCache(imgData);
        return id;
    }
    /**
     * 删除某索引的记录
     * @param idx
     */
    expDelete(idx) {
        let rec = this.expListImg[idx];
        this.expMapIdToImg.delete(rec.expImgData.id);
        this.expListImg.splice(idx, 1);
        MgrData.inst.get(MgrDataItem.EXP_LIST_IMG_DATA).splice(idx, 1);
        rec.destroy();
    }
    /**
     * 迁移
     * @param idxFrom
     * @param idxTo
     */
    expMove(idxFrom, idxTo) {
        // 缓存图片数据
        let listImg = MgrData.inst.get(MgrDataItem.EXP_LIST_IMG_DATA);
        let listImgFrom = listImg[idxFrom];
        listImg.splice(idxFrom, 1);
        listImg.splice(idxTo, 0, listImgFrom);
        let expListImgFrom = this.expListImg[idxFrom];
        this.expListImg.splice(idxFrom, 1);
        this.expListImg.splice(idxTo, 0, expListImgFrom);
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
        return IndexGlobal.inst.mcRoot.statusExperiment.detailStatusCreate;
    }
    IndexGlobal.mcExpCreate = mcExpCreate;
    /**
     * 当前列数策略
     */
    function fileColumnRS() {
        let fileColumnRS = FileColumnRS.mapIdToInst.get(MgrData.inst.get(MgrDataItem.COLUMN_COUNT));
        return fileColumnRS;
    }
    IndexGlobal.fileColumnRS = fileColumnRS;
    /**
     * 当前平滑策略
     * @returns
     */
    function smoothRS() {
        let smoothRS = DomImageSmoothRS.mapIdToInst.get(MgrData.inst.get(MgrDataItem.SMOOTH_RS));
        return smoothRS;
    }
    IndexGlobal.smoothRS = smoothRS;
    /**
     * 缩略图边长
     */
    IndexGlobal.IMG_MINI_SIZE = 64;
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
    /**
     * 步骤存储数量
     */
    IndexGlobal.BACK_UP_COUNT_MAX = 10;
})(IndexGlobal || (IndexGlobal = {}));
export default IndexGlobal;

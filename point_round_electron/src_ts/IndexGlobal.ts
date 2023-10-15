import MCRoot from "./game/MCRoot.js";
import MgrData from "./mgr/MgrData.js";
import MgrDataItem from "./mgr/MgrDataItem.js";
import MgrSdk from "./mgr/MgrSdk.js";
import DBImg from "./game/DBImg.js";
import DomImageSmoothRS from "./ui/DomImageSmoothRS.js";
import ExpImg from "./game/ExpImg.js";

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
        let dbListImg = MgrData.inst.get (MgrDataItem.DB_LIST_IMG_DATA);
        for (let i = 0; i < dbListImg.length; i++) {
            let dbListImgI = dbListImg [i];
            this.dbAddCache (dbListImgI);
        };

        // 缓存实验数据
        let expListImg = MgrData.inst.get (MgrDataItem.EXP_LIST_IMG_DATA);
        for (let i = 0; i < expListImg.length; i++) {
            let expListImgI = expListImg [i];
            this.expAddCache (expListImgI);
        };

        this.mcRoot = new MCRoot (this);
        this.mcRoot.onInit ();
    }

    /**
     * 实验数据的集合
     */
    expListImg = new Array <ExpImg> ();

    /**
     * 标识到实验数据的映射
     */
    expMapIdToImg = new Map <number, ExpImg> ();

    /**
     * 加入到缓存
     * @param imgData 
     */
    expAddCache (imgData: MgrDataItem.ExpImgData) {
        let expImg = new ExpImg (imgData);
        this.expListImg.push (expImg);
        this.expMapIdToImg.set (expImg.expImgData.id, expImg);
    }

    /**
     * 创建实例
     * @param dataUrl 
     */
    expCreate (dataUrl: string) {
        let id = MgrData.inst.get (MgrDataItem.SEED);
        id++;
        MgrData.inst.set (MgrDataItem.SEED, id);
        let imgData: MgrDataItem.ExpImgData = {
            id: id,
            dataOrigin: IndexGlobal.mcExpCreate ().img.src,
            paddingTop: 0,
            paddingRight: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            pixelWidth: 1,
            pixelHeight: 1
        };
        MgrData.inst.get (MgrDataItem.EXP_LIST_IMG_DATA).push (imgData);
        this.expAddCache (imgData);
        return id;
    }

    /**
     * 删除某索引的记录
     * @param idx 
     */
    expDelete (idx: number) {
        let rec = this.expListImg [idx];
        this.expMapIdToImg.delete (rec.expImgData.id);
        this.expListImg.splice (idx, 1);
        MgrData.inst.get (MgrDataItem.EXP_LIST_IMG_DATA).splice (idx, 1);
    }

    /**
     * 迁移
     * @param idxFrom 
     * @param idxTo 
     */
    expMove (idxFrom: number, idxTo: number) {
        // 缓存图片数据
        let listImg = MgrData.inst.get (MgrDataItem.EXP_LIST_IMG_DATA);
        
        let listImgFrom = listImg [idxFrom];
        listImg.splice (idxFrom, 1);
        listImg.splice (idxTo, 0, listImgFrom);

        let expListImgFrom = this.expListImg [idxFrom];
        this.expListImg.splice (idxFrom, 1);
        this.expListImg.splice (idxTo, 0, expListImgFrom);
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

    /**
     * 迁移
     * @param idxFrom 
     * @param idxTo 
     */
    dbMove (idxFrom: number, idxTo: number) {
        // 缓存图片数据
        let listImg = MgrData.inst.get (MgrDataItem.DB_LIST_IMG_DATA);
        
        let listImgFrom = listImg [idxFrom];
        listImg.splice (idxFrom, 1);
        listImg.splice (idxTo, 0, listImgFrom);

        let dbListImgFrom = this.dbListImg [idxFrom];
        this.dbListImg.splice (idxFrom, 1);
        this.dbListImg.splice (idxTo, 0, dbListImgFrom);
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
        return inst.mcRoot.statusExperiment.detailStatusCreate;
    }

    /**
     * 当前平滑策略
     * @returns 
     */
    export function smoothRS () {
        let smoothRS = DomImageSmoothRS.mapIdToInst.get (MgrData.inst.get (MgrDataItem.SMOOTH_RS));
        return smoothRS;
    }

    /**
     * 缩略图边长
     */
    export const IMG_MINI_SIZE = 64;

    /**
     * 纹素尺寸到屏幕尺寸的转换
     */
    export const PIXEL_TEX_TO_SCREEN = 16;

    /**
     * 高清值，每个屏幕像素对应多少个渲染缓冲区像素
     */
    export const ANTINA = 2;
    
    /**
     * 新建的画板宽度
     */
    export const DB_SIZE_NEW = 64;
    /**
     * 最大的画板尺寸
     */
    export const DB_SIZE_MAX = 256;

    /**
     * 像素尺寸到屏幕尺寸的转换 - 最小值
     */
    export const DB_PIXEL_TO_SCREEN_MIN = 2;
    /**
     * 像素尺寸到屏幕尺寸的转换 - 最大值
     */
    export const DB_PIXEL_TO_SCREEN_MAX = 64;
    /**
     * 步骤存储数量
     */
    export const BACK_UP_COUNT_MAX = 10;
}

export default IndexGlobal;
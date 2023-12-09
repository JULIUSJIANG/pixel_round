import MCRoot from "./game/MCRoot";
import MgrData from "./mgr/MgrData";
import MgrDataItem from "./mgr/MgrDataItem";
import MgrSdk from "./mgr/MgrSdk";
import DBImg from "./game/DBImg";
import DomImageSmoothRS from "./ui/DomImageSmoothRS";
import ExpImg from "./game/ExpImg";
import FileColumnRS from "./ui/FileColumnRS";
import NodeModules from "./NodeModules";

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
        this.dbSelect (MgrData.inst.get (MgrDataItem.DB_CURRENT_IMG));

        // 缓存实验数据
        let expListImg = MgrData.inst.get (MgrDataItem.EXP_LIST_IMG_DATA);
        for (let i = 0; i < expListImg.length; i++) {
            let expListImgI = expListImg [i];
            this.expAddCache (expListImgI);
        };
        this.expSelect (MgrData.inst.get (MgrDataItem.EXP_CURRENT_IMG));

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
     * 当前的绘板存档
     * @returns 
     */
    dbCurrent () {
        return this.dbMapIdToImg.get (MgrData.inst.get (MgrDataItem.DB_CURRENT_IMG));
    }

    /**
     * 选择
     * @param id 
     */
    dbSelect (id: number) {
        MgrData.inst.set (MgrDataItem.DB_CURRENT_IMG, id);
        if (this.dbCurrent ()) {
            this.dbCurrent ().uint8CurrStatus.onSelected ();
        };
    }

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

    /**
     * 实验数据的集合
     */
    expListImg = new Array <ExpImg> ();

    /**
     * 标识到实验数据的映射
     */
    expMapIdToImg = new Map <number, ExpImg> ();

    /**
     * 当前的实验图
     * @returns 
     */
    expCurrent () {
        return this.expMapIdToImg.get (MgrData.inst.get (MgrDataItem.EXP_CURRENT_IMG));
    }

    /**
     * 选择
     * @param id 
     */
    expSelect (id: number) {
        MgrData.inst.set (MgrDataItem.EXP_CURRENT_IMG, id);
        if (this.expCurrent ()) {
            this.expCurrent ().uint8CurrStatus.onSelected ();
        };
    }

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
    expCreate (dataUrl: string, width: number, height: number) {
        let id = MgrData.inst.get (MgrDataItem.SEED);
        id++;
        MgrData.inst.set (MgrDataItem.SEED, id);
        let imgData: MgrDataItem.ExpImgData = {
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
        rec.destroy ();
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
     * 当前列数策略
     */
    export function fileColumnRS () {
        let fileColumnRS = FileColumnRS.mapIdToInst.get (MgrData.inst.get (MgrDataItem.COLUMN_COUNT));
        return fileColumnRS;
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
    export const DB_SIZE_MAX = 512;

    /**
     * 判断尺寸是否超弦，并且给出提示
     * @param width 
     * @param height 
     * @returns 
     */
    export function SizeBan (width: number, height: number) {
        if (width < 1 || IndexGlobal.DB_SIZE_MAX < width) {
            NodeModules.antd.message.error(`宽度范围为 1 - ${IndexGlobal.DB_SIZE_MAX}，当前为 ${width}`);
            return true;
        };
        if (height < 1 || IndexGlobal.DB_SIZE_MAX < height) {
            NodeModules.antd.message.error(`高度范围为 1 - ${IndexGlobal.DB_SIZE_MAX}，当前为 ${height}`);
            return true;
        };
        return false;
    }

    /**
     * 像素尺寸到屏幕尺寸的转换 - 最小值
     */
    export const DB_PIXEL_TO_SCREEN_MIN = 1;
    /**
     * 像素尺寸到屏幕尺寸的转换 - 最大值
     */
    export const DB_PIXEL_TO_SCREEN_MAX = 64;
    /**
     * 步骤存储数量
     */
    export const BACK_UP_COUNT_MAX = 40;

    export const TIPS_PENCIL = `Q`;
    export const TIPS_PENCIL_KEY = `Key${TIPS_PENCIL}`;

    export const TIPS_PAINT_BUCKET = `W`;
    export const TIPS_PAINT_BUCKET_KEY = `Key${TIPS_PAINT_BUCKET}`;

    export const TIPS_COLOR_PICKER = `E`;
    export const TIPS_COLOR_PICKER_KEY = `Key${TIPS_COLOR_PICKER}`;

    export const TIPS_ERASER = `R`;
    export const TIPS_ERASER_KEY = `Key${TIPS_ERASER}`;

    export const TIPS_CANCEL = `T`;
    export const TIPS_CANCEL_KEY = `Key${TIPS_CANCEL}`;

    export const TIPS_RECOVERY = `Y`;
    export const TIPS_RECOVERY_KEY = `Key${TIPS_RECOVERY}`;
}

export default IndexGlobal;
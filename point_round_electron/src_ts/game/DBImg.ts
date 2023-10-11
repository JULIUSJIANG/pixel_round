import MgrDataItem from "../mgr/MgrDataItem.js";
import DBImgInitStatus from "./DBImgInitStatus.js";
import DBImgInitStatusFinished from "./DBImgInitStatusFinished.js";
import DBImgInitStatusIdle from "./DBImgInitStatusIdle.js";
import DBImgSrcStatus from "./DBImgSrcStatus.js";
import DBImgSrcStatusFinished from "./DBImgSrcStatusFinished.js";
import DBImgSrcStatusLoading from "./DBImgSrcStatusLoading.js";

/**
 * 画板数据的缓存
 */
export default class DBImg {

    /**
     * 标识
     */
    dbImgData: MgrDataItem.DBImgData;

    /**
     * 处于加载中的图片标签
     */
    imgLoading: HTMLImageElement;
    /**
     * 最新一个已加载完的图片
     */
    imgLoaded: HTMLImageElement;

    constructor (dbImgData: MgrDataItem.DBImgData) {
        this.dbImgData = dbImgData;
        this.imgLoading = new Image ();
        this.imgLoaded = new Image ();

        this.initStatusIdle = new DBImgInitStatusIdle (this);
        this.initStatusFinished = new DBImgInitStatusFinished (this);
        this.initEnter (this.initStatusIdle);

        this.srcStatusLoading = new DBImgSrcStatusLoading (this);
        this.srcStatusFinished = new DBImgSrcStatusFinished (this);
        this.srcEnter (this.srcStatusLoading);
    }

    /**
     * 状态 - 尚未初始化
     */
    initStatusIdle: DBImgInitStatusIdle;
    /**
     * 状态 - 初始化完毕
     */
    initStatusFinished: DBImgInitStatusFinished;

    /**
     * 当前状态
     */
    initCurrStatus: DBImgInitStatus;

    /**
     * 切换状态
     * @param status 
     */
    initEnter (status: DBImgInitStatus) {
        let rec = this.initCurrStatus;
        this.initCurrStatus = status;
        if (rec) {
            rec.onExit ();
        };
        this.initCurrStatus.onEnter ();
    }

    /**
     * 状态 - 加载中
     */
    srcStatusLoading: DBImgSrcStatusLoading;
    /**
     * 状态 - 已完成
     */
    srcStatusFinished: DBImgSrcStatusFinished;

    /**
     * 当前状态
     */
    srcCurrStatus: DBImgSrcStatus;

    /**
     * 切换状态
     * @param status 
     */
    srcEnter (status: DBImgSrcStatus) {
        let rec = this.srcCurrStatus;
        this.srcCurrStatus = status;
        if (rec) {
            rec.onExit ();
        };
        this.srcCurrStatus.onEnter ();
    }
}
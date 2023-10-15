import IndexGlobal from "../IndexGlobal.js";
import JWebgl from "../common/JWebgl.js";
import JWebglEnum from "../common/JWebglEnum.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import DBImgInitStatus from "./DBImgInitStatus.js";
import DBImgInitStatusFinished from "./DBImgInitStatusFinished.js";
import DBImgInitStatusIdle from "./DBImgInitStatusIdle.js";
import DBImgMaskStatus from "./DBImgMaskStatus.js";
import DBImgMaskStatusActive from "./DBImgMaskStatusActive.js";
import DBImgMaskStatusIdle from "./DBImgMaskStatusIdle.js";
import DBImgSrcStatus from "./DBImgSrcStatus.js";
import DBImgSrcStatusFinished from "./DBImgSrcStatusFinished.js";
import DBImgSrcStatusLoading from "./DBImgSrcStatusLoading.js";

/**
 * 画板数据的缓存
 */
class DBImg {

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
        this.backUpStatus (this.dbImgData.dataOrigin, this.dbImgData.width, this.dbImgData.height)
        this.srcCurrStatus.onSrcChanged ();

        this.maskStatusIdle = new DBImgMaskStatusIdle (this);
        this.maskStatusActive = new DBImgMaskStatusActive (this);
        this.maskEnter (this.maskStatusIdle);
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

    /**
     * 面具
     */
    mask: DBImg;

    /**
     * 状态 - 待机
     */
    maskStatusIdle: DBImgMaskStatusIdle;
    /**
     * 状态 - 面具已激活
     */
    maskStatusActive: DBImgMaskStatusActive;

    /**
     * 面具 - 当前状态
     */
    maskCurrStatus: DBImgMaskStatus;

    /**
     * 切换状态
     * @param status 
     */
    maskEnter (status: DBImgMaskStatus) {
        let rec = this.maskCurrStatus;
        this.maskCurrStatus = status;
        if (rec) {
            rec.onExit ();
        };
        this.maskCurrStatus.onEnter ();
    }

    /**
     * 载入数据
     * @param arrUint8 
     * @param w 
     * @param h 
     */
    loadUrl (url: string, width: number, height: number) {
        // 加载中，且和加载中的目标一致，那么忽略
        if (this.srcCurrStatus == this.srcStatusLoading && this.imgLoading.src == url) {
            return;
        };
        // 加载完毕，且和加载完毕的一致，那么忽略
        if (this.srcCurrStatus == this.srcStatusFinished && this.imgLoaded.src == url) {
            return;
        };
        // 把状态压入队列
        this.backUpStatus (url, width, height);
        this.srcCurrStatus.onSrcChanged ();
    }

    /**
     * 所有的历史记录
     */
    listStatus = new Array <MgrDataItem.DBImgData> ();

    /**
     * 当前状态的索引
     */
    idxStatus: number = -1;

    /**
     * 对状态进行备份
     * @param url 
     * @param width 
     * @param height 
     */
    backUpStatus (url: string, width: number, height: number) {
        // 核心数据的备份
        let backup: MgrDataItem.DBImgData = {
            id: null,
            dataOrigin: url,
            width: width,
            height: height
        };
        // 把当前状态后面的状态都给去了
        this.listStatus.splice (this.idxStatus + 1);
        this.listStatus.push (backup);
        this.idxStatus = this.listStatus.length - 1;
        // 超量，剔除首个
        if (IndexGlobal.BACK_UP_COUNT_MAX < this.listStatus.length) {
            this.listStatus.shift ();
            this.idxStatus = this.listStatus.length - 1;
        };
    }

    /**
     * 撤销
     */
    cancel () {
        if (0 < this.idxStatus) {
            this.idxStatus--;
            this.srcCurrStatus.onSrcChanged ();
        };
    }

    /**
     * 恢复
     */
    recovery () {
        if (this.idxStatus < this.listStatus.length - 1) {
            this.idxStatus++;
            this.srcCurrStatus.onSrcChanged ();
        };
    }
}

export default DBImg;
import DBImgInitStatusFinished from "./DBImgInitStatusFinished.js";
import DBImgInitStatusIdle from "./DBImgInitStatusIdle.js";
import DBImgSrcStatusFinished from "./DBImgSrcStatusFinished.js";
import DBImgSrcStatusLoading from "./DBImgSrcStatusLoading.js";
/**
 * 画板数据的缓存
 */
export default class DBImg {
    constructor(dbImgData) {
        this.dbImgData = dbImgData;
        this.imgLoading = new Image();
        this.imgLoaded = new Image();
        this.initStatusIdle = new DBImgInitStatusIdle(this);
        this.initStatusFinished = new DBImgInitStatusFinished(this);
        this.initEnter(this.initStatusIdle);
        this.srcStatusLoading = new DBImgSrcStatusLoading(this);
        this.srcStatusFinished = new DBImgSrcStatusFinished(this);
        this.srcEnter(this.srcStatusLoading);
    }
    /**
     * 切换状态
     * @param status
     */
    initEnter(status) {
        let rec = this.initCurrStatus;
        this.initCurrStatus = status;
        if (rec) {
            rec.onExit();
        }
        ;
        this.initCurrStatus.onEnter();
    }
    /**
     * 切换状态
     * @param status
     */
    srcEnter(status) {
        let rec = this.srcCurrStatus;
        this.srcCurrStatus = status;
        if (rec) {
            rec.onExit();
        }
        ;
        this.srcCurrStatus.onEnter();
    }
}

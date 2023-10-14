import IndexGlobal from "../IndexGlobal.js";
import DBImgInitStatusFinished from "./DBImgInitStatusFinished.js";
import DBImgInitStatusIdle from "./DBImgInitStatusIdle.js";
import DBImgSrcStatusFinished from "./DBImgSrcStatusFinished.js";
import DBImgSrcStatusLoading from "./DBImgSrcStatusLoading.js";
/**
 * 画板数据的缓存
 */
class DBImg {
    constructor(dbImgData) {
        /**
         * 所有的历史记录
         */
        this.listStatus = new Array();
        /**
         * 当前状态的索引
         */
        this.idxStatus = -1;
        this.dbImgData = dbImgData;
        this.imgLoading = new Image();
        this.imgLoaded = new Image();
        this.initStatusIdle = new DBImgInitStatusIdle(this);
        this.initStatusFinished = new DBImgInitStatusFinished(this);
        this.initEnter(this.initStatusIdle);
        this.srcStatusLoading = new DBImgSrcStatusLoading(this);
        this.srcStatusFinished = new DBImgSrcStatusFinished(this);
        this.srcEnter(this.srcStatusLoading);
        this.backUpStatus(this.dbImgData.dataOrigin, this.dbImgData.width, this.dbImgData.height);
        this.srcCurrStatus.onSrcChanged();
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
    /**
     * 载入数据
     * @param arrUint8
     * @param w
     * @param h
     */
    loadUrl(url, width, height) {
        // 加载中，且和加载中的目标一致，那么忽略
        if (this.srcCurrStatus == this.srcStatusLoading && this.imgLoading.src == url) {
            return;
        }
        ;
        // 加载完毕，且和加载完毕的一致，那么忽略
        if (this.srcCurrStatus == this.srcStatusFinished && this.imgLoaded.src == url) {
            return;
        }
        ;
        // 把状态压入队列
        this.backUpStatus(url, width, height);
        this.srcCurrStatus.onSrcChanged();
    }
    /**
     * 对状态进行备份
     * @param url
     * @param width
     * @param height
     */
    backUpStatus(url, width, height) {
        // 核心数据的备份
        let backup = {
            id: null,
            dataOrigin: url,
            width: width,
            height: height
        };
        // 把当前状态后面的状态都给去了
        this.listStatus.splice(this.idxStatus + 1);
        this.listStatus.push(backup);
        this.idxStatus = this.listStatus.length - 1;
        // 超量，剔除首个
        if (IndexGlobal.BACK_UP_COUNT_MAX < this.listStatus.length) {
            this.listStatus.shift();
            this.idxStatus = this.listStatus.length - 1;
        }
        ;
    }
    /**
     * 撤销
     */
    cancel() {
        if (0 < this.idxStatus) {
            this.idxStatus--;
            this.srcCurrStatus.onSrcChanged();
        }
        ;
    }
    /**
     * 恢复
     */
    recovery() {
        if (this.idxStatus < this.listStatus.length - 1) {
            this.idxStatus++;
            this.srcCurrStatus.onSrcChanged();
        }
        ;
    }
}
export default DBImg;

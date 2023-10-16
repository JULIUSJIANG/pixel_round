import IndexGlobal from "../IndexGlobal.js";
import objectPool from "../common/ObjectPool.js";
import DBImgStatus from "./DBImgStatus.js";
import DBImgMaskStatusActive from "./DBImgMaskStatusActive.js";
import DBImgMaskStatusIdle from "./DBImgMaskStatusIdle.js";
import DBImgUint8StatusDestroy from "./DBImgUint8StatusDestroy.js";
import DBImgUint8StatusIdle from "./DBImgUint8StatusIdle.js";
import DBImgUint8StatusLoaded from "./DBImgUint8StatusLoaded.js";
import DBImgUint8StatusLoading from "./DBImgUint8StatusLoading.js";
/**
 * 画板数据的缓存
 */
class DBImg {
    constructor(dbImgData) {
        /**
         * 所有的状态记录
         */
        this.statusList = new Array();
        this.dbImgData = dbImgData;
        this.maskStatusIdle = new DBImgMaskStatusIdle(this);
        this.maskStatusActive = new DBImgMaskStatusActive(this);
        this.maskEnter(this.maskStatusIdle);
        this.uint8StatusIdle = new DBImgUint8StatusIdle(this);
        this.uint8StatusLoading = new DBImgUint8StatusLoading(this);
        this.uint8StatusLoaded = new DBImgUint8StatusLoaded(this);
        this.uint8StatusDestroy = new DBImgUint8StatusDestroy(this);
        this.uint8Enter(this.uint8StatusIdle);
    }
    /**
     * 切换状态
     * @param status
     */
    maskEnter(status) {
        let rec = this.maskCurrStatus;
        this.maskCurrStatus = status;
        if (rec) {
            rec.onExit();
        }
        ;
        this.maskCurrStatus.onEnter();
    }
    /**
     * 流 - 切换状态
     * @param status
     */
    uint8Enter(status) {
        let rec = this.uint8CurrStatus;
        this.uint8CurrStatus = status;
        if (rec) {
            rec.onExit();
        }
        ;
        this.uint8CurrStatus.onEnter();
    }
    /**
     * 当前状态
     * @returns
     */
    statusCurrent() {
        return this.statusList[this.statusIdx];
    }
    /**
     * 对状态进行备份
     * @param url
     * @param width
     * @param height
     */
    statusPush(bin, width, height) {
        let status = DBImgStatus.create(bin, width, height);
        // 清理后面的状态
        for (let i = this.statusIdx + 1; i < this.statusList.length; i++) {
            let listStatusI = this.statusList[i];
            objectPool.push(listStatusI);
        }
        ;
        this.statusList.splice(this.statusIdx + 1);
        this.statusList.push(status);
        // 超量，剔除首个
        if (IndexGlobal.BACK_UP_COUNT_MAX < this.statusList.length) {
            let listStatusShift = this.statusList.shift();
            objectPool.push(listStatusShift);
        }
        ;
        this.statusIdx = this.statusList.length - 1;
        this.statusOnChanged();
    }
    /**
     * 撤销
     */
    statusCancel() {
        if (0 < this.statusIdx) {
            this.statusIdx--;
            this.statusOnChanged();
        }
        ;
    }
    /**
     * 恢复
     */
    statusRecovery() {
        if (this.statusIdx < this.statusList.length - 1) {
            this.statusIdx++;
            this.statusOnChanged();
        }
        ;
    }
    /**
     * 事件派发 - 状态回调
     */
    statusOnChanged() {
        this.dbImgData.dataOrigin = this.statusCurrent().base64;
        this.dbImgData.width = this.statusCurrent().width;
        this.dbImgData.height = this.statusCurrent().height;
    }
}
export default DBImg;

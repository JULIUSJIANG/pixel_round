import ExpImgMaskStatusActive from "./ExpImgMaskStatusActive.js";
import ExpImgMaskStatusIdle from "./ExpImgMaskStatusIdle.js";
import ExpImgUint8StatusDestroy from "./ExpImgUint8StatusDestroy.js";
import ExpImgUint8StatusIdle from "./ExpImgUint8StatusIdle.js";
import ExpImgUint8StatusLoaded from "./ExpImgUint8StatusLoaded.js";
import ExpImgUint8StatusLoading from "./ExpImgUint8StatusLoading.js";
/**
 * 实验数据的缓存
 */
class ExpImg {
    constructor(expImgData) {
        this.expImgData = expImgData;
        this.maskStatusIdle = new ExpImgMaskStatusIdle(this);
        this.maskStatusActive = new ExpImgMaskStatusActive(this);
        this.maskEnter(this.maskStatusIdle);
        this.uint8StatusIdle = new ExpImgUint8StatusIdle(this);
        this.uint8StatusLoading = new ExpImgUint8StatusLoading(this);
        this.uint8StatusLoaded = new ExpImgUint8StatusLoaded(this);
        this.uint8StatusDestroy = new ExpImgUint8StatusDestroy(this);
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
     * 销毁
     */
    destroy() {
        this.uint8CurrStatus.onDestory();
    }
}
export default ExpImg;

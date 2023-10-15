import ExpImgMaskStatusActive from "./ExpImgMaskStatusActive.js";
import ExpImgMaskStatusIdle from "./ExpImgMaskStatusIdle.js";
/**
 * 实验数据的缓存
 */
class ExpImg {
    constructor(expImgData) {
        this.expImgData = expImgData;
        this.maskStatusIdle = new ExpImgMaskStatusIdle(this);
        this.maskStatusActive = new ExpImgMaskStatusActive(this);
        this.maskEnter(this.maskStatusIdle);
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
}
export default ExpImg;

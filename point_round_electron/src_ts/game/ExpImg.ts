import MgrDataItem from "../mgr/MgrDataItem.js";
import ExpImgMaskStatus from "./ExpImgMaskStatus.js";
import ExpImgMaskStatusActive from "./ExpImgMaskStatusActive.js";
import ExpImgMaskStatusIdle from "./ExpImgMaskStatusIdle.js";

/**
 * 实验数据的缓存
 */
class ExpImg {

    /**
     * 标识
     */
    expImgData: MgrDataItem.ExpImgData;

    constructor (expImgData: MgrDataItem.ExpImgData) {
        this.expImgData = expImgData;

        this.maskStatusIdle = new ExpImgMaskStatusIdle (this);
        this.maskStatusActive = new ExpImgMaskStatusActive (this);
        this.maskEnter (this.maskStatusIdle);
    }

    /**
     * 面具
     */
    mask: ExpImg;

    /**
     * 状态 - 待机
     */
    maskStatusIdle: ExpImgMaskStatusIdle;
    /**
     * 状态 - 面具已激活
     */
    maskStatusActive: ExpImgMaskStatusActive;

    /**
     * 面具 - 当前状态
     */
    maskCurrStatus: ExpImgMaskStatus;

    /**
     * 切换状态
     * @param status 
     */
    maskEnter (status: ExpImgMaskStatus) {
        let rec = this.maskCurrStatus;
        this.maskCurrStatus = status;
        if (rec) {
            rec.onExit ();
        };
        this.maskCurrStatus.onEnter ();
    }
}

export default ExpImg;
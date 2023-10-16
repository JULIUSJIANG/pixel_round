import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrResAssetsImage from "../mgr/MgrResAssetsImage.js";
import ExpImgMaskStatus from "./ExpImgMaskStatus.js";
import ExpImgMaskStatusActive from "./ExpImgMaskStatusActive.js";
import ExpImgMaskStatusIdle from "./ExpImgMaskStatusIdle.js";
import ExpImgUint8Status from "./ExpImgUint8Status.js";
import ExpImgUint8StatusDestroy from "./ExpImgUint8StatusDestroy.js";
import ExpImgUint8StatusIdle from "./ExpImgUint8StatusIdle.js";
import ExpImgUint8StatusLoaded from "./ExpImgUint8StatusLoaded.js";
import ExpImgUint8StatusLoading from "./ExpImgUint8StatusLoading.js";

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

        this.uint8StatusIdle = new ExpImgUint8StatusIdle (this);
        this.uint8StatusLoading = new ExpImgUint8StatusLoading (this);
        this.uint8StatusLoaded = new ExpImgUint8StatusLoaded (this);
        this.uint8StatusDestroy = new ExpImgUint8StatusDestroy (this);
        this.uint8Enter (this.uint8StatusIdle);
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

    /**
     * 用于加载的 image
     */
    uint8Img: MgrResAssetsImage;

    /**
     * 流 - 待机
     */
    uint8StatusIdle: ExpImgUint8StatusIdle;
    /**
     * 流 - 加载中
     */
    uint8StatusLoading: ExpImgUint8StatusLoading;
    /**
     * 流 - 加载完毕
     */
    uint8StatusLoaded: ExpImgUint8StatusLoaded;
    /**
     * 流 - 销毁
     */
    uint8StatusDestroy: ExpImgUint8StatusDestroy;

    /**
     * 流 - 当前状态
     */
    uint8CurrStatus: ExpImgUint8Status;

    /**
     * 流 - 切换状态
     * @param status 
     */
    uint8Enter (status: ExpImgUint8Status) {
        let rec = this.uint8CurrStatus;
        this.uint8CurrStatus = status;
        if (rec) {
            rec.onExit ();
        };
        this.uint8CurrStatus.onEnter ();
    }

    /**
     * 销毁
     */
    destroy () {
        this.uint8CurrStatus.onDestory ();
    }
}

export default ExpImg;
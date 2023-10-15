import MgrDataItem from "../mgr/MgrDataItem";

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
    }
}

export default ExpImg;
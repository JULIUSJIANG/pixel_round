/**
 * 数据管理 - 具体记录
 */
class MgrDataItem {
    constructor(args) {
        this.key = args.key;
        this.defVal = args.defVal;
        MgrDataItem.listItem.push(this);
    }
}
/**
 * 改这个值，整个存档都会重置
 */
const VERSION = 19;
(function (MgrDataItem) {
    /**
     * 所有具体记录
     */
    MgrDataItem.listItem = new Array();
    /**
     * 当前的详情状态
     */
    MgrDataItem.DETAIL_MACHINE_STATUS = new MgrDataItem({
        key: `DETAIL_MACHINE_STATUS_${VERSION}`,
        defVal: 0
    });
    /**
     * 图片数据的 id 种子
     */
    MgrDataItem.LIST_SEED = new MgrDataItem({
        key: `LIST_SEED_${VERSION}`,
        defVal: 0
    });
    MgrDataItem.LIST_IMG_DATA = new MgrDataItem({
        key: `LIST_IMG_DATA_${VERSION}`,
        defVal: []
    });
})(MgrDataItem || (MgrDataItem = {}));
export default MgrDataItem;

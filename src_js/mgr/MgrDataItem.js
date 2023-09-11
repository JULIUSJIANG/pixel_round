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
     * 当前案例
     */
    MgrDataItem.CURRENT_DEMO = new MgrDataItem({
        key: `CURRENT_DEMO_${VERSION}`,
        defVal: null
    });
    /**
     * 当前透视角
     */
    MgrDataItem.CURRENT_FOV = new MgrDataItem({
        key: `CURRENT_FOV_${VERSION}`,
        defVal: 1
    });
})(MgrDataItem || (MgrDataItem = {}));
export default MgrDataItem;

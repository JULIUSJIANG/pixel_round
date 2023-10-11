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
const VERSION = 21;
(function (MgrDataItem) {
    /**
     * 所有具体记录
     */
    MgrDataItem.listItem = new Array();
    /**
     * 启动时自动打开调试工具
     */
    MgrDataItem.AUTO_DEBUG_TOOLS = new MgrDataItem({
        key: `AUTO_DEBUG_TOOLS_${VERSION}`,
        defVal: false
    });
    /**
     * 根状态
     */
    MgrDataItem.MC_STATUS = new MgrDataItem({
        key: `MC_STATUS_${VERSION}`,
        defVal: 0
    });
    /**
     * 根状态 - 实验模式状态
     */
    MgrDataItem.MC_STATUS_EXP_STATUS = new MgrDataItem({
        key: `MC_STATUS_EXP_STATUS_${VERSION}`,
        defVal: 0
    });
    /**
     * id 种子
     */
    MgrDataItem.SEED = new MgrDataItem({
        key: `SEED_${VERSION}`,
        defVal: 0
    });
    ;
    MgrDataItem.DB_LIST_IMG_DATA = new MgrDataItem({
        key: `DB_LIST_IMG_DATA_${VERSION}`,
        defVal: []
    });
    /**
     * 画板模式 - 当前图片
     */
    MgrDataItem.DB_CURRENT_IMG = new MgrDataItem({
        key: `DB_CURRENT_IMG_${VERSION}`,
        defVal: 0
    });
    MgrDataItem.EXP_LIST_IMG_DATA = new MgrDataItem({
        key: `EXP_LIST_IMG_DATA_${VERSION}`,
        defVal: []
    });
    /**
     * 实验模式 - 当前图片
     */
    MgrDataItem.EXP_CURRENT_IMG = new MgrDataItem({
        key: `EXP_CURRENT_IMG_${VERSION}`,
        defVal: 0
    });
})(MgrDataItem || (MgrDataItem = {}));
export default MgrDataItem;

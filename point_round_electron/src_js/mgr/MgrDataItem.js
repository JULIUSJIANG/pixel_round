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
    /**
     * 像素到屏幕显示的比率
     */
    MgrDataItem.SMOOTH_PIXEL_TO_SCREEN_APPLICATION = new MgrDataItem({
        key: `SMOOTH_PIXEL_TO_SCREEN_APPLICATION_${VERSION}`,
        defVal: 16
    });
    /**
     * 像素到屏幕显示的比率
     */
    MgrDataItem.SMOOTH_PIXEL_TO_SCREEN_TEMP = new MgrDataItem({
        key: `SMOOTH_PIXEL_TO_SCREEN_TEMP_${VERSION}`,
        defVal: 16
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
    /**
     * 画板模式 - 当前颜色
     */
    MgrDataItem.DB_COLOR = new MgrDataItem({
        key: `DB_COLOR_${VERSION}`,
        defVal: `#ffffffff`
    });
    MgrDataItem.DB_SIZE_NEW = 64;
    /**
     * 宽
     */
    MgrDataItem.DB_WIDTH = new MgrDataItem({
        key: `DB_WIDTH_${VERSION}`,
        defVal: MgrDataItem.DB_SIZE_NEW,
    });
    /**
     * 高
     */
    MgrDataItem.DB_HEIGHT = new MgrDataItem({
        key: `DB_HEIGHT_${VERSION}`,
        defVal: MgrDataItem.DB_SIZE_NEW,
    });
    /**
     * 水平移动
     */
    MgrDataItem.DB_OFFSET_X = new MgrDataItem({
        key: `DB_OFFSET_X_${VERSION}`,
        defVal: 1
    });
    /**
     * 垂直移动
     */
    MgrDataItem.DB_OFFSET_Y = new MgrDataItem({
        key: `DB_OFFSET_Y_${VERSION}`,
        defVal: 1
    });
    /**
     * 像素到屏幕显示的比率
     */
    MgrDataItem.DB_PIXEL_TO_SCREEN_APPLICATION = new MgrDataItem({
        key: `DB_PIXEL_TO_SCREEN_APPLICATION_${VERSION}`,
        defVal: 16
    });
    /**
     * 像素到屏幕显示的比率
     */
    MgrDataItem.DB_PIXEL_TO_SCREEN_TEMP = new MgrDataItem({
        key: `DB_PIXEL_TO_SCREEN_TEMP_${VERSION}`,
        defVal: 16
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

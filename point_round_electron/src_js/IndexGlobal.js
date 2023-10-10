import MCRoot from "./game/MCRoot.js";
import MgrData from "./mgr/MgrData.js";
import MgrDataItem from "./mgr/MgrDataItem.js";
import MgrSdk from "./mgr/MgrSdk.js";
class IndexGlobal {
    /**
     * 初始化
     */
    init() {
        // 勾选了默认打开调试工具
        if (MgrData.inst.get(MgrDataItem.AUTO_DEBUG_TOOLS)) {
            MgrSdk.inst.core.openDebugTools();
        }
        ;
        this.mcRoot = new MCRoot(this);
        this.mcRoot.onInit();
    }
}
(function (IndexGlobal) {
    IndexGlobal.inst = new IndexGlobal();
    /**
     * 绘画状态机
     * @returns
     */
    function mcDB() {
        return IndexGlobal.inst.mcRoot.statusDrawingBoard;
    }
    IndexGlobal.mcDB = mcDB;
    /**
     * 实验状态机
     * @returns
     */
    function mcExp() {
        return IndexGlobal.inst.mcRoot.statusExperiment;
    }
    IndexGlobal.mcExp = mcExp;
    /**
     * 实验状态机 - 创建
     */
    function mcExpCreate() {
        return IndexGlobal.inst.mcRoot.statusExperiment.statusCreate;
    }
    IndexGlobal.mcExpCreate = mcExpCreate;
    /**
     * 缩略图边长
     */
    IndexGlobal.IMG_MINI_SIZE = 100;
    /**
     * 缩略图列数
     */
    IndexGlobal.IMG_LIST_COLUMN_COUNT = 1;
    /**
     * 纹素尺寸到屏幕尺寸的转换
     */
    IndexGlobal.PIXEL_TEX_TO_SCREEN = 16;
    /**
     * 高清值，每个屏幕像素对应多少个渲染缓冲区像素
     */
    IndexGlobal.ANTINA = 2;
})(IndexGlobal || (IndexGlobal = {}));
export default IndexGlobal;

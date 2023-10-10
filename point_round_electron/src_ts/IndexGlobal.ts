import MCRootStatusExperimentStatusCreate from "./game/MCRootStatusExperimentStatusCreate.js";
import MCRoot from "./game/MCRoot.js";
import MgrData from "./mgr/MgrData.js";
import MgrDataItem from "./mgr/MgrDataItem.js";
import MgrSdk from "./mgr/MgrSdk.js";

class IndexGlobal {
    /**
     * 根状态机
     */
    mcRoot: MCRoot;

    /**
     * 初始化
     */
    init () {
        // 勾选了默认打开调试工具
        if (MgrData.inst.get (MgrDataItem.AUTO_DEBUG_TOOLS)) {
            MgrSdk.inst.core.openDebugTools ();
        };

        this.mcRoot = new MCRoot (this);
        this.mcRoot.onInit ();
    }
}

namespace IndexGlobal {

    export const inst = new IndexGlobal ();

    /**
     * 绘画状态机
     * @returns 
     */
    export function mcDB () {
        return inst.mcRoot.statusDrawingBoard;
    }

    /**
     * 实验状态机
     * @returns 
     */
    export function mcExp () {
        return inst.mcRoot.statusExperiment;
    }

    /**
     * 实验状态机 - 创建
     */
    export function mcExpCreate () {
        return inst.mcRoot.statusExperiment.statusCreate;
    }

    /**
     * 缩略图边长
     */
    export const IMG_MINI_SIZE = 100;

    /**
     * 缩略图列数
     */
    export const IMG_LIST_COLUMN_COUNT = 1;

    /**
     * 纹素尺寸到屏幕尺寸的转换
     */
    export const PIXEL_TEX_TO_SCREEN = 16;

    /**
     * 高清值，每个屏幕像素对应多少个渲染缓冲区像素
     */
    export const ANTINA = 2;
}

export default IndexGlobal;
/**
 * 数据管理 - 具体记录
 */
class MgrDataItem<T> {

    /**
     * 访问该记录的键
     */
    key: string;

    /**
     * 该记录的默认值
     */
    defVal: T;

    constructor (args: {
        key: string,
        defVal: T
    })
    {
        this.key = args.key;
        this.defVal = args.defVal;

        MgrDataItem.listItem.push (this);
    }
}

/**
 * 改这个值，整个存档都会重置
 */
const VERSION = 21;

namespace MgrDataItem {
    /**
     * 所有具体记录
     */
    export const listItem: Array <MgrDataItem <unknown>> = new Array ();

    /**
     * 启动时自动打开调试工具
     */
    export const AUTO_DEBUG_TOOLS = new MgrDataItem <boolean> ({
        key: `AUTO_DEBUG_TOOLS_${VERSION}`,
        defVal: false
    });

    /**
     * 根状态
     */
    export const MC_STATUS = new MgrDataItem <number> ({
        key: `MC_STATUS_${VERSION}`,
        defVal: 0
    });

    /**
     * 根状态 - 实验模式状态
     */
    export const MC_STATUS_EXP_STATUS = new MgrDataItem <number> ({
        key: `MC_STATUS_EXP_STATUS_${VERSION}`,
        defVal: 0
    });

    /**
     * id 种子
     */
    export const SEED = new MgrDataItem <number> ({
        key: `SEED_${VERSION}`,
        defVal: 0
    });

    /**
     * 画板模式 - 图片数据
     */
    export interface DBImgData {
        id: number;
        dataOrigin: string;
        width: number;
        height: number;
    };
    export const DB_LIST_IMG_DATA = new MgrDataItem <Array <DBImgData>> ({
        key: `DB_LIST_IMG_DATA_${VERSION}`,
        defVal: []
    });
    /**
     * 画板模式 - 当前图片
     */
    export const DB_CURRENT_IMG = new MgrDataItem <number> ({
        key: `DB_CURRENT_IMG_${VERSION}`,
        defVal: 0
    });

    /**
     * 实验模式 - 图片数据
     */
    export interface ExpImgData {
        id: number;
        dataOrigin: string;
        paddingTop: number;
        paddingRight: number;
        paddingBottom: number;
        paddingLeft: number;
        pixelWidth: number;
        pixelHeight: number;
    }
    export const EXP_LIST_IMG_DATA = new MgrDataItem <Array <ExpImgData>> ({
        key: `EXP_LIST_IMG_DATA_${VERSION}`,
        defVal: []
    });
    /**
     * 实验模式 - 当前图片
     */
    export const EXP_CURRENT_IMG = new MgrDataItem <number> ({
        key: `EXP_CURRENT_IMG_${VERSION}`,
        defVal: 0
    });
}

export default MgrDataItem;
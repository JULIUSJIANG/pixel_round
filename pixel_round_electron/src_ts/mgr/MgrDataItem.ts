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
const VERSION = 19;

namespace MgrDataItem {
    /**
     * 所有具体记录
     */
    export const listItem: Array <MgrDataItem <unknown>> = new Array ();

    /**
     * 当前的详情状态
     */
    export const DETAIL_MACHINE_STATUS = new MgrDataItem <number> ({
        key: `DETAIL_MACHINE_STATUS_${VERSION}`,
        defVal: 0
    });

    /**
     * 图片数据的 id 种子
     */
    export const LIST_SEED = new MgrDataItem <number> ({
        key: `LIST_SEED_${VERSION}`,
        defVal: 0
    });
    /**
     * 图片数据
     */
    export interface ImgData {
        id: number;
        dataOrigin: string
    }
    export const LIST_IMG_DATA = new MgrDataItem <Array <ImgData>> ({
        key: `LIST_IMG_DATA_${VERSION}`,
        defVal: []
    });

    /**
     * 当前查看的图片
     */
    export const CURRENT_IMG = new MgrDataItem <number> ({
        key: `CURRENT_IMG_${VERSION}`,
        defVal: 0
    });
}

export default MgrDataItem;
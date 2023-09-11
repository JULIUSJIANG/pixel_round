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
     * 当前案例
     */
    export const CURRENT_DEMO = new MgrDataItem <string> ({
        key: `CURRENT_DEMO_${VERSION}`,
        defVal: null
    });

    /**
     * 当前透视角
     */
    export const CURRENT_FOV = new MgrDataItem <number> ({
        key: `CURRENT_FOV_${VERSION}`,
        defVal: 1
    });
}

export default MgrDataItem;
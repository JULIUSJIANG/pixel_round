/**
 * 对象池 - 类型
 */
export default class ObjectPoolType <T> {
    /**
     * 实际容器
     */
    _coll = new Array <T> ();

    /**
     * 实际容器
     */
    _set = new Set <T> ();

    /**
     * 实例化
     */
    instantiate: () => T;

    /**
     * 事件派发 - 提取
     */
    onPop: (t: T) => void;

    /**
     * 事件派发 - 存储
     */
    onPush: (t: T) => void;

    constructor (args: {
        instantiate: () => T,
        onPop: (t: T) => void,
        onPush: (t: T) => void
    })
    {
        this.instantiate = args.instantiate;
        this.onPop = args.onPop;
        this.onPush = args.onPush;
    }
}
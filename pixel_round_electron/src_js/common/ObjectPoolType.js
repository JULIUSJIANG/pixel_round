/**
 * 对象池 - 类型
 */
export default class ObjectPoolType {
    constructor(args) {
        /**
         * 实际容器
         */
        this._coll = new Array();
        /**
         * 实际容器
         */
        this._set = new Set();
        this.instantiate = args.instantiate;
        this.onPop = args.onPop;
        this.onPush = args.onPush;
    }
}

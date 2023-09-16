import ObjectPoolType from "./ObjectPoolType.js";
const TYPE_OBJECT = `object`;
/**
 * 对象池
 */
class objectPool {
}
(function (objectPool) {
    const SYMBOL = Symbol(`objectPool.SYMBOL`);
    /**
     * 提取对象池实例
     * @param type
     * @returns
     */
    function pop(type) {
        let t;
        if (type._coll.length == 0) {
            t = type.instantiate();
            t[SYMBOL] = type;
        }
        else {
            t = type._coll.pop();
            type._set.delete(t);
        }
        ;
        if (type.onPop) {
            type.onPop(t);
        }
        ;
        return t;
    }
    objectPool.pop = pop;
    /**
     * 存储对象池实例
     * @param t
     */
    function push(t) {
        // 空对象，忽略
        if (t == null) {
            return;
        }
        ;
        // 非对象，忽略
        if (typeof t != TYPE_OBJECT) {
            return;
        }
        ;
        let type = t[SYMBOL];
        // 非对象池生成出来的，忽略
        if (!type) {
            return;
        }
        ;
        // 已经在对象池里面了
        if (type._set.has(t)) {
            return;
        }
        ;
        type._set.add(t);
        type._coll.push(t);
        if (type.onPush) {
            type.onPush(t);
        }
        ;
    }
    objectPool.push = push;
    /**
     * 类型 - 列表
     */
    objectPool.typeArray = new ObjectPoolType({
        instantiate: () => {
            return new Array();
        },
        onPop: (t) => {
            t.length = 0;
        },
        onPush: (t) => {
            t.length = 0;
        }
    });
})(objectPool || (objectPool = {}));
export default objectPool;

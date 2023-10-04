import ObjectPoolType from "./ObjectPoolType.js";

const TYPE_OBJECT = `object`;

/**
 * 对象池
 */
class objectPool {
    
}

namespace objectPool {

    const SYMBOL = Symbol (`objectPool.SYMBOL`);

    /**
     * 提取对象池实例
     * @param type 
     * @returns 
     */
    export function pop <T> (type: ObjectPoolType <T>): T {
        let t: T;
        if (type._coll.length == 0) {
            t = type.instantiate ();
            t [SYMBOL] = type;
        }
        else {
            t = type._coll.pop ();
            type._set.delete (t);
        };
        if (type.onPop) {
            type.onPop (t);
        };
        return t;
    }

    /**
     * 存储对象池实例
     * @param listT 
     */
    export function push (...listT: Array <any>) {
        for (let i = 0; i < listT.length; i++) {
            let listTI = listT [i];
            doPush (listTI);
        };
    }

    /**
     * 执行回收
     * @param t 
     * @returns 
     */
    function doPush <T> (t: T) {
        // 空对象，忽略
        if (t == null) {
            return
        };
        // 非对象，忽略
        if (typeof t != TYPE_OBJECT) {
            return;
        };
        let type = t [SYMBOL] as ObjectPoolType <T>;
        // 非对象池生成出来的，忽略
        if (!type) {
            return
        };
        // 已经在对象池里面了
        if (type._set.has (t)) {
            return;
        };
        type._set.add (t);
        type._coll.push (t);
        if (type.onPush) {
            type.onPush (t);
        };
    }

    /**
     * 类型 - 列表
     */
    export const typeArray = new ObjectPoolType <Array<any>> ({
        instantiate: () => {
            return new Array<any>();
        },
        onPop: (t) => {
            t.length = 0;
        },
        onPush: (t) => {
            t.length = 0;
        }
    });
}

export default objectPool;
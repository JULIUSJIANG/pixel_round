import MgrDataItem from "./MgrDataItem.js";
import MgrDom from "./MgrDom.js";
import MgrSdk from "./MgrSdk.js";

/**
 * 数据管理
 */
class MgrData {
    /**
     * 真正的数据，存储在这里
     */
    private _data = {};

    /**
     * 初始化
     */
    init () {
        return Promise.resolve ()
            // 问 sdk 要存档
            .then (() => {
                return MgrSdk.inst.core.get ();
            })
            // 初始化当前记录
            .then ((ctx) => {
                // 对象形式的存档
                let dataObject: object;
                if (ctx.isSuccessed && ctx.txt != null) {
                    dataObject = JSON.parse (ctx.txt || `{}`);
                }
                else {
                    dataObject = {};
                };
                for (let i = 0; i < MgrDataItem.listItem.length; i++) {
                    let listItemI = MgrDataItem.listItem [i];
                    let storaged = dataObject [listItemI.key];
                    let val;
                    // 没有记录的话，取默认值
                    if (storaged == null) {
                        val = listItemI.defVal;
                    }
                    // 否则取记录值
                    else {
                        val = storaged;
                    };
                    this.set (listItemI, val);
                };
            });
    }

    /**
     * 存记录
     * @param item 
     * @param t 
     */
    set<T> (item: MgrDataItem <T>, t: T) {
        this._data [item.key] = t;
        this.callDataChange ();
    }

    /**
     * 取记录
     * @param item 
     * @returns 
     */
    get<T> (item: MgrDataItem <T>): T {
        return this._data [item.key];
    }

    /**
     * 正式存档
     * @returns 
     */
    save () {
        let txtData = JSON.stringify (this._data, null, 1);
        return MgrSdk.inst.core.set (txtData);
    }

    /**
     * 数据版本
     */
    dataVersion = 0;
    /**
     * 通知数据发生变化
     */
    callDataChange () {
        ++this.dataVersion;
    }
}

namespace MgrData {
    /**
     * 全局实例
     */
    export const inst = new MgrData ();
}

export default MgrData;
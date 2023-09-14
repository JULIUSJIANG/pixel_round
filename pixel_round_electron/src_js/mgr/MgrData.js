import MgrDataItem from "./MgrDataItem.js";
import MgrSdk from "./MgrSdk.js";
/**
 * 数据管理
 */
class MgrData {
    constructor() {
        /**
         * 真正的数据，存储在这里
         */
        this._data = {};
        /**
         * 数据版本
         */
        this.dataVersion = 0;
    }
    /**
     * 初始化
     */
    init() {
        return Promise.resolve()
            // 问 sdk 要存档
            .then(() => {
            return MgrSdk.inst.core.get();
        })
            // 初始化当前记录
            .then((ctx) => {
            // 对象形式的存档
            let dataObject;
            if (ctx.isSuccessed && ctx.txt != null) {
                dataObject = JSON.parse(ctx.txt || `{}`);
            }
            else {
                dataObject = {};
            }
            ;
            for (let i = 0; i < MgrDataItem.listItem.length; i++) {
                let listItemI = MgrDataItem.listItem[i];
                let storaged = dataObject[listItemI.key];
                let val;
                // 没有记录的话，取默认值
                if (storaged == null) {
                    val = listItemI.defVal;
                }
                // 否则取记录值
                else {
                    val = storaged;
                }
                ;
                this.set(listItemI, val);
            }
            ;
        });
    }
    /**
     * 存记录
     * @param item
     * @param t
     */
    set(item, t) {
        this._data[item.key] = t;
        this.callDataChange();
    }
    /**
     * 取记录
     * @param item
     * @returns
     */
    get(item) {
        return this._data[item.key];
    }
    /**
     * 正式存档
     * @returns
     */
    save() {
        return MgrSdk.inst.core.set(JSON.stringify(this._data, null, 1));
    }
    /**
     * 通知数据发生变化
     */
    callDataChange() {
        ++this.dataVersion;
    }
}
(function (MgrData) {
    /**
     * 全局实例
     */
    MgrData.inst = new MgrData();
})(MgrData || (MgrData = {}));
export default MgrData;

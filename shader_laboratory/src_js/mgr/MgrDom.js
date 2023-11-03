import DomRoot from "../DomRoot.js";
import NodeModules from "../NodeModules.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
/**
 * 渲染管理器
 */
class MgrDom {
    constructor() {
        /**
         * 版本
         */
        this.version = 0;
    }
    /**
     * 初始化
     * @returns
     */
    init() {
        this._root = NodeModules.reactDomClient.createRoot(document.getElementById('app'));
        return Promise.resolve();
    }
    /**
     * 刷新画面
     */
    refresh() {
        this.version++;
        // 正式渲染
        this._root.render(ReactComponentExtend.instantiateComponent(DomRoot, null));
    }
}
(function (MgrDom) {
    /**
     * 全局实例
     */
    MgrDom.inst = new MgrDom();
})(MgrDom || (MgrDom = {}));
;
export default MgrDom;

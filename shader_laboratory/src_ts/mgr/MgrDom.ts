import NodeModules from "../NodeModules.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import DomRoot from "../DomRoot.js";

/**
 * 渲染管理器
 */
class MgrDom {
    /**
     * 界面的根节点
     */
    private _root;

    /**
     * 初始化
     * @returns 
     */
    init () {
        this._root = NodeModules.reactDomClient.createRoot (document.getElementById('app'));
        return Promise.resolve ();
    }

    /**
     * 版本
     */
    version = 0;

    /**
     * 刷新画面
     */
    refresh () {
        this.version++;
        // 正式渲染
        this._root.render(
            ReactComponentExtend.instantiateComponent (DomRoot, null)
        );
    }
}

namespace MgrDom {
    /**
     * 全局实例
     */
    export const inst = new MgrDom ();
}

export default MgrDom;
import NodeModules from "../NodeModules.js";
import objectPool from "./ObjectPool.js";
const SYM_BOL = Symbol(`ReactComponentExtend`);
/**
 * react 组件的拓展
 */
class ReactComponentExtend extends NodeModules.react.Component {
    constructor(state, props) {
        super(state, props);
    }
    /**
     * 组件被挂载
     */
    componentDidMount() {
        this.reactComponentExtendOnInit();
        this.componentDidUpdate();
    }
    /**
     * 组件更新完成
     */
    componentDidUpdate() {
        this.reactComponentExtendOnDraw();
        // 没错！绘制完成以后就回收 props
        objectPool.push(this.props);
    }
    /**
     * 组件要被卸载
     */
    componentWillUnmount() {
        this.reactComponentExtendOnRelease();
    }
    /**
     * 事件派发 - 初始化
     */
    reactComponentExtendOnInit() {
    }
    /**
     * 事件派发 - 进行绘制
     */
    reactComponentExtendOnDraw() {
    }
    /**
     * 事件派发 - 释放
     */
    reactComponentExtendOnRelease() {
    }
}
(function (ReactComponentExtend) {
    /**
     * 构造标签实例
     * @param component
     * @param props
     * @param args
     * @returns
     */
    function instantiateTag(component, props, ...args) {
        return NodeModules.react.createElement(component, props, ...args);
    }
    ReactComponentExtend.instantiateTag = instantiateTag;
    /**
     * 实例化虚拟 dom
     * @param component
     * @param props
     * @param args
     * @returns
     */
    function instantiateComponent(component, props) {
        return NodeModules.react.createElement(component, props);
    }
    ReactComponentExtend.instantiateComponent = instantiateComponent;
})(ReactComponentExtend || (ReactComponentExtend = {}));
export default ReactComponentExtend;

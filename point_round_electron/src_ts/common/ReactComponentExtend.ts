import NodeModules from "../NodeModules.js";
import objectPool from "./ObjectPool.js";
import ReactComponentExtendInstance from "./ReactComponentExtendInstance.js";

const SYM_BOL = Symbol (`ReactComponentExtend`);

/**
 * react 组件的拓展
 */
abstract class ReactComponentExtend <T> extends NodeModules.react.Component {
    /**
     * 参数
     */
    props: T;

    constructor (state, props: T) {
        super (state, props);
    }

    /**
     * 组件被挂载
     */
    componentDidMount () {
        this.reactComponentExtendOnInit ();
        this.componentDidUpdate ();
    }

    /**
     * 组件更新完成
     */
    componentDidUpdate () {
        this.reactComponentExtendOnDraw ();
        // 没错！绘制完成以后就回收 props
        objectPool.push (this.props);
    }

    /**
     * 组件要被卸载
     */
    componentWillUnmount () {
        this.reactComponentExtendOnRelease ();
    }

    /**
     * 事件派发 - 初始化
     */
    reactComponentExtendOnInit () {

    }
    /**
     * 事件派发 - 进行绘制
     */
    reactComponentExtendOnDraw () {

    }
    /**
     * 事件派发 - 释放
     */
    reactComponentExtendOnRelease () {

    }

    /**
     * 生成虚拟节点
     */
    abstract render (): ReactComponentExtendInstance
}

namespace ReactComponentExtend {
    /**
     * 相当于 typeof ReactComponentExtend <T>
     */
    export type ReactComponentExtendType <T> = (new (state, t: T) => ReactComponentExtend <T>);

    /**
     * 构造标签实例
     * @param component 
     * @param props 
     * @param args 
     * @returns 
     */
    export function instantiateTag (component: string, props: any, ...args)
    {
        return NodeModules.react.createElement (component, props, ...args) as ReactComponentExtendInstance;
    }
    /**
     * 实例化虚拟 dom
     * @param component 
     * @param props 
     * @param args 
     * @returns 
     */
    export function instantiateComponent <AP, AT extends ReactComponentExtendType <AP>> (component: AT, props: AP)
    {
        return NodeModules.react.createElement (component, props) as ReactComponentExtendInstance;
    }
}

export default ReactComponentExtend;
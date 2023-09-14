import NodeModules from "../NodeModules.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
export default class DomLeftListItemAdd extends ReactComponentExtend {
    render() {
        let props = {
            onClick: () => {
            },
            style: {}
        };
        console.log(`this.props[${this.props}]`, this.props);
        if (this.props != 0) {
            props.style[MgrDomDefine.STYLE_MARGIN_TOP] = MgrDomDefine.CONFIG_TXT_SPACING;
        }
        ;
        return ReactComponentExtend.instantiateTag(NodeModules.antd.Button, props, `新增`);
    }
}

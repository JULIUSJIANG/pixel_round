import IndexGlobal from "../IndexGlobal.js";
import NodeModules from "../NodeModules.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
class DomLeftListAdd extends ReactComponentExtend {
    render() {
        let props = {
            onClick: () => {
                IndexGlobal.inst.detailMachine.currStatus.onCreate();
            },
            style: {}
        };
        if (IndexGlobal.inst.detailMachine.currStatus == IndexGlobal.inst.detailMachine.statusCreate) {
            props[MgrDomDefine.PROPS_TYPE] = MgrDomDefine.PROPS_TYPE_PRIMARY;
        }
        ;
        return ReactComponentExtend.instantiateTag(NodeModules.antd.Button, props, `创建`);
    }
}
export default DomLeftListAdd;
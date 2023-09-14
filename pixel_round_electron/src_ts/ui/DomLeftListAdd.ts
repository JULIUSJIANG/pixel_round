import IndexGlobal from "../IndexGlobal.js";
import NodeModules from "../NodeModules.js";
import ObjectPoolType from "../common/ObjectPoolType.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";

class DomLeftListAdd extends ReactComponentExtend <DomLeftListAdd.Args> {

    render (): ReactComponentExtendInstance {
        let props = {
            onClick: () => {
                IndexGlobal.inst.detailMachine.currStatus.onCreate ();
            },
            style: {

            }
        };
        if (IndexGlobal.inst.detailMachine.currStatus == IndexGlobal.inst.detailMachine.statusCreate) {
            props [MgrDomDefine.PROPS_TYPE] = MgrDomDefine.PROPS_TYPE_PRIMARY;
        };
        return ReactComponentExtend.instantiateTag (
            NodeModules.antd.Button,
            props,

            `创建`
        );
    }
}

namespace DomLeftListAdd {
    export class Args {
        init () {
        }

        static poolType = new ObjectPoolType <Args> ({
            instantiate: () => new Args,
            onPop: null,
            onPush: null
        });
    }
}

export default DomLeftListAdd;
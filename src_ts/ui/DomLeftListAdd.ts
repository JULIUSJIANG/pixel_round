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
                    
            },
            style: {
                
            }
        };
        if (this.props.idx != 0) {
            props.style [MgrDomDefine.STYLE_MARGIN_TOP] = MgrDomDefine.CONFIG_TXT_SPACING;
        };
        if (IndexGlobal.inst.machine.currStatus == IndexGlobal.inst.machine.statusCreate) {
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
        /**
         * 在列表中的索引
         */
        idx: number;

        init (idx: number) {
            this.idx = idx;
        }

        static poolType = new ObjectPoolType <Args> ({
            instantiate: () => new Args,
            onPop: null,
            onPush: null
        });
    }
}

export default DomLeftListAdd;
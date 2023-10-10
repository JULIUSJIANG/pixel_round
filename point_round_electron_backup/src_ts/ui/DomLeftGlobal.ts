import IndexGlobal from "../IndexGlobal.js";
import NodeModules from "../NodeModules.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";

const TEMP_COUNT = 4;

export default class DomLeftGlobal extends ReactComponentExtend <number> {

    render (): ReactComponentExtendInstance {
        let propsAdd = {
            onClick: () => {
                IndexGlobal.inst.detailMachine.currStatus.onCreate ();
            },
            style: {
                [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
            }
        };
        if (IndexGlobal.inst.detailMachine.currStatus == IndexGlobal.inst.detailMachine.statusCreate) {
            propsAdd [MgrDomDefine.PROPS_TYPE] = MgrDomDefine.PROPS_TYPE_PRIMARY;
        };
        return ReactComponentExtend.instantiateTag (
            MgrDomDefine.TAG_DIV,
            {
                style: {
                    [MgrDomDefine.STYLE_FLEX_GROW]: 0,

                    [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                    [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN,
                }
            },

            ReactComponentExtend.instantiateTag (
                NodeModules.antd.Button,
                propsAdd,
    
                `创建`
            )
        );
    }
}
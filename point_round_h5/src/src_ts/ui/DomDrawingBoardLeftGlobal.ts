import IndexGlobal from "../IndexGlobal";
import NodeModules from "../NodeModules";
import ReactComponentExtend from "../common/ReactComponentExtend";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance";
import MgrData from "../mgr/MgrData";
import MgrDomDefine from "../mgr/MgrDomDefine";

export default class DomDrawingBoardLeftGlobal extends ReactComponentExtend <number> {

    render (): ReactComponentExtendInstance {
        let propsAdd = {
            onClick: () => {
                let idGen = IndexGlobal.inst.dbCreate (IndexGlobal.DB_SIZE_NEW, IndexGlobal.DB_SIZE_NEW);
                IndexGlobal.inst.dbSelect (idGen);
                MgrData.inst.callDataChange ();
            },
            style: {
                [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
            }
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
    
                `添加`
            )
        );
    }
}
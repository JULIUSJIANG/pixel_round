import NodeModules from "../NodeModules.js";
import objectPool from "../common/ObjectPool.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import DomInputNumberHor from "./DomInputNumberHor.js";
import DomInputNumberVer from "./DomInputNumberVer.js";


export default class DomDrawingBoardRightCreate extends ReactComponentExtend <number> {

    render (): ReactComponentExtendInstance {
        let propsA = DomInputNumberHor.Args.create (
            `宽度`,
            50,
            (val) => {

            },
            1,
            100
        );
        let propsB = DomInputNumberHor.Args.create (
            `高度`,
            50,
            (val) => {

            },
            1,
            100
        );
        return ReactComponentExtend.instantiateTag (
            MgrDomDefine.TAG_DIV,
            {
                style: {
                    [MgrDomDefine.STYLE_WIDTH]: 0,
                    [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                    [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                    [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.CONFIG_TXT_BG_COLOR,

                    [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                    [MgrDomDefine.STYLE_ALIGN_ITEMS]: MgrDomDefine.STYLE_ALIGN_ITEMS_CENTER,
                    [MgrDomDefine.STYLE_JUSTIFY_CONTENT]: MgrDomDefine.STYLE_JUSTIFY_CONTENT_CENTER
                }
            },

            ReactComponentExtend.instantiateTag (
                MgrDomDefine.TAG_DIV,
                {
                    style: {
                        [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                        [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN,
                        [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                        [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.STYLE_BACKGROUND_COLOR_WHITE,

                        [MgrDomDefine.STYLE_WIDTH]: `200px`
                    }
                },

                ReactComponentExtend.instantiateComponent (DomInputNumberVer, propsA),
                ReactComponentExtend.instantiateComponent (DomInputNumberVer, propsB),
                ReactComponentExtend.instantiateTag (
                    NodeModules.antd.Button,
                    {
                        style: {
                            [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                        }
                    },

                    `确定`
                ),
            )
        );
    }
}
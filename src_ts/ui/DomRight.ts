import objectPool from "../common/ObjectPool.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import DomRightImg from "./DomRightImg.js";
import DomRightImgBefore from "./DomRightImgBefore.js";
import DomRIghtProps from "./DomRightProps.js";

export default class DomRight extends ReactComponentExtend <number> {

    render (): ReactComponentExtendInstance {
        return ReactComponentExtend.instantiateTag (
            MgrDomDefine.TAG_DIV,
            {
                style: {
                    [MgrDomDefine.STYLE_WIDTH]: MgrDomDefine.STYLE_WIDTH_PERCENTAGE_0,
                    [MgrDomDefine.STYLE_FLEX_GROW]: 1,

                    [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                    [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                    [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.CONFIG_TXT_BG_COLOR,

                    [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                    [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN,
                }
            },

            ReactComponentExtend.instantiateComponent (DomRightImg, objectPool.pop (DomRightImgBefore.Args.poolType)),
            ReactComponentExtend.instantiateComponent (DomRIghtProps, objectPool.pop (DomRightImgBefore.Args.poolType))
        )
    }
}
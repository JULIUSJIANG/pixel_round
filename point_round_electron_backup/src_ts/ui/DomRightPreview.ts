import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import DomRightPreviewImg from "./DomRightPreviewImg.js";
import DomRightPreviewPixelDataCache from "./DomRightPreviewPixelDataCache.js";
import DomRightPreviewProps from "./DomRightPreviewProps.js";

export default class DomRightPreview extends ReactComponentExtend <number> {

    render (): ReactComponentExtendInstance {
        return ReactComponentExtend.instantiateTag (
            MgrDomDefine.TAG_DIV,
            {
                style: {
                    [MgrDomDefine.STYLE_WIDTH]: MgrDomDefine.STYLE_WIDTH_PERCENTAGE_0,
                    [MgrDomDefine.STYLE_FLEX_GROW]: 1,

                    [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                    [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN,
                }
            },

            // 尽早缓存像素数据
            ReactComponentExtend.instantiateComponent (DomRightPreviewPixelDataCache, null),
            ReactComponentExtend.instantiateComponent (DomRightPreviewImg, null),
            ReactComponentExtend.instantiateComponent (DomRightPreviewProps, null)
        )
    }
}
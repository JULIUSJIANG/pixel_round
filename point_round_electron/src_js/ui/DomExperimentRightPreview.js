import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import DomExperimentRightPreviewImg from "./DomExperimentRightPreviewImg.js";
import DomExperimentRightPreviewPixelDataCache from "./DomExperimentRightPreviewPixelDataCache.js";
import DomExperimentRightPreviewProps from "./DomExperimentRightPreviewProps.js";
export default class DomExperimentRightPreview extends ReactComponentExtend {
    render() {
        return ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_WIDTH]: MgrDomDefine.STYLE_WIDTH_PERCENTAGE_0,
                [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN,
            }
        }, 
        // 尽早缓存像素数据
        ReactComponentExtend.instantiateComponent(DomExperimentRightPreviewPixelDataCache, null), ReactComponentExtend.instantiateComponent(DomExperimentRightPreviewImg, null), ReactComponentExtend.instantiateComponent(DomExperimentRightPreviewProps, null));
    }
}

import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import DomRightPreviewImgBefore from "./DomRightPreviewImgBefore.js";
import DomRightStep from "./DomRightStep.js";
export default class DomRightPreviewImg extends ReactComponentExtend {
    render() {
        return ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_HEIGHT]: MgrDomDefine.STYLE_HEIGHT_PERCENTAGE_0,
                [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW
            }
        }, ReactComponentExtend.instantiateComponent(DomRightPreviewImgBefore, null), ReactComponentExtend.instantiateComponent(DomRightStep, null));
    }
    ;
}

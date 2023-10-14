import IndexGlobal from "../IndexGlobal.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import DomExperimentRightPreviewImgBefore from "./DomExperimentRightPreviewImgBefore.js";
import DomImageSmooth from "./DomImageSmooth.js";
export default class DomExperimentRightPreviewImg extends ReactComponentExtend {
    render() {
        let dataSrc = IndexGlobal.mcExp().statusPreview;
        return ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_HEIGHT]: MgrDomDefine.STYLE_HEIGHT_PERCENTAGE_0,
                [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW
            }
        }, ReactComponentExtend.instantiateComponent(DomExperimentRightPreviewImgBefore, null), ReactComponentExtend.instantiateComponent(DomImageSmooth, dataSrc.argsSmooth));
    }
    ;
}

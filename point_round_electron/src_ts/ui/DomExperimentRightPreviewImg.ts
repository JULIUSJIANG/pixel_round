import IndexGlobal from "../IndexGlobal.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import DomExperimentRightPreviewImgBefore from "./DomExperimentRightPreviewImgBefore.js";
import DomImageSmooth from "./DomImageSmooth.js";
import ViewRelativeRateRS from "./ViewRelativeRateRS.js";

export default class DomExperimentRightPreviewImg extends ReactComponentExtend <number> {

    render (): ReactComponentExtendInstance {
        let dataSrc = IndexGlobal.mcExp ().detailStatusPreview;
        let relativeRS = ViewRelativeRateRS.mapIdToInst.get (MgrData.inst.get (MgrDataItem.VIEW_RELATIVE_RATE));
        let instLeft: ReactComponentExtendInstance;
        if (relativeRS.isLeftVisiable ()) {
            instLeft = ReactComponentExtend.instantiateComponent (DomExperimentRightPreviewImgBefore, null);
        };
        let instRight: ReactComponentExtendInstance;
        if (relativeRS.isRightVisiable ()) {
            instRight = ReactComponentExtend.instantiateComponent (DomImageSmooth, dataSrc.argsSmooth.clone ());
        };
        return ReactComponentExtend.instantiateTag (
            MgrDomDefine.TAG_DIV,
            {
                style: {
                    [MgrDomDefine.STYLE_HEIGHT]: MgrDomDefine.STYLE_HEIGHT_PERCENTAGE_0,
                    [MgrDomDefine.STYLE_FLEX_GROW]: 1,

                    [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                    [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW
                }
            },

            instLeft,
            instRight,
        )
    };
}
import ReactComponentExtend from "../common/ReactComponentExtend";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance";
import MgrDomDefine from "../mgr/MgrDomDefine";
import DomExperimentRightPreviewImg from "./DomExperimentRightPreviewImg";
import DomExperimentRightPreviewProps from "./DomExperimentRightPreviewProps";

export default class DomExperimentRightPreview extends ReactComponentExtend <number> {

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

            ReactComponentExtend.instantiateComponent (DomExperimentRightPreviewImg, null),
            ReactComponentExtend.instantiateComponent (DomExperimentRightPreviewProps, null)
        )
    }
}
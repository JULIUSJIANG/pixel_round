import IndexGlobal from "../IndexGlobal.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import DomExperimentLeftGlobal from "./DomExperimentLeftGlobal.js";
import DomExperimentLeftList from "./DomExperimentLeftList.js";

export default class DomExperimentLeft extends ReactComponentExtend <number> {

    render (): ReactComponentExtendInstance {
        const imgSize = IndexGlobal.IMG_MINI_SIZE + MgrDomDefine.CONFIG_NUMBER_SPACING * 2;
        const width = (MgrDomDefine.CONFIG_NUMBER_HALF_SPACING + MgrDomDefine.CONFIG_NUMBER_SPACING) * 2 + MgrDomDefine.CONFIG_NUMBER_SPACING * 3 + imgSize * IndexGlobal.IMG_LIST_COLUMN_COUNT + MgrDomDefine.CONFIG_NUMBER_SPACING * (IndexGlobal.IMG_LIST_COLUMN_COUNT - 1);
        return ReactComponentExtend.instantiateTag (
            MgrDomDefine.TAG_DIV,
            {
                style: {
                    [MgrDomDefine.STYLE_FLEX]: `${width}px`,
                    [MgrDomDefine.STYLE_FLEX_GROW]: 0,
                    [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                    [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                    [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.CONFIG_TXT_BG_COLOR,

                    [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                    [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN
                }
            },

            ReactComponentExtend.instantiateComponent (DomExperimentLeftList, null),
            ReactComponentExtend.instantiateComponent (DomExperimentLeftGlobal, null)
        )
    }
}
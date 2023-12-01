import IndexGlobal from "../IndexGlobal";
import ReactComponentExtend from "../common/ReactComponentExtend";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance";
import MgrData from "../mgr/MgrData";
import MgrDataItem from "../mgr/MgrDataItem";
import MgrDomDefine from "../mgr/MgrDomDefine";
import DomDrawingBoardLeftGlobal from "./DomDrawingBoardLeftGlobal";
import DomDrawingBoardLeftList from "./DomDrawingBoardLeftList";
import FileColumnRS from "./FileColumnRS";

export default class DomDrawingBoardLeft extends ReactComponentExtend <number> {

    render (): ReactComponentExtendInstance {
        let rsCurrent = IndexGlobal.fileColumnRS ();
        const imgSize = IndexGlobal.IMG_MINI_SIZE + MgrDomDefine.CONFIG_NUMBER_SPACING * 2;
        const width = (MgrDomDefine.CONFIG_NUMBER_HALF_SPACING + MgrDomDefine.CONFIG_NUMBER_SPACING) * 2 + MgrDomDefine.CONFIG_NUMBER_SPACING * 3 + imgSize * rsCurrent.count + MgrDomDefine.CONFIG_NUMBER_SPACING * (rsCurrent.count - 1);
        return ReactComponentExtend.instantiateTag (
            MgrDomDefine.TAG_DIV,
            {
                style: {
                    [MgrDomDefine.STYLE_WIDTH]: `${width}px`,
                    [MgrDomDefine.STYLE_FLEX_GROW]: 0,
                    [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                    [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                    [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.CONFIG_TXT_BG_COLOR,

                    [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                    [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN
                }
            },

            ReactComponentExtend.instantiateComponent (DomDrawingBoardLeftList, null),
            ReactComponentExtend.instantiateComponent (DomDrawingBoardLeftGlobal, null)
        );
    }
}
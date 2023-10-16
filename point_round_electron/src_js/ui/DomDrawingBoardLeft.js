import IndexGlobal from "../IndexGlobal.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import DomDrawingBoardLeftGlobal from "./DomDrawingBoardLeftGlobal.js";
import DomDrawingBoardLeftList from "./DomDrawingBoardLeftList.js";
export default class DomDrawingBoardLeft extends ReactComponentExtend {
    render() {
        let rsCurrent = IndexGlobal.fileColumnRS();
        const imgSize = IndexGlobal.IMG_MINI_SIZE + MgrDomDefine.CONFIG_NUMBER_SPACING * 2;
        const width = (MgrDomDefine.CONFIG_NUMBER_HALF_SPACING + MgrDomDefine.CONFIG_NUMBER_SPACING) * 2 + MgrDomDefine.CONFIG_NUMBER_SPACING * 3 + imgSize * rsCurrent.count + MgrDomDefine.CONFIG_NUMBER_SPACING * (rsCurrent.count - 1);
        return ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_WIDTH]: `${width}px`,
                [MgrDomDefine.STYLE_FLEX_GROW]: 0,
                [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.CONFIG_TXT_BG_COLOR,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN
            }
        }, ReactComponentExtend.instantiateComponent(DomDrawingBoardLeftList, null), ReactComponentExtend.instantiateComponent(DomDrawingBoardLeftGlobal, null));
    }
}

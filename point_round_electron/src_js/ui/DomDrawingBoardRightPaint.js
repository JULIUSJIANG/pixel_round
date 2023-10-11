import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import DomDrawingBoardRightPaintCanvas from "./DomDrawingBoardRightPaintCanvas.js";
import DomDrawingBoardRightPaintProps from "./DomDrawingBoardRightPaintProps.js";
export default class DomDrawingBoardRightPaint extends ReactComponentExtend {
    render() {
        return ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_WIDTH]: MgrDomDefine.STYLE_WIDTH_PERCENTAGE_0,
                [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN,
            }
        }, ReactComponentExtend.instantiateComponent(DomDrawingBoardRightPaintCanvas, null), ReactComponentExtend.instantiateComponent(DomDrawingBoardRightPaintProps, null));
    }
}

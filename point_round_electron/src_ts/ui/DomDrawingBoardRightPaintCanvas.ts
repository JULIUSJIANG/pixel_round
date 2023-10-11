import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import DomDrawingBoardRightPaintCanvasSource from "./DomDrawingBoardRightPaintCanvasSource.js";

export default class DomDrawingBoardRightPaintCanvas extends ReactComponentExtend <number> {

    render (): ReactComponentExtendInstance {
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

            ReactComponentExtend.instantiateComponent (DomDrawingBoardRightPaintCanvasSource, null),
            ReactComponentExtend.instantiateComponent (DomDrawingBoardRightPaintCanvasSource, null)
        )
    };
}
import IndexGlobal from "../IndexGlobal.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import DomDrawingBoardRightPaintCanvasSource from "./DomDrawingBoardRightPaintCanvasSource.js";
import DomImageSmooth from "./DomImageSmooth.js";
import DomImageSmoothRS from "./DomImageSmoothRS.js";

export default class DomDrawingBoardRightPaintCanvas extends ReactComponentExtend <number> {

    render (): ReactComponentExtendInstance {
        let img: HTMLImageElement;
        let dataSrc = IndexGlobal.inst.mcRoot.statusDrawingBoard.getCurrentCache ();
        if (dataSrc.initCurrStatus == dataSrc.initStatusFinished) {
            img = dataSrc.imgLoaded;
        };
        let domImageSmoothArgs = DomImageSmooth.Args.create (
            DomImageSmoothRS.db,
            img,

            dataSrc.dbImgData.width,
            dataSrc.dbImgData.height,

            0, 0, 0, 0,

            1, 1
        );
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

            ReactComponentExtend.instantiateTag (
                MgrDomDefine.TAG_DIV,
                {
                    style: {
                        [MgrDomDefine.STYLE_WIDTH]: MgrDomDefine.STYLE_HEIGHT_PERCENTAGE_0,
                        [MgrDomDefine.STYLE_FLEX_GROW]: 1,

                        [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                        [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN
                    }
                },

                ReactComponentExtend.instantiateComponent (DomDrawingBoardRightPaintCanvasSource, null),
            ),
            ReactComponentExtend.instantiateTag (
                MgrDomDefine.TAG_DIV,
                {
                    style: {
                        [MgrDomDefine.STYLE_WIDTH]: MgrDomDefine.STYLE_HEIGHT_PERCENTAGE_0,
                        [MgrDomDefine.STYLE_FLEX_GROW]: 1,

                        [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                        [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN
                    }
                },

                ReactComponentExtend.instantiateComponent (DomImageSmooth, domImageSmoothArgs),
            ),
        )
    };
}
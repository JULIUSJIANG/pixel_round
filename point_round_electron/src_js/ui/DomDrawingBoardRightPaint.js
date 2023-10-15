import IndexGlobal from "../IndexGlobal.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import DomDrawingBoardRightPaintCanvas from "./DomDrawingBoardRightPaintCanvas.js";
import DomDrawingBoardRightPaintProps from "./DomDrawingBoardRightPaintProps.js";
import DomImageSmooth from "./DomImageSmooth.js";
import ViewRelativeRateRS from "./ViewRelativeRateRS.js";
export default class DomDrawingBoardRightPaint extends ReactComponentExtend {
    render() {
        let img;
        let dataSrc = IndexGlobal.inst.mcRoot.statusDrawingBoard.getCurrentCache();
        if (dataSrc.initCurrStatus == dataSrc.initStatusFinished) {
            img = dataSrc.imgLoaded;
        }
        ;
        let domImageSmoothArgs = DomImageSmooth.Args.create(img, dataSrc.dbImgData.width, dataSrc.dbImgData.height, 0, 0, 0, 0, 1, 1);
        let relativeRS = ViewRelativeRateRS.mapIdToInst.get(MgrData.inst.get(MgrDataItem.VIEW_RELATIVE_RATE));
        let instLeft;
        if (relativeRS.isLeftVisiable()) {
            instLeft = ReactComponentExtend.instantiateComponent(DomDrawingBoardRightPaintCanvas, null);
        }
        ;
        let instRight;
        if (relativeRS.isRightVisiable()) {
            instRight = ReactComponentExtend.instantiateComponent(DomImageSmooth, domImageSmoothArgs);
        }
        ;
        return ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_WIDTH]: MgrDomDefine.STYLE_WIDTH_PERCENTAGE_0,
                [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN,
            }
        }, ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_HEIGHT]: MgrDomDefine.STYLE_HEIGHT_PERCENTAGE_0,
                [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW
            }
        }, instLeft, instRight), ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_FLEX_GROW]: 0,
                [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                [MgrDomDefine.STYLE_HEIGHT]: MgrDomDefine.CONFIG_TXT_SPACING,
                [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.CONFIG_TXT_BG_COLOR,
            }
        }), ReactComponentExtend.instantiateComponent(DomDrawingBoardRightPaintProps, null));
    }
}

import IndexGlobal from "../IndexGlobal.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import DomDrawingBoardRightPaintCanvas from "./DomDrawingBoardRightPaintCanvas.js";
import DomDrawingBoardRightPaintProps from "./DomDrawingBoardRightPaintProps.js";
import DomImageSmooth from "./DomImageSmooth.js";
import ViewRelativeRateRS from "./ViewRelativeRateRS.js";

export default class DomDrawingBoardRightPaint extends ReactComponentExtend <number> {

    render (): ReactComponentExtendInstance {
        let relativeRS = ViewRelativeRateRS.mapIdToInst.get (MgrData.inst.get (MgrDataItem.VIEW_RELATIVE_RATE));
        let dataSrc = IndexGlobal.inst.dbCurrent ();

        let instLeft: ReactComponentExtendInstance;
        if (relativeRS.isLeftVisiable () && dataSrc.uint8CurrStatus == dataSrc.uint8StatusLoaded) {
            instLeft = ReactComponentExtend.instantiateComponent (DomDrawingBoardRightPaintCanvas, null);
        };

        let instRight: ReactComponentExtendInstance;
        if (relativeRS.isRightVisiable () && dataSrc.uint8CurrStatus == dataSrc.uint8StatusLoaded) {
            instRight = ReactComponentExtend.instantiateComponent (DomImageSmooth, DomImageSmooth.Args.create (
                dataSrc.statusCurrent ().dataBin.bin,
    
                dataSrc.statusCurrent ().width,
                dataSrc.statusCurrent ().height,
    
                0, 0, 0, 0,
    
                1, 1
            ));
        };
        
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

            ReactComponentExtend.instantiateTag (
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
            ),
            
            ReactComponentExtend.instantiateTag (
                MgrDomDefine.TAG_DIV,
                {
                    style: {
                        [MgrDomDefine.STYLE_FLEX_GROW]: 0,
                        [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                        [MgrDomDefine.STYLE_HEIGHT]: MgrDomDefine.CONFIG_TXT_SPACING,
                        [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.CONFIG_TXT_BG_COLOR,
                    }
                }
            ),
            ReactComponentExtend.instantiateComponent (DomDrawingBoardRightPaintProps, null),
        )
    }
}
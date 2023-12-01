import IndexGlobal from "../IndexGlobal";
import ReactComponentExtend from "../common/ReactComponentExtend";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance";
import MgrData from "../mgr/MgrData";
import MgrDataItem from "../mgr/MgrDataItem";
import MgrDomDefine from "../mgr/MgrDomDefine";
import DomDrawingBoardRightPaintCanvas from "./DomDrawingBoardRightPaintCanvas";
import DomDrawingBoardRightPaintProps from "./DomDrawingBoardRightPaintProps";
import DomImageSmooth from "./DomImageSmooth";
import ViewRelativeRateRS from "./ViewRelativeRateRS";

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
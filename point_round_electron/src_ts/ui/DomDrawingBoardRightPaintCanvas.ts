import IndexGlobal from "../IndexGlobal.js";
import NodeModules from "../NodeModules.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import DomDrawingBoardRightPaintCanvasSource from "./DomDrawingBoardRightPaintCanvasSource.js";
import DomImageSmooth from "./DomImageSmooth.js";
import DomImageSmoothRS from "./DomImageSmoothRS.js";
import DomInputNumberApplicationHor from "./DomInputNumberApplicationHor.js";

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

                // 控制栏
                ReactComponentExtend.instantiateTag (
                    MgrDomDefine.TAG_DIV,
                    {
                        style: {
                            [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                            [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW
                        }
                    },

                    ReactComponentExtend.instantiateTag (
                        MgrDomDefine.TAG_DIV,
                        {
                            style: {
                                [MgrDomDefine.STYLE_FLEX_GROW]: 0,
    
                                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW,
                            }
                        },
    
                        ReactComponentExtend.instantiateComponent (
                            DomInputNumberApplicationHor,
                            DomInputNumberApplicationHor.Args.create (
                                `像素尺寸 1 : ${MgrData.inst.get (MgrDataItem.DB_PIXEL_TO_SCREEN_APPLICATION)}`,
                                MgrData.inst.get (MgrDataItem.DB_PIXEL_TO_SCREEN_TEMP),
                                null,
                                null,
                                (val) => {
                                    MgrData.inst.set (MgrDataItem.DB_PIXEL_TO_SCREEN_TEMP, val);
                                },
                                () => {
                                    if (MgrData.inst.get (MgrDataItem.DB_PIXEL_TO_SCREEN_TEMP) < IndexGlobal.DB_PIXEL_TO_SCREEN_MIN || IndexGlobal.DB_PIXEL_TO_SCREEN_MAX < MgrData.inst.get (MgrDataItem.DB_PIXEL_TO_SCREEN_TEMP)) {
                                        NodeModules.antd.message.error(`比值范围为 ${IndexGlobal.DB_PIXEL_TO_SCREEN_MIN} - ${IndexGlobal.DB_PIXEL_TO_SCREEN_MAX}，当前为 ${MgrData.inst.get (MgrDataItem.DB_PIXEL_TO_SCREEN_TEMP)}`);
                                        return;
                                    };
                                    MgrData.inst.set (MgrDataItem.DB_PIXEL_TO_SCREEN_APPLICATION, MgrData.inst.get (MgrDataItem.DB_PIXEL_TO_SCREEN_TEMP));
                                    console.log (`比值改为[${MgrData.inst.get (MgrDataItem.DB_PIXEL_TO_SCREEN_APPLICATION)}]`);
                                }
                            ),
                        ),
                    ),

                    ReactComponentExtend.instantiateTag (
                        MgrDomDefine.TAG_DIV,
                        {
                            style: {
                                [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                                [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_NUMBER_HALF_SPACING,
                                [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_NUMBER_HALF_SPACING,
                                [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.CONFIG_TXT_BG_COLOR,

                                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW,
                            }
                        },
                        ReactComponentExtend.instantiateTag (
                            MgrDomDefine.TAG_DIV,
                            {
                                style: {
                                    [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                                    [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW,
                                }
                            },

                            ReactComponentExtend.instantiateTag (
                                NodeModules.antd.Button,
                                {
                                    style: {
                                        [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                                    },
                                    onClick: () => {
        
                                    }
                                },
                
                                `显示网格`
                            ),
                        ),
                        ReactComponentExtend.instantiateTag (
                            NodeModules.antd.Button,
                            {
                                style: {
                                    [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                                },
                                onClick: () => {
    
                                }
                            },
            
                            `导出 png`
                        ),
                    ),
                ),
            ),
            
            ReactComponentExtend.instantiateComponent (DomImageSmooth, domImageSmoothArgs),
        )
    };
}
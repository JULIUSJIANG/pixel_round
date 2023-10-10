import IndexGlobal from "../IndexGlobal.js";
import NodeModules from "../NodeModules.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import MgrSdk from "../mgr/MgrSdk.js";
import DomExperimentLeft from "./DomExperimentLeft.js";

/**
 * 根
 */
export default class DomRoot extends ReactComponentExtend <number> {

    render () {
        let propsBtnAuto = {
            onClick: () => {
                MgrData.inst.set (MgrDataItem.AUTO_DEBUG_TOOLS, !MgrData.inst.get (MgrDataItem.AUTO_DEBUG_TOOLS));
                MgrData.inst.callDataChange ();
            },  
            style: {
                [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
            }
        };
        if (MgrData.inst.get (MgrDataItem.AUTO_DEBUG_TOOLS)) {
            propsBtnAuto [MgrDomDefine.PROPS_TYPE] = MgrDomDefine.PROPS_TYPE_PRIMARY;
        };
        // 根容器
        return ReactComponentExtend.instantiateTag (
            MgrDomDefine.TAG_DIV,
            {
                style: {
                    [MgrDomDefine.STYLE_WIDTH]: MgrDomDefine.STYLE_WIDTH_PERCENTAGE_100,
                    [MgrDomDefine.STYLE_HEIGHT]: MgrDomDefine.STYLE_HEIGHT_PERCENTAGE_100,

                    [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                    [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW
                }
            },

            // 根外边距
            ReactComponentExtend.instantiateTag (
                MgrDomDefine.TAG_DIV,
                {
                    style: {
                        [MgrDomDefine.STYLE_WIDTH]: MgrDomDefine.STYLE_WIDTH_PERCENTAGE_0,
                        [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                        [MgrDomDefine.STYLE_FLEX_GROW]: 1,

                        [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                        [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN
                    }
                },

                // 总控制
                ReactComponentExtend.instantiateTag (
                    MgrDomDefine.TAG_DIV,
                    {
                        style: {
                            [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.CONFIG_TXT_BG_COLOR,
                            [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                            [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,

                            [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                            [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW
                        }
                    },

                    // 模式开关
                    ReactComponentExtend.instantiateTag (
                        NodeModules.antd.Radio.Group,
                        {
                            style: {
                                [MgrDomDefine.STYLE_WIDTH]: 0,
                                [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                                [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,

                                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW
                            }
                        },
            
                        ReactComponentExtend.instantiateTag (
                            NodeModules.antd.Radio.Button,
                            {
                                style: {
                                    [MgrDomDefine.STYLE_WIDTH]: 0,
                                    [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                                    [MgrDomDefine.STYLE_TEXT_ALIGN]: MgrDomDefine.STYLE_TEXT_ALIGN_RIGHT,
                                }
                            },
                
                            `画板模式`
                        ),
                        ReactComponentExtend.instantiateTag (
                            NodeModules.antd.Radio.Button,
                            {
                                style: {
                                    [MgrDomDefine.STYLE_WIDTH]: 0,
                                    [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                                    [MgrDomDefine.STYLE_TEXT_ALIGN]: MgrDomDefine.STYLE_TEXT_ALIGN_LEFT,
                                }
                            },
                
                            `实验模式`
                        )
                    ),

                    ReactComponentExtend.instantiateTag (
                        NodeModules.antd.Button,
                        {
                            onClick: () => {
                                MgrSdk.inst.core.openDebugTools ();
                            },
                            style: {
                                [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                            }
                        },
            
                        `打开控制台`
                    ),

                    ReactComponentExtend.instantiateTag (
                        NodeModules.antd.Button,
                        propsBtnAuto,
            
                        `启动时自动打开控制台`
                    ),
                ),
                // 模式容器
                ReactComponentExtend.instantiateTag (
                    MgrDomDefine.TAG_DIV,
                    {
                        style: {
                            [MgrDomDefine.STYLE_HEIGHT]: MgrDomDefine.STYLE_WIDTH_PERCENTAGE_0,
                            [MgrDomDefine.STYLE_FLEX_GROW]: 1,
    
                            [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                            [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW
                        }
                    },

                    ReactComponentExtend.instantiateComponent (DomExperimentLeft, null),
                    IndexGlobal.inst.detailMachine.currStatus.onRender ()
                ),
            )
        );
    }
}
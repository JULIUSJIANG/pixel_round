import IndexGlobal from "../IndexGlobal.js";
import NodeModules from "../NodeModules.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import MgrSdk from "../mgr/MgrSdk.js";

/**
 * 根
 */
export default class DomRoot extends ReactComponentExtend <number> {

    listChildren = new Array <ReactComponentExtendInstance> ();

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

        this.listChildren.length = 0;
        for (let i = 0; i < IndexGlobal.inst.mcRoot.listStatus.length; i++) {
            let listStatusI = IndexGlobal.inst.mcRoot.listStatus [i];
            let props = {
                onClick: () => {
                    if (listStatusI == IndexGlobal.inst.mcRoot.currStatus) {
                        return;
                    };
                    IndexGlobal.inst.mcRoot.enter (listStatusI);
                    MgrData.inst.callDataChange ();
                },
                style: {
                    [MgrDomDefine.STYLE_WIDTH]: 0,
                    [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                    [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                }
            };
            if (listStatusI == IndexGlobal.inst.mcRoot.currStatus) {
                props [MgrDomDefine.PROPS_TYPE] = MgrDomDefine.PROPS_TYPE_PRIMARY;
            };
            this.listChildren.push (ReactComponentExtend.instantiateTag (
                NodeModules.antd.Button,
                props,
    
                listStatusI.name,
            ));
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
                        MgrDomDefine.TAG_DIV,
                        {
                            style: {
                                [MgrDomDefine.STYLE_WIDTH]: 0,
                                [MgrDomDefine.STYLE_FLEX_GROW]: 1,

                                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW
                            },
                        },
            
                        ...this.listChildren,
                    ),

                    // 分割线
                    ReactComponentExtend.instantiateTag (
                        MgrDomDefine.TAG_DIV,
                        {
                            style: {
                                [MgrDomDefine.STYLE_WIDTH]: MgrDomDefine.CONFIG_TXT_SPACING,
                                [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                                [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.STYLE_COLOR_WHITE,
                            }
                        }
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
                IndexGlobal.inst.mcRoot.currStatus.onDisplay (),
            )
        );
    }
}
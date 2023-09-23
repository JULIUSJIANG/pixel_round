import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import DomRightSmooth2BlockStep2Reduce from "./DomRightSmooth2BlockStep2Reduce.js";
import DomRightSmooth2BlockStep3Smooth from "./DomRightSmooth2BlockStep3Smooth.js";
import DomRightSmooth2BlockStep1Split from "./DomRightSmooth2BlockStep1Split.js";
import DomRightSmooth2BlockStep4Merge from "./DomRightSmooth2BlockStep4Merge.js";

/**
 * 基于核心平滑方案的改进版本
 * 优点:    
 *      1. 所有连贯的边缘像素都能得到平滑
 * 
 * 缺点:
 *      1. 部分平滑效果很机械化，没有灵魂
 */
class DomRightSmooth2Block extends ReactComponentExtend <number> {
    render (): ReactComponentExtendInstance {
        return ReactComponentExtend.instantiateTag (
            MgrDomDefine.TAG_DIV,
            {
                style: {
                    [MgrDomDefine.STYLE_HEIGHT]: MgrDomDefine.STYLE_HEIGHT_PERCENTAGE_0,
                    [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                    [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                    [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                    [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.CONFIG_TXT_BG_COLOR,

                    [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                    [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN
                }
            },

            // 滚动视图的遮罩
            ReactComponentExtend.instantiateTag (
                MgrDomDefine.TAG_DIV,
                {
                    style: {
                        [MgrDomDefine.STYLE_HEIGHT]: MgrDomDefine.STYLE_HEIGHT_PERCENTAGE_0,
                        [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                        [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                        [MgrDomDefine.STYLE_PADDING_RIGHT]: MgrDomDefine.CONFIG_TXT_SPACING,
                        [MgrDomDefine.STYLE_PADDING_BOTTOM]: MgrDomDefine.CONFIG_TXT_SPACING,

                        [MgrDomDefine.STYLE_OVERFLOW_X]: MgrDomDefine.STYLE_OVERFLOW_X_SCROLL,
                        [MgrDomDefine.STYLE_OVERFLOW_Y]: MgrDomDefine.STYLE_OVERFLOW_Y_SCROLL
                    }
                },

                ReactComponentExtend.instantiateTag (
                    MgrDomDefine.TAG_DIV,
                    {
                        style: {
                            [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                            [MgrDomDefine.STYLE_WIDTH]: MgrDomDefine.STYLE_WIDTH_FIT_CONTENT
                        }
                    },

                    ReactComponentExtend.instantiateComponent (DomRightSmooth2BlockStep1Split, null),
                    ReactComponentExtend.instantiateComponent (DomRightSmooth2BlockStep2Reduce, null),
                    ReactComponentExtend.instantiateComponent (DomRightSmooth2BlockStep3Smooth, null),
                    ReactComponentExtend.instantiateComponent (DomRightSmooth2BlockStep4Merge, null),
                    // ReactComponentExtend.instantiateComponent (DomRightSmooth2BlockStep5Result, null),
                )
            ),
        );
    }
}

export default DomRightSmooth2Block;
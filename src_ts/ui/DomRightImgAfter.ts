import NodeModules from "../NodeModules.js";
import ObjectPoolType from "../common/ObjectPoolType.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";

const CANVAS_SIZE = 300;

const CANVAS_PADDING = 50;

const RATIO = 2;

class DomRightImgAfter extends ReactComponentExtend <DomRightImgAfter.Args> {
    /**
     * 3d canvas 引用器
     */
    canvasWebglRef = NodeModules.react.createRef ();
    /**
     * 2d canvas 上下文
     */
    canvas2dRef = NodeModules.react.createRef ();

    render (): ReactComponentExtendInstance {
        return ReactComponentExtend.instantiateTag (
            MgrDomDefine.TAG_DIV,
            {
                style: {
                    [MgrDomDefine.STYLE_WIDTH]: MgrDomDefine.STYLE_WIDTH_PERCENTAGE_0,
                    [MgrDomDefine.STYLE_FLEX_GROW]: 1,

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

                        [MgrDomDefine.STYLE_OVERFLOW_X]: MgrDomDefine.STYLE_OVERFLOW_X_SCROLL,
                        [MgrDomDefine.STYLE_OVERFLOW_Y]: MgrDomDefine.STYLE_OVERFLOW_Y_SCROLL
                    }
                },

                // 滚动的列表
                ReactComponentExtend.instantiateTag (
                    MgrDomDefine.TAG_DIV,
                    {
                        style: {
                            [MgrDomDefine.STYLE_WIDTH]: `${CANVAS_SIZE + CANVAS_PADDING * 2}px`,
                            [MgrDomDefine.STYLE_HEIGHT]: `${CANVAS_SIZE + CANVAS_PADDING * 2}px`,
                            [MgrDomDefine.STYLE_FLEX_GROW]: 0,
                            [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.STYLE_BACKGROUND_COLOR_BLACK
                        }
                    },
        
                    ReactComponentExtend.instantiateTag (
                        MgrDomDefine.TAG_DIV,
                        {
                            style: {
                                [MgrDomDefine.STYLE_WIDTH]: 0,
                                [MgrDomDefine.STYLE_HEIGHT]: 0,
                                [MgrDomDefine.STYLE_POSITION]: MgrDomDefine.STYLE_POSITION_RELATIVE,
                                [MgrDomDefine.STYLE_LEFT]: CANVAS_PADDING,
                                [MgrDomDefine.STYLE_TOP]: CANVAS_PADDING,
                            }
                        },
        
                        ReactComponentExtend.instantiateTag (
                            MgrDomDefine.TAG_CANVAS,
                            {
                                ref: this.canvasWebglRef,
                                width: CANVAS_SIZE * RATIO,
                                height: CANVAS_SIZE * RATIO,
                                style: {
                                    [MgrDomDefine.STYLE_WIDTH]: `${CANVAS_SIZE}px`,
                                    [MgrDomDefine.STYLE_HEIGHT]: `${CANVAS_SIZE}px`,
                                    [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_BLOCK
                                }
                            }
                        )
                    ),
        
                    ReactComponentExtend.instantiateTag (
                        MgrDomDefine.TAG_DIV,
                        {
                            style: {
                                [MgrDomDefine.STYLE_WIDTH]: 0,
                                [MgrDomDefine.STYLE_HEIGHT]: 0,
                                [MgrDomDefine.STYLE_POSITION]: MgrDomDefine.STYLE_POSITION_RELATIVE,
                                [MgrDomDefine.STYLE_LEFT]: 0,
                                [MgrDomDefine.STYLE_TOP]: 0,
                            }
                        },
        
                        ReactComponentExtend.instantiateTag (
                            MgrDomDefine.TAG_CANVAS,
                            {
                                ref: this.canvas2dRef,
                                width: (CANVAS_SIZE + CANVAS_PADDING * 2) * RATIO,
                                height: (CANVAS_SIZE + CANVAS_PADDING * 2) * RATIO,
                                style: {
                                    [MgrDomDefine.STYLE_WIDTH]: `${CANVAS_SIZE + CANVAS_PADDING * 2}px`,
                                    [MgrDomDefine.STYLE_HEIGHT]: `${CANVAS_SIZE + CANVAS_PADDING * 2}px`,
                                    [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_BLOCK
                                }
                            }
                        )
                    )
                )
            )
        );
    }
}

namespace DomRightImgAfter {
    export class Args {

        static poolType = new ObjectPoolType <Args> ({
            instantiate: () => new Args,
            onPop: null,
            onPush: null
        });
    }
}

export default DomRightImgAfter;
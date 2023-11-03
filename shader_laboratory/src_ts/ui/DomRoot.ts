import IndexGlobal from "../IndexGlobal.js";
import NodeModules from "../NodeModules.js";
import JWebgl from "../common/JWebgl.js";
import JWebglColor from "../common/JWebglColor.js";
import JWebglMathMatrix4 from "../common/JWebglMathMatrix4.js";
import JWebglMathVector4 from "../common/JWebglMathVector4.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";

const PIXEL_TO_SCREEN = 16;

/**
 * 宽
 */
const WIDTH = 49;
/**
 * 高
 */
const HEIGHT = 49;

/**
 * 根
 */
export default class DomRoot extends ReactComponentExtend <number> {
    /**
     * 3d canvas 引用器
     */
    canvasWebglRef = NodeModules.react.createRef();

    jWebgl: JWebgl;

    mat4M: JWebglMathMatrix4 = new JWebglMathMatrix4();

    mat4V: JWebglMathMatrix4 = new JWebglMathMatrix4();

    mat4P: JWebglMathMatrix4 = new JWebglMathMatrix4();

    posFrom = new JWebglMathVector4 ();

    posTo = new JWebglMathVector4 ();

    reactComponentExtendOnInit(): void {
        this.jWebgl = new JWebgl(this.canvasWebglRef.current);
        this.jWebgl.init();
        this.mat4M.setIdentity();
        this.mat4V.setLookAt(
            0, 0, 1,
            0, 0, 0,
            0, 1, 0
        );
    }

    reactComponentExtendOnDraw(): void {
        // 清除画面
        this.jWebgl.clear ();

        this.mat4P.setOrtho (
            -WIDTH / 2, WIDTH / 2,
            -HEIGHT / 2, HEIGHT / 2,
            0, 2
        );
        JWebglMathMatrix4.multiplayMat4List (
            this.mat4P,
            this.mat4V,
            this.mat4M,
            this.jWebgl.mat4Mvp
        );

        this.jWebgl.programRound.uMvp.fill (this.jWebgl.mat4Mvp);
        this.jWebgl.programRound.uPixelCount.fill (WIDTH);
        this.jWebgl.programRound.add (
            JWebglMathVector4.centerO,
            JWebglMathVector4.axisZStart,
            JWebglMathVector4.axisYEnd,
            WIDTH,
            HEIGHT
        );
        this.jWebgl.programRound.draw ();

        this.posFrom.elements [2] = 0.1;
        this.posTo.elements [2] = 0.1;
        this.jWebgl.programLine.uMvp.fill (this.jWebgl.mat4Mvp);
        for (let i = 0; i <= WIDTH; i++) {
            this.posFrom.elements [0] = i - WIDTH / 2;
            this.posFrom.elements [1] = - HEIGHT / 2;
            this.posTo.elements [0] = i - WIDTH / 2;
            this.posTo.elements [1] = HEIGHT / 2;
            this.jWebgl.programLine.add (
                this.posFrom,
                JWebglColor.COLOR_BLACK,
                this.posTo,
                JWebglColor.COLOR_BLACK
            );
        };
        this.jWebgl.programLine.draw ();

        for (let i = 0; i <= HEIGHT; i++) {
            this.posFrom.elements [0] = - WIDTH / 2;
            this.posFrom.elements [1] = i - HEIGHT / 2;
            this.posTo.elements [0] = WIDTH / 2;
            this.posTo.elements [1] = i - HEIGHT / 2;
            this.jWebgl.programLine.add (
                this.posFrom,
                JWebglColor.COLOR_BLACK,
                this.posTo,
                JWebglColor.COLOR_BLACK
            );
        };
        this.jWebgl.programLine.draw ();
    }

    render () {
        
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
                        [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW
                    }
                },

                ReactComponentExtend.instantiateTag(
                    MgrDomDefine.TAG_DIV,
                    {
                        style: {
                            [MgrDomDefine.STYLE_WIDTH]: MgrDomDefine.STYLE_WIDTH_PERCENTAGE_0,
                            [MgrDomDefine.STYLE_FLEX_GROW]: 1,
        
                            [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                            [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                            [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.CONFIG_TXT_BG_COLOR,
        
                            [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                            [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN,
                        }
                    },
        
                    ReactComponentExtend.instantiateTag(
                        MgrDomDefine.TAG_DIV,
                        {
                            style: {
                                [MgrDomDefine.STYLE_HEIGHT]: MgrDomDefine.STYLE_WIDTH_PERCENTAGE_0,
                                [MgrDomDefine.STYLE_FLEX_GROW]: 1,
        
                                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN
                            }
                        },
        
                        // 滚动视图的遮罩
                        ReactComponentExtend.instantiateTag(
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
                            ReactComponentExtend.instantiateTag(
                                MgrDomDefine.TAG_DIV,
                                {
                                    style: {
                                        [MgrDomDefine.STYLE_WIDTH]: `${WIDTH * PIXEL_TO_SCREEN}px`,
                                        [MgrDomDefine.STYLE_HEIGHT]: `${HEIGHT * PIXEL_TO_SCREEN}px`,
                                        [MgrDomDefine.STYLE_FLEX_GROW]: 0,
                                    }
                                },
        
                                ReactComponentExtend.instantiateTag(
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
        
                                    ReactComponentExtend.instantiateTag(
                                        MgrDomDefine.TAG_CANVAS,
                                        {
                                            ref: this.canvasWebglRef,
                                            width: WIDTH * PIXEL_TO_SCREEN,
                                            height: HEIGHT * PIXEL_TO_SCREEN,
                                            style: {
                                                [MgrDomDefine.STYLE_WIDTH]: `${WIDTH * PIXEL_TO_SCREEN}px`,
                                                [MgrDomDefine.STYLE_HEIGHT]: `${HEIGHT * PIXEL_TO_SCREEN}px`,
                                                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_BLOCK
                                            }
                                        }
                                    )
                                )
                            )
                        )
                    )
                )
            )
        );
    }
}
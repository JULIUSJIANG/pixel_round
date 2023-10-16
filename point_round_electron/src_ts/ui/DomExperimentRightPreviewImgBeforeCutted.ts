import IndexGlobal from "../IndexGlobal.js";
import NodeModules from "../NodeModules.js";
import JWebgl from "../common/JWebgl.js";
import JWebglColor from "../common/JWebglColor.js";
import JWebglFrameBuffer from "../common/JWebglFrameBuffer.js";
import JWebglMathVector4 from "../common/JWebglMathVector4.js";
import JWebglTexture from "../common/JWebglTexture.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import DomImageSmooth from "./DomImageSmooth.js";

const Z_GRID = 0.1;

class DomExperimentRightPreviewImgBeforeCutted extends ReactComponentExtend <number> {
    /**
     * 3d canvas 引用器
     */
    canvasWebglRef = NodeModules.react.createRef();

    /**
     * 用于绘制的上下文
     */
    jWebgl: JWebgl;

    /**
     * 帧缓冲区
     */
    fbo: JWebglFrameBuffer;

    /**
     * 源图纹理
     */
    texSrc: JWebglTexture;

    /**
     * 2d canvas 引用器
     */
    canvas2dRef = NodeModules.react.createRef ();
    /**
     * 2d canvas 标签
     */
    canvas2d: HTMLCanvasElement;
    /**
     * 2d canvas 上下文
     */
    canvas2dCtx: CanvasRenderingContext2D;

    reactComponentExtendOnInit(): void {
        this.jWebgl = new JWebgl(this.canvasWebglRef.current);
        this.jWebgl.init();
        this.texSrc = this.jWebgl.createTexture ();
        this.canvas2d = this.canvas2dRef.current;
        this.canvas2dCtx = this.canvas2d.getContext (`2d`);
    }

    reactComponentExtendOnRelease (): void {
        this.jWebgl.release ();
    }

    /**
     * 点的起始位置
     */
    posFrom = new JWebglMathVector4 (0, 0, Z_GRID);
    /**
     * 点的结束位置
     */
    posTo = new JWebglMathVector4 (0, 0, Z_GRID);

    reactComponentExtendOnDraw(): void {
        let currImg = IndexGlobal.inst.expCurrent ();
        let argsSmooth = currImg.uint8ArgsSmooth;

        // 初始化 fbo
        if (this.fbo == null || this.fbo.width != argsSmooth.cacheTexWidth || this.fbo.height != argsSmooth.cacheTexHeight) {
            this.fbo = this.jWebgl.getFbo (argsSmooth.cacheTexWidth, argsSmooth.cacheTexHeight);
        };
        // 得到简略图
        DomImageSmooth.Args.drawImgPadding (argsSmooth, this.jWebgl, this.fbo, this.texSrc);
        // 把 fbo 绘制到屏幕
        this.jWebgl.fillFboByFbo (null, this.fbo);

        // 网格
        this.jWebgl.mat4V.setLookAt(
            argsSmooth.cacheTexWidth / 2, argsSmooth.cacheTexHeight / 2, 1,
            argsSmooth.cacheTexWidth / 2, argsSmooth.cacheTexHeight / 2, 0,
            0, 1, 0
        );
        this.jWebgl.mat4P.setOrtho (
            - argsSmooth.cacheTexWidth / 2, argsSmooth.cacheTexWidth / 2,
            - argsSmooth.cacheTexHeight / 2, argsSmooth.cacheTexHeight / 2,
            0, 2
        );
        this.jWebgl.refreshMat4Mvp ();
        this.jWebgl.programLine.uMvp.fill (this.jWebgl.mat4Mvp);
        let colorGrid = JWebglColor.COLOR_BLACK;
        for (let i = 0; i <= argsSmooth.cacheTexWidth; i++) {
            this.posFrom.elements [0] = i;
            this.posFrom.elements [1] = 0;
            this.posTo.elements [0] = i;
            this.posTo.elements [1] = argsSmooth.cacheTexHeight;
            this.jWebgl.programLine.add (
                this.posFrom,
                colorGrid,
                this.posTo,
                colorGrid
            );
        };
        for (let i = 0; i <= argsSmooth.cacheTexHeight; i++) {
            this.posFrom.elements [0] = 0;
            this.posFrom.elements [1] = i;
            this.posTo.elements [0] = argsSmooth.cacheTexWidth;
            this.posTo.elements [1] = i;
            this.jWebgl.programLine.add (
                this.posFrom,
                colorGrid,
                this.posTo,
                colorGrid
            );
        };
        this.jWebgl.programLine.draw ();

        this.canvas2dCtx.clearRect (0, 0, this.canvas2d.width, this.canvas2d.height);
        this.canvas2dCtx.font = `10px Microsoft YaHei`;
        this.canvas2dCtx.textAlign = "center";
        this.canvas2dCtx.textBaseline = `middle`;
        for (let x = 0; x < argsSmooth.cacheTexWidth; x++) {
            for (let y = 0; y < argsSmooth.cacheTexHeight; y++) {
                let colorId = currImg.cMiniBinColor.bin [y * argsSmooth.cacheTexWidth + x];
                let colorInst = currImg.cMapIdToColorRecord.get (colorId);
                if (colorInst == null) {
                    continue;
                };
                this.canvas2dCtx.fillStyle = colorInst.colorRel.str2dText;
                this.canvas2dCtx.fillText (`${colorInst.idx}`, (x + 0.5) * IndexGlobal.PIXEL_TEX_TO_SCREEN, ((argsSmooth.cacheTexHeight - y) - 0.5) * IndexGlobal.PIXEL_TEX_TO_SCREEN);
            };
        };
    }

    render (): ReactComponentExtendInstance {
        let currImg = IndexGlobal.inst.expCurrent ();
        let argsSmooth = currImg.uint8ArgsSmooth;
        return ReactComponentExtend.instantiateTag (
            MgrDomDefine.TAG_DIV,
            {
                style: {
                    [MgrDomDefine.STYLE_HEIGHT]: MgrDomDefine.STYLE_WIDTH_PERCENTAGE_0,
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

                // 滚动的列表
                ReactComponentExtend.instantiateTag (
                    MgrDomDefine.TAG_DIV,
                    {
                        style: {
                            [MgrDomDefine.STYLE_WIDTH]: `${argsSmooth.cacheTexWidth * IndexGlobal.PIXEL_TEX_TO_SCREEN}px`,
                            [MgrDomDefine.STYLE_HEIGHT]: `${argsSmooth.cacheTexHeight * IndexGlobal.PIXEL_TEX_TO_SCREEN}px`,
                            [MgrDomDefine.STYLE_FLEX_GROW]: 0,
                        }
                    },
                
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
                                ref: this.canvasWebglRef,
                                width: argsSmooth.cacheTexWidth * IndexGlobal.PIXEL_TEX_TO_SCREEN * IndexGlobal.ANTINA,
                                height: argsSmooth.cacheTexHeight * IndexGlobal.PIXEL_TEX_TO_SCREEN * IndexGlobal.ANTINA,
                                style: {
                                    [MgrDomDefine.STYLE_WIDTH]: `${argsSmooth.cacheTexWidth * IndexGlobal.PIXEL_TEX_TO_SCREEN}px`,
                                    [MgrDomDefine.STYLE_HEIGHT]: `${argsSmooth.cacheTexHeight * IndexGlobal.PIXEL_TEX_TO_SCREEN}px`,
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
                                width: argsSmooth.cacheTexWidth * IndexGlobal.PIXEL_TEX_TO_SCREEN,
                                height: argsSmooth.cacheTexHeight * IndexGlobal.PIXEL_TEX_TO_SCREEN,
                                style: {
                                    [MgrDomDefine.STYLE_WIDTH]: `${argsSmooth.cacheTexWidth * IndexGlobal.PIXEL_TEX_TO_SCREEN}px`,
                                    [MgrDomDefine.STYLE_HEIGHT]: `${argsSmooth.cacheTexHeight * IndexGlobal.PIXEL_TEX_TO_SCREEN}px`,
                                    [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_BLOCK
                                }
                            }
                        )
                    )
                )
            ),
        );
    }
}

export default DomExperimentRightPreviewImgBeforeCutted;
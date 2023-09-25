import IndexGlobal from "../IndexGlobal.js";
import NodeModules from "../NodeModules.js";
import JWebgl from "../common/JWebgl.js";
import JWebglColor from "../common/JWebglColor.js";
import JWebglFrameBuffer from "../common/JWebglFrameBuffer.js";
import JWebglMathMatrix4 from "../common/JWebglMathMatrix4.js";
import JWebglMathVector4 from "../common/JWebglMathVector4.js";
import ObjectPoolType from "../common/ObjectPoolType.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import MgrRes from "../mgr/MgrRes.js";
import MgrResAssetsImage from "../mgr/MgrResAssetsImage.js";
import DomRightPreviewImgBefore from "./DomRightPreviewImgBefore.js";

const Z_GRID = 0.1;

class DomRightPreviewImgBeforeWebglCutted extends ReactComponentExtend <number> {
    /**
     * 3d canvas 引用器
     */
    canvasWebglRef = NodeModules.react.createRef();

    /**
     * 用于绘制的上下文
     */
    jWebgl: JWebgl;

    fbo: JWebglFrameBuffer;

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
        this.mat4M.setIdentity();

        this.canvas2d = this.canvas2dRef.current;
        this.canvas2dCtx = this.canvas2d.getContext (`2d`);
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
        let dataSrc = IndexGlobal.inst.detailMachine.statusPreview;
        let imgMachine = dataSrc.imgMachine;
        // 没加载完毕，不对画布进行改动
        if (imgMachine == null || imgMachine.currStatus == imgMachine.statusIdle) {
            return;
        };

        // 初始化 fbo
        if (this.fbo == null || this.fbo.width != dataSrc.imgWidthPaddingScaled || this.fbo.height != dataSrc.imgHeightPaddingScaled) {
            this.fbo = this.jWebgl.getFbo (dataSrc.imgWidthPaddingScaled, dataSrc.imgHeightPaddingScaled);
        };
        // 得到简略图
        dataSrc.drawImgPadding (this.jWebgl, this.fbo);
        // 把 fbo 绘制到屏幕
        this.jWebgl.fillFbo (null, this.fbo);

        // 网格
        this.jWebgl.programLine.uMvp.fill (this.jWebgl.mat4Mvp);
        let colorGrid = JWebglColor.COLOR_BLACK;
        for (let i = 0; i <= dataSrc.imgWidthPaddingScaled; i++) {
            this.posFrom.elements [0] = i;
            this.posFrom.elements [1] = 0;
            this.posTo.elements [0] = i;
            this.posTo.elements [1] = dataSrc.imgHeightPaddingScaled;
            this.jWebgl.programLine.add (
                this.posFrom,
                colorGrid,
                this.posTo,
                colorGrid
            );
        };
        for (let i = 0; i <= dataSrc.imgHeightPaddingScaled; i++) {
            this.posFrom.elements [0] = 0;
            this.posFrom.elements [1] = i;
            this.posTo.elements [0] = dataSrc.imgWidthPaddingScaled;
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
        for (let x = 0; x < dataSrc.imgWidthPaddingScaled; x++) {
            for (let y = 0; y < dataSrc.imgHeightPaddingScaled; y++) {
                let colorId = dataSrc.binXYToColor [y * dataSrc.imgWidthPaddingScaled + x];
                let colorInst = dataSrc.mapIdToColor.get (colorId);
                if (colorInst == null) {
                    continue;
                };
                this.canvas2dCtx.fillStyle = colorInst.colorRel.str2dText;
                this.canvas2dCtx.fillText (`${colorInst.idx}`, (x + 0.5) * IndexGlobal.PIXEL_TEX_TO_SCREEN, ((dataSrc.imgHeightPaddingScaled - y) - 0.5) * IndexGlobal.PIXEL_TEX_TO_SCREEN);
            };
        };
    }

    render (): ReactComponentExtendInstance {
        let dataSrc = IndexGlobal.inst.detailMachine.statusPreview;
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
                            [MgrDomDefine.STYLE_WIDTH]: `${dataSrc.imgWidthPaddingScaled * IndexGlobal.PIXEL_TEX_TO_SCREEN}px`,
                            [MgrDomDefine.STYLE_HEIGHT]: `${dataSrc.imgHeightPaddingScaled * IndexGlobal.PIXEL_TEX_TO_SCREEN}px`,
                            [MgrDomDefine.STYLE_FLEX_GROW]: 0,
                            [MgrDomDefine.STYLE_DISPLAY]: this.finishedImg == null ? MgrDomDefine.STYLE_DISPLAY_NONE : MgrDomDefine.STYLE_DISPLAY_BLOCK
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
                                width: dataSrc.imgWidthPaddingScaled * IndexGlobal.PIXEL_TEX_TO_SCREEN * IndexGlobal.ANTINA,
                                height: dataSrc.imgHeightPaddingScaled * IndexGlobal.PIXEL_TEX_TO_SCREEN * IndexGlobal.ANTINA,
                                style: {
                                    [MgrDomDefine.STYLE_WIDTH]: `${dataSrc.imgWidthPaddingScaled * IndexGlobal.PIXEL_TEX_TO_SCREEN}px`,
                                    [MgrDomDefine.STYLE_HEIGHT]: `${dataSrc.imgHeightPaddingScaled * IndexGlobal.PIXEL_TEX_TO_SCREEN}px`,
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
                                width: dataSrc.imgWidthPaddingScaled * IndexGlobal.PIXEL_TEX_TO_SCREEN,
                                height: dataSrc.imgHeightPaddingScaled * IndexGlobal.PIXEL_TEX_TO_SCREEN,
                                style: {
                                    [MgrDomDefine.STYLE_WIDTH]: `${dataSrc.imgWidthPaddingScaled * IndexGlobal.PIXEL_TEX_TO_SCREEN}px`,
                                    [MgrDomDefine.STYLE_HEIGHT]: `${dataSrc.imgHeightPaddingScaled * IndexGlobal.PIXEL_TEX_TO_SCREEN}px`,
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

export default DomRightPreviewImgBeforeWebglCutted;
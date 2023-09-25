import IndexGlobal from "../IndexGlobal.js";
import NodeModules from "../NodeModules.js";
import JWebgl from "../common/JWebgl.js";
import JWebglColor from "../common/JWebglColor.js";
import JWebglEnum from "../common/JWebglEnum.js";
import JWebglFrameBuffer from "../common/JWebglFrameBuffer.js";
import JWebglMathMatrix4 from "../common/JWebglMathMatrix4.js";
import JWebglMathVector4 from "../common/JWebglMathVector4.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import MgrRes from "../mgr/MgrRes.js";
import MgrResAssetsImage from "../mgr/MgrResAssetsImage.js";

/**
 * 线的深度
 */
const Z_GRID = 0.1;

/**
 * 尝试更为灵魂的平滑
 */
class DomRightSmoothCanvas extends ReactComponentExtend <number> {

    /**
     * 3d canvas 引用器
     */
    canvasWebglRef = NodeModules.react.createRef();
    /**
     * 绘制用的辅助类
     */
    jWebgl: JWebgl;

    reactComponentExtendOnInit (): void {
        this.jWebgl = new JWebgl (this.canvasWebglRef.current);
        this.jWebgl.init ();
    }

    /**
     * 缓存了图片信息的帧缓冲区
     */
    fboImg: JWebglFrameBuffer;

    /**
     * 缓存了平滑信息的帧缓冲区
     */
    fboCorner: JWebglFrameBuffer;

    initFbo (width: number, height: number) {
        if (this.fboImg == null || this.fboImg.width != width || this.fboImg.height != height) {
            this.fboImg = this.jWebgl.getFbo (width, height);
            this.fboCorner = this.jWebgl.getFbo (width, height);
        };
    }

    /**
     * 图片位置
     */
    posImg = new JWebglMathVector4 ();

    /**
     * 线的起始位置
     */
    posFrom = new JWebglMathVector4 (0, 0, Z_GRID);
    /**
     * 线的结束位置
     */
    posTo = new JWebglMathVector4 (0, 0, Z_GRID);

    reactComponentExtendOnDraw (): void {
        let dataSrc = IndexGlobal.inst.detailMachine.statusPreview;
        let imgMachine = dataSrc.imgMachine;
        // 只有加载完毕等待缓存的时候才进行下述的缓存内容
        if (imgMachine == null || imgMachine.currStatus != imgMachine.statusLoaded) {
            return;
        };

        // 绘制 fbo
        if (this.fbo == null || this.fbo.width != dataSrc.imgWidthPaddingScaled || this.fbo.height != dataSrc.imgHeightPaddingScaled) {
            this.fbo = this.jWebgl.getFbo (dataSrc.imgWidthPaddingScaled, dataSrc.imgHeightPaddingScaled);
        };
        
        // 得到简略图
        dataSrc.drawImgPadding (this.jWebgl, this.fbo);

        // 使用标记信息生成纹理
        this.jWebgl.useFbo (this.fboCorner);
        this.jWebgl.clear ();
        this.jWebgl.mat4V.setLookAt (
            dataSrc.imgWidthPaddingScaled / 2, dataSrc.imgHeightPaddingScaled / 2, 1,
            dataSrc.imgWidthPaddingScaled / 2, dataSrc.imgHeightPaddingScaled / 2, 0,
            0, 1, 0
        );
        this.jWebgl.mat4P.setOrtho (
            - dataSrc.imgWidthPaddingScaled / 2, dataSrc.imgWidthPaddingScaled / 2,
            - dataSrc.imgHeightPaddingScaled / 2, dataSrc.imgHeightPaddingScaled / 2,
             0, 2
        );
        JWebglMathMatrix4.multiplayMat4List (
            this.jWebgl.mat4P,
            this.jWebgl.mat4V,
            this.jWebgl.mat4M,
            this.jWebgl.mat4Mvp
        );
        this.jWebgl.programSmooth3Step1Mark.uMvp.fill (this.jWebgl.mat4Mvp);
        // 绘制点有数量限制，这里让程序每一定数量的点绘制一次
        let pointCount = 0;
        this.jWebgl.canvasWebglCtx.blendFunc (JWebglEnum.BlendFunc.ONE, JWebglEnum.BlendFunc.ZERO);
        for (let x = 0; x < dataSrc.imgWidthPaddingScaled; x++) {
            for (let y = 0; y < dataSrc.imgHeightPaddingScaled; y++) {
                let idx = y * dataSrc.imgWidthPaddingScaled + x;
                let pixel = IndexGlobal.inst.detailMachine.statusPreview.listXYToTexturePixel [idx];
                this.jWebgl.programSmooth3Step1Mark.add (
                    x + 1,
                    y + 1,
                    0,
                    pixel.cornerLT.rsBoth.id,
                    pixel.cornerRT.rsBoth.id,
                    pixel.cornerRB.rsBoth.id,
                    pixel.cornerLB.rsBoth.id
                );
                pointCount ++;
                if (10 < pointCount) {
                    this.jWebgl.programSmooth3Step1Mark.draw ();
                };
            };
        };
        this.jWebgl.programSmooth3Step1Mark.draw ();
        this.jWebgl.canvasWebglCtx.blendFunc (JWebglEnum.BlendFunc.SRC_ALPHA, JWebglEnum.BlendFunc.ONE_MINUS_SRC_ALPHA);

        // 绘制最终内容
        let cameraWidth = dataSrc.imgWidthPaddingScaled;
        let cameraHeight = dataSrc.imgHeightPaddingScaled;
        this.jWebgl.useFbo (null);
        this.jWebgl.clear ();
        this.jWebgl.mat4V.setLookAt (
            cameraWidth / 2, cameraHeight / 2, 1,
            cameraWidth / 2, cameraHeight / 2, 0,
            0, 1, 0
        );
        this.jWebgl.mat4P.setOrtho (
            - cameraWidth / 2, cameraWidth / 2,
            - cameraHeight / 2, cameraHeight / 2,
            0, 2
        );
        this.jWebgl.refreshMat4Mvp ();
        this.jWebgl.programSmooth3Step2Smooth.uMvp.fill (this.jWebgl.mat4Mvp);
        this.jWebgl.programSmooth3Step2Smooth.uTextureMain.fillByFbo (this.fboImg);
        this.jWebgl.programSmooth3Step2Smooth.uTextureMark.fillByFbo (this.fboCorner);
        this.jWebgl.programSmooth3Step2Smooth.uTextureSize.fill (dataSrc.imgWidthPaddingScaled, dataSrc.imgHeightPaddingScaled);
        this.posImg.elements [0] = dataSrc.imgWidthPaddingScaled / 2;
        this.posImg.elements [1] = dataSrc.imgHeightPaddingScaled / 2;
        this.jWebgl.programSmooth3Step2Smooth.add (
            this.posImg,
            JWebglMathVector4.axisZStart,
            JWebglMathVector4.axisYEnd,
            dataSrc.imgWidthPaddingScaled,
            dataSrc.imgHeightPaddingScaled
        );
        this.jWebgl.programSmooth3Step2Smooth.draw ();

        // 网格
        let colorGrid = JWebglColor.COLOR_BLACK;
        this.jWebgl.programLine.uMvp.fill (this.jWebgl.mat4Mvp);
        for (let i = 0; i <= cameraWidth; i++) {
            this.posFrom.elements [0] = i;
            this.posFrom.elements [1] = 0;
            this.posTo.elements [0] = i;
            this.posTo.elements [1] = cameraHeight;
            this.jWebgl.programLine.add (
                this.posFrom,
                colorGrid,
                this.posTo,
                colorGrid
            );
        };
        for (let i = 0; i <= cameraHeight; i++) {
            this.posFrom.elements [0] = 0;
            this.posFrom.elements [1] = i;
            this.posTo.elements [0] = cameraWidth;
            this.posTo.elements [1] = i;
            this.jWebgl.programLine.add (
                this.posFrom,
                colorGrid,
                this.posTo,
                colorGrid
            );
        };
        this.jWebgl.programLine.draw ();
    }

    render (): ReactComponentExtendInstance {
        let dataSrc = IndexGlobal.inst.detailMachine.statusPreview;
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
                    )
                )
            ),
        );
    }
}

export default DomRightSmoothCanvas;
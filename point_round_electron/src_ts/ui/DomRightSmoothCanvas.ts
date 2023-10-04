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
import MgrDomDefine from "../mgr/MgrDomDefine.js";

const HORIZON_COUNT = 3;

const VERTICAL_COUNT = 2;

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
     * 缓存了平滑方式的帧缓冲区
     */
    fboCorner: JWebglFrameBuffer;
    /**
     * 缓存了平滑取色的帧缓冲区
     */
    fboColor: JWebglFrameBuffer;

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
        if (imgMachine.currStatus == imgMachine.statusIdle) {
            return;
        };
        // 绘制 fbo
        if (this.fboImg == null || this.fboImg.width != dataSrc.imgWidthPaddingScaled || this.fboImg.height != dataSrc.imgHeightPaddingScaled) {
            this.fboImg = this.jWebgl.getFbo (dataSrc.imgWidthPaddingScaled, dataSrc.imgHeightPaddingScaled);
            this.fboCorner = this.jWebgl.getFbo (dataSrc.imgWidthPaddingScaled, dataSrc.imgHeightPaddingScaled);
            this.fboColor = this.jWebgl.getFbo (dataSrc.imgWidthPaddingScaled, dataSrc.imgHeightPaddingScaled);
        };
        
        // 得到简略图
        dataSrc.drawImgPadding (this.jWebgl, this.fboImg);
        this.jWebgl.fillFbo (null, this.fboImg);

        // 清除一遍画布
        this.jWebgl.useFbo (null);
        this.jWebgl.clear ();

        // 绘制图片
        dataSrc.step1CornerBase ();
        this.drawImg (0, 0);
        dataSrc.step2FixX ();
        this.drawImg (1, 0);
        dataSrc.step3Point ();
        this.drawImg (2, 0);
        
        dataSrc.step4Rect ();
        this.drawImg (0, 1);
        dataSrc.step5Addition ();
        this.drawImg (1, 1);
        dataSrc.step6ColorSetting ();
        this.drawImg (2, 1);

        // 网格
        let cameraWidth = dataSrc.imgWidthPaddingScaled * HORIZON_COUNT;
        let cameraHeight = dataSrc.imgHeightPaddingScaled * VERTICAL_COUNT;
        this.jWebgl.mat4V.setLookAt(
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
        this.jWebgl.programLine.uMvp.fill (this.jWebgl.mat4Mvp);
        let colorGrid = JWebglColor.COLOR_BLACK;
        let count = 0;
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
            count ++;
            if (count < 10) {
                count = 0;
                this.jWebgl.programLine.draw ();
            };
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
            count ++;
            if (count < 10) {
                count = 0;
                this.jWebgl.programLine.draw ();
            };
        };
        this.jWebgl.programLine.draw ();
    }

    /**
     * 绘制图片
     * @param x 
     * @param y 
     */
    drawImg (x: number, y: number) {
        let dataSrc = IndexGlobal.inst.detailMachine.statusPreview;
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

        // 使用标记信息生成纹理
        this.jWebgl.useFbo (this.fboCorner);
        this.jWebgl.clear ();
        this.jWebgl.programSmoothStep1Mark.uMvp.fill (this.jWebgl.mat4Mvp);
        // 绘制点有数量限制，这里让程序每一定数量的点绘制一次
        let pointCount = 0;
        this.jWebgl.canvasWebglCtx.blendFunc (JWebglEnum.BlendFunc.ONE, JWebglEnum.BlendFunc.ZERO);
        for (let x = 0; x < dataSrc.imgWidthPaddingScaled; x++) {
            for (let y = 0; y < dataSrc.imgHeightPaddingScaled; y++) {
                let idx = y * dataSrc.imgWidthPaddingScaled + x;
                let pixel = IndexGlobal.inst.detailMachine.statusPreview.listXYToTexturePixel [idx];
                this.jWebgl.programSmoothStep1Mark.add (
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
                    pointCount = 0;
                    this.jWebgl.programSmoothStep1Mark.draw ();
                };
            };
        };
        this.jWebgl.programSmoothStep1Mark.draw ();
        this.jWebgl.canvasWebglCtx.blendFunc (JWebglEnum.BlendFunc.SRC_ALPHA, JWebglEnum.BlendFunc.ONE_MINUS_SRC_ALPHA);

        // 使用采样信息生成纹理
        this.jWebgl.useFbo (this.fboColor);
        this.jWebgl.clear ();
        this.jWebgl.programSmoothStep1Mark.uMvp.fill (this.jWebgl.mat4Mvp);
        pointCount = 0;
        this.jWebgl.canvasWebglCtx.blendFunc (JWebglEnum.BlendFunc.ONE, JWebglEnum.BlendFunc.ZERO);
        for (let x = 0; x < dataSrc.imgWidthPaddingScaled; x++) {
            for (let y = 0; y < dataSrc.imgHeightPaddingScaled; y++) {
                let idx = y * dataSrc.imgWidthPaddingScaled + x;
                let pixel = IndexGlobal.inst.detailMachine.statusPreview.listXYToTexturePixel [idx];
                this.jWebgl.programSmoothStep1Mark.add (
                    x + 1,
                    y + 1,
                    0,
                    pixel.cornerLT.color,
                    pixel.cornerRT.color,
                    pixel.cornerRB.color,
                    pixel.cornerLB.color
                );
                pointCount ++;
                if (10 < pointCount) {
                    pointCount = 0;
                    this.jWebgl.programSmoothStep1Mark.draw ();
                };
            };
        };
        this.jWebgl.programSmoothStep1Mark.draw ();
        this.jWebgl.canvasWebglCtx.blendFunc (JWebglEnum.BlendFunc.SRC_ALPHA, JWebglEnum.BlendFunc.ONE_MINUS_SRC_ALPHA);

        // 绘制最终内容
        let cameraWidth = dataSrc.imgWidthPaddingScaled * HORIZON_COUNT;
        let cameraHeight = dataSrc.imgHeightPaddingScaled * VERTICAL_COUNT;
        this.jWebgl.useFbo (null);
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
        this.jWebgl.programSmoothStep2Smooth.uMvp.fill (this.jWebgl.mat4Mvp);
        this.jWebgl.programSmoothStep2Smooth.uTextureMain.fillByFbo (this.fboImg);
        this.jWebgl.programSmoothStep2Smooth.uTextureMark.fillByFbo (this.fboCorner);
        this.jWebgl.programSmoothStep2Smooth.uTextureColor.fillByFbo (this.fboColor);
        this.jWebgl.programSmoothStep2Smooth.uTextureSize.fill (dataSrc.imgWidthPaddingScaled, dataSrc.imgHeightPaddingScaled);
        this.posImg.elements [0] = dataSrc.imgWidthPaddingScaled * (0.5 + x);
        this.posImg.elements [1] = dataSrc.imgHeightPaddingScaled * (VERTICAL_COUNT - 1 + 0.5 - y);
        this.jWebgl.programSmoothStep2Smooth.add (
            this.posImg,
            JWebglMathVector4.axisZStart,
            JWebglMathVector4.axisYEnd,
            dataSrc.imgWidthPaddingScaled,
            dataSrc.imgHeightPaddingScaled
        );
        this.jWebgl.programSmoothStep2Smooth.draw ();
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
                            [MgrDomDefine.STYLE_WIDTH]: `${dataSrc.imgWidthPaddingScaled * IndexGlobal.PIXEL_TEX_TO_SCREEN * HORIZON_COUNT}px`,
                            [MgrDomDefine.STYLE_HEIGHT]: `${dataSrc.imgHeightPaddingScaled * IndexGlobal.PIXEL_TEX_TO_SCREEN * VERTICAL_COUNT}px`,
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
                                width: dataSrc.imgWidthPaddingScaled * IndexGlobal.PIXEL_TEX_TO_SCREEN * HORIZON_COUNT * IndexGlobal.ANTINA,
                                height: dataSrc.imgHeightPaddingScaled * IndexGlobal.PIXEL_TEX_TO_SCREEN * VERTICAL_COUNT * IndexGlobal.ANTINA,
                                style: {
                                    [MgrDomDefine.STYLE_WIDTH]: `${dataSrc.imgWidthPaddingScaled * IndexGlobal.PIXEL_TEX_TO_SCREEN * HORIZON_COUNT}px`,
                                    [MgrDomDefine.STYLE_HEIGHT]: `${dataSrc.imgHeightPaddingScaled * IndexGlobal.PIXEL_TEX_TO_SCREEN * VERTICAL_COUNT}px`,
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
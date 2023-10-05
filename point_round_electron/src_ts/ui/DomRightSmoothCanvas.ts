import IndexGlobal from "../IndexGlobal.js";
import NodeModules from "../NodeModules.js";
import JWebgl from "../common/JWebgl.js";
import JWebglColor from "../common/JWebglColor.js";
import JWebglEnum from "../common/JWebglEnum.js";
import JWebglFrameBuffer from "../common/JWebglFrameBuffer.js";
import JWebglMathMatrix4 from "../common/JWebglMathMatrix4.js";
import JWebglMathVector4 from "../common/JWebglMathVector4.js";
import objectPool from "../common/ObjectPool.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";

const HORIZON_COUNT = 3;

const VERTICAL_COUNT = 3;

/**
 * 线的深度
 */
const Z_GRID = 0.1;

/**
 * 尝试更为灵魂的平滑
 */
class DomRightSmoothCanvas extends ReactComponentExtend <number> {
    /**
     * 模型
     */
    mat4M = new JWebglMathMatrix4 ();
    /**
     * 视图
     */
    mat4V = new JWebglMathMatrix4 ();
    /**
     * 投影
     */
    mat4P = new JWebglMathMatrix4 ();
    /**
     * 模型 - 视图 - 投影
     */
    mat4Mvp = new JWebglMathMatrix4 ();

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

        // 准备好图片的 mvp 矩阵
        this.mat4M.setIdentity ();
        this.mat4V.setLookAt (
            0, 0, 1,
            0, 0, 0,
            0, 1, 0
        );
        this.mat4P.setOrtho (
            - 1, 1,
            - 1, 1,
              0, 2
        );
        JWebglMathMatrix4.multiplayMat4List (
            this.mat4P,
            this.mat4V,
            this.mat4M,
            this.mat4Mvp
        );
    }

    /**
     * 缓存了图片信息的帧缓冲区
     */
    fboTexture: JWebglFrameBuffer;

    /**
     * 存储了角信息的帧缓冲区
     */
    fboCornerData: JWebglFrameBuffer;

    /**
     * 缓存了
     */
    fboDisplay: JWebglFrameBuffer;

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
        
        // 混合方式为直接覆盖
        this.jWebgl.canvasWebglCtx.blendFunc (JWebglEnum.BlendFunc.SRC_ALPHA, JWebglEnum.BlendFunc.ZERO);

        // 绘制 fbo
        if (this.fboTexture == null || this.fboTexture.width != dataSrc.textureWidth || this.fboTexture.height != dataSrc.textureHeight) {
            this.fboTexture = this.jWebgl.getFbo (dataSrc.textureWidth, dataSrc.textureHeight);
            this.fboDisplay = this.jWebgl.getFbo (dataSrc.textureWidth * IndexGlobal.PIXEL_TEX_TO_SCREEN, dataSrc.textureHeight * IndexGlobal.PIXEL_TEX_TO_SCREEN);
            this.fboCornerData = this.jWebgl.getFbo (dataSrc.textureWidth * 2.0, dataSrc.textureHeight * 2.0);
        };

        // 得到简略图
        dataSrc.drawImgPadding (this.jWebgl, this.fboTexture);
        
        // 原图
        this.drawFbo (this.fboTexture, 0, 0);

        // 各个角的数据
        this.jWebgl.useFbo (this.fboCornerData);
        this.jWebgl.programSmoothStep1CornerData.uMvp.fill (this.mat4Mvp);
        this.jWebgl.programSmoothStep1CornerData.uTexture.fillByFbo (this.fboTexture);
        this.jWebgl.programSmoothStep1CornerData.uTextureSize.fill (dataSrc.textureWidth, dataSrc.textureHeight);
        this.jWebgl.programSmoothStep1CornerData.uRight.fill (1);
        this.jWebgl.programSmoothStep1CornerData.add (
            JWebglMathVector4.centerO,
            JWebglMathVector4.axisZStart,
            JWebglMathVector4.axisYEnd,
            2,
            2
        );
        this.jWebgl.programSmoothStep1CornerData.draw ();
        this.drawFbo (this.fboCornerData, 1, 0);

        // 网格
        let cameraWidth = dataSrc.textureWidth * HORIZON_COUNT;
        let cameraHeight = dataSrc.textureHeight * VERTICAL_COUNT;
        this.jWebgl.canvasWebglCtx.blendFunc (JWebglEnum.BlendFunc.SRC_ALPHA, JWebglEnum.BlendFunc.ONE_MINUS_SRC_ALPHA);
        this.jWebgl.programLine.uMvp.fill (this.jWebgl.mat4Mvp);
        let colorGrid = JWebglColor.COLOR_BLACK;
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

    /**
     * 在位置 x、y 绘制当前结果
     * @param x 
     * @param y 
     */
    drawFbo (fbo: JWebglFrameBuffer, x: number, y: number) {
        if (fbo != this.fboDisplay) {
            this.jWebgl.fillFbo (this.fboDisplay, fbo);
        };
        let dataSrc = IndexGlobal.inst.detailMachine.statusPreview;
        this.jWebgl.useFbo (null);
        let cameraWidth = dataSrc.textureWidth * HORIZON_COUNT;
        let cameraHeight = dataSrc.textureHeight * VERTICAL_COUNT;
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
        this.jWebgl.programSmoothStep2Smooth.uSampler.fillByFbo (this.fboDisplay);
        this.posImg.elements [0] = dataSrc.textureWidth * (0.5 + x);
        this.posImg.elements [1] = dataSrc.textureHeight * (VERTICAL_COUNT - 1 + 0.5 - y);
        this.jWebgl.programSmoothStep2Smooth.add (
            this.posImg,
            JWebglMathVector4.axisZStart,
            JWebglMathVector4.axisYEnd,
            dataSrc.textureWidth,
            dataSrc.textureHeight
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
                            [MgrDomDefine.STYLE_WIDTH]: `${dataSrc.textureWidth * IndexGlobal.PIXEL_TEX_TO_SCREEN * HORIZON_COUNT}px`,
                            [MgrDomDefine.STYLE_HEIGHT]: `${dataSrc.textureHeight * IndexGlobal.PIXEL_TEX_TO_SCREEN * VERTICAL_COUNT}px`,
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
                                width: dataSrc.textureWidth * IndexGlobal.PIXEL_TEX_TO_SCREEN * HORIZON_COUNT * IndexGlobal.ANTINA,
                                height: dataSrc.textureHeight * IndexGlobal.PIXEL_TEX_TO_SCREEN * VERTICAL_COUNT * IndexGlobal.ANTINA,
                                style: {
                                    [MgrDomDefine.STYLE_WIDTH]: `${dataSrc.textureWidth * IndexGlobal.PIXEL_TEX_TO_SCREEN * HORIZON_COUNT}px`,
                                    [MgrDomDefine.STYLE_HEIGHT]: `${dataSrc.textureHeight * IndexGlobal.PIXEL_TEX_TO_SCREEN * VERTICAL_COUNT}px`,
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
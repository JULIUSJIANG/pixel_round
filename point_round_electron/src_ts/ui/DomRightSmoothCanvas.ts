import IndexGlobal from "../IndexGlobal.js";
import NodeModules from "../NodeModules.js";
import JWebgl from "../common/JWebgl.js";
import JWebglColor from "../common/JWebglColor.js";
import JWebglFrameBuffer from "../common/JWebglFrameBuffer.js";
import JWebglMathMatrix4 from "../common/JWebglMathMatrix4.js";
import JWebglMathVector4 from "../common/JWebglMathVector4.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrData from "../mgr/MgrData.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";

const HORIZON_COUNT = 5;

const VERTICAL_COUNT = 4;

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

        this.jWebgl.evtTouchStart.on (() => {
            let touchX = Math.floor (this.jWebgl.currentTouch.posCanvas [0]);
            let touchY = Math.floor (this.jWebgl.currentTouch.posCanvas [1]);
            let gridX = Math.floor (touchX / IndexGlobal.PIXEL_TEX_TO_SCREEN);
            let gridY = Math.floor (touchY / IndexGlobal.PIXEL_TEX_TO_SCREEN);
            this.loadGridX (gridX, gridY);
        });
    }

    /**
     * 格子位置 x
     */
    gridX: number = 0;
    /**
     * 格子位置 y
     */
    gridY: number = 0;
    /**
     * 载入格子位置
     * @param x 
     * @param y 
     */
    loadGridX (x: number, y: number) {
        if (x == this.gridX && y == this.gridY) {
            return;
        };
        this.gridX = x;
        this.gridY = y;
        // 刷新画面
        MgrData.inst.callDataChange ();
    }

    /**
     * 缓存了图片信息的帧缓冲区
     */
    fboTexture: JWebglFrameBuffer;
    /**
     * 存储了厚度信息的帧缓冲区，用于面对 x 平滑冲突时候，判断哪边是线
     */
    fboTickness: JWebglFrameBuffer;
    /**
     * 存储了平坦信息的帧缓冲区，可由此确定部分情况的平滑颜色
     */
    fboFlat: JWebglFrameBuffer;
    /**
     * 存储了角信息的帧缓冲区
     */
    fboCornerData: JWebglFrameBuffer;
    /**
     * 备份空间
     */
    fboCornerDataCache: JWebglFrameBuffer;
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

        // 绘制 fbo
        if (this.fboTexture == null || this.fboTexture.width != dataSrc.textureWidth || this.fboTexture.height != dataSrc.textureHeight) {
            this.jWebgl.destroyFbo (this.fboTexture);
            this.fboTexture = this.jWebgl.getFbo (dataSrc.textureWidth, dataSrc.textureHeight);
            this.jWebgl.destroyFbo (this.fboTickness);
            this.fboTickness = this.jWebgl.getFbo (dataSrc.textureWidth, dataSrc.textureHeight);
            this.jWebgl.destroyFbo (this.fboFlat);
            this.fboFlat = this.jWebgl.getFbo (dataSrc.textureWidth * 2, dataSrc.textureHeight * 2);
            this.jWebgl.destroyFbo (this.fboCornerData);
            this.fboCornerData = this.jWebgl.getFbo (dataSrc.textureWidth * 2.0, dataSrc.textureHeight * 2.0);
            this.jWebgl.destroyFbo (this.fboCornerDataCache);
            this.fboCornerDataCache = this.jWebgl.getFbo (dataSrc.textureWidth * 2.0, dataSrc.textureHeight * 2.0);
            this.jWebgl.destroyFbo (this.fboDisplay);
            this.fboDisplay = this.jWebgl.getFbo (dataSrc.textureWidth * IndexGlobal.PIXEL_TEX_TO_SCREEN, dataSrc.textureHeight * IndexGlobal.PIXEL_TEX_TO_SCREEN);
        };

        // 清除所有
        this.jWebgl.useFbo (null);
        this.jWebgl.clear ();

        this.step0Texture ();
        this.step0Tickness ();
        this.step1CornerData ();
        this.step2CornerRemX ();
        this.step3CornerRemU ();
        this.step4CornerRemT ();

        // 网格
        let cameraWidth = dataSrc.textureWidth * HORIZON_COUNT;
        let cameraHeight = dataSrc.textureHeight * VERTICAL_COUNT;
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
        this.jWebgl.programLine.draw ();
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

        // 准星
        let gridXMod = this.gridX % dataSrc.textureWidth + 0.5;
        let gridYMod = this.gridY % dataSrc.textureHeight + 0.5;
        let colorFocus = JWebglColor.COLOR_WHITE;
        // 竖线
        for (let i = 0; i < HORIZON_COUNT; i++) {
            this.posFrom.elements [0] = i * dataSrc.textureWidth + gridXMod;
            this.posFrom.elements [1] = 0;
            this.posTo.elements [0] = i * dataSrc.textureWidth + gridXMod;
            this.posTo.elements [1] = cameraHeight;
            this.jWebgl.programLine.add (
                this.posFrom,
                colorFocus,
                this.posTo,
                colorFocus
            );
        };
        // 横线
        for (let i = 0; i < VERTICAL_COUNT; i++) {
            this.posFrom.elements [0] = 0;
            this.posFrom.elements [1] = i * dataSrc.textureHeight + gridYMod;
            this.posTo.elements [0] = cameraWidth;
            this.posTo.elements [1] = i * dataSrc.textureHeight + gridYMod;
            this.jWebgl.programLine.add (
                this.posFrom,
                colorFocus,
                this.posTo,
                colorFocus
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
        this.jWebgl.programImg.uMvp.fill (this.jWebgl.mat4Mvp);
        this.jWebgl.programImg.uTexture.fillByFbo (fbo);
        this.posImg.elements [0] = dataSrc.textureWidth * (0.5 + x);
        this.posImg.elements [1] = dataSrc.textureHeight * (VERTICAL_COUNT - 1 + 0.5 - y);
        this.jWebgl.programImg.add (
            this.posImg,
            JWebglMathVector4.axisZStart,
            JWebglMathVector4.axisYEnd,
            dataSrc.textureWidth,
            dataSrc.textureHeight
        );
        this.jWebgl.programImg.draw ();
    }

    /**
     * 把平滑结果绘制在 x、y
     * @param x 
     * @param y 
     */
    smoothTo (x: number, y: number) {
        let dataSrc = IndexGlobal.inst.detailMachine.statusPreview;
        // 最终结果
        this.jWebgl.useFbo (this.fboDisplay);
        this.jWebgl.clear ();
        this.jWebgl.programSmoothSmooth.uMvp.fill (this.mat4Mvp);
        this.jWebgl.programSmoothSmooth.uTexture.fillByFbo (this.fboTexture);
        this.jWebgl.programSmoothSmooth.uTextureSize.fill (dataSrc.textureWidth, dataSrc.textureHeight);
        this.jWebgl.programSmoothSmooth.uTextureCorner.fillByFbo (this.fboCornerData);
        this.jWebgl.programSmoothSmooth.add (
            JWebglMathVector4.centerO,
            JWebglMathVector4.axisZStart,
            JWebglMathVector4.axisYEnd,
            2,
            2
        );
        this.jWebgl.programSmoothSmooth.draw ();
        this.drawFbo (this.fboDisplay, x, y);
    }

    /**
     * 准备好源纹理
     */
    step0Texture () {
        let dataSrc = IndexGlobal.inst.detailMachine.statusPreview;
        // 得到简略图
        dataSrc.drawImgPadding (this.jWebgl, this.fboTexture);
        // 原图
        this.drawFbo (this.fboTexture, 0, 0);
    }

    /**
     * 源纹理 -> 厚度纹理
     */
    step0Tickness () {
        let dataSrc = IndexGlobal.inst.detailMachine.statusPreview;
        // 厚度数据
        this.jWebgl.useFbo (this.fboTickness);
        this.jWebgl.clear ();
        this.jWebgl.programSmoothTickness.uMvp.fill (this.mat4Mvp);
        this.jWebgl.programSmoothTickness.uTexture.fillByFbo (this.fboTexture);
        this.jWebgl.programSmoothTickness.uTextureSize.fill (dataSrc.textureWidth, dataSrc.textureHeight);
        this.jWebgl.programSmoothTickness.add (
            JWebglMathVector4.centerO,
            JWebglMathVector4.axisZStart,
            JWebglMathVector4.axisYEnd,
            2,
            2
        );
        this.jWebgl.programSmoothTickness.draw ();
        this.drawFbo (this.fboTickness, 0, 1);
    }

    /**
     * 源纹理 -> 角数据纹理
     */
    step1CornerData () {
        let pos1 = 1;
        let dataSrc = IndexGlobal.inst.detailMachine.statusPreview;
        // 各个角的数据
        this.jWebgl.useFbo (this.fboCornerData);
        this.jWebgl.clear ();
        this.jWebgl.programSmoothCornerData.uMvp.fill (this.mat4Mvp);
        this.jWebgl.programSmoothCornerData.uTexture.fillByFbo (this.fboTexture);
        this.jWebgl.programSmoothCornerData.uTextureSize.fill (dataSrc.textureWidth, dataSrc.textureHeight);
        this.jWebgl.programSmoothCornerData.uRight.fill (1);
        this.jWebgl.programSmoothCornerData.add (
            JWebglMathVector4.centerO,
            JWebglMathVector4.axisZStart,
            JWebglMathVector4.axisYEnd,
            2,
            2
        );
        this.jWebgl.programSmoothCornerData.draw ();
        this.drawFbo (this.fboCornerData, pos1, 1);
        this.smoothTo (pos1, 0);
    }

    /**
     * 剔除 X 平滑
     */
    step2CornerRemX () {
        let posX = 2;
        let dataSrc = IndexGlobal.inst.detailMachine.statusPreview;
        this.jWebgl.useFbo (this.fboCornerDataCache);
        this.jWebgl.clear ();
        this.jWebgl.programSmoothCornerRemoveX.uMvp.fill (this.mat4Mvp);
        this.jWebgl.programSmoothCornerRemoveX.uTextureSize.fill (dataSrc.textureWidth, dataSrc.textureHeight);
        this.jWebgl.programSmoothCornerRemoveX.uTextureTickness.fillByFbo (this.fboTickness);
        this.jWebgl.programSmoothCornerRemoveX.uTextureCorner.fillByFbo (this.fboCornerData);
        this.jWebgl.programSmoothCornerRemoveX.uRight.fill (1);
        this.jWebgl.programSmoothCornerRemoveX.add (
            JWebglMathVector4.centerO,
            JWebglMathVector4.axisZStart,
            JWebglMathVector4.axisYEnd,
            2,
            2
        );
        this.jWebgl.programSmoothCornerRemoveX.draw ();
        this.drawFbo (this.fboCornerDataCache, posX, 1);
        this.jWebgl.fillFbo (this.fboCornerData, this.fboCornerDataCache);
        this.smoothTo (posX, 0);
    }

    /**
     * 剔除无影响平滑
     */
    step3CornerRemU () {
        let posX = 3;
        let dataSrc = IndexGlobal.inst.detailMachine.statusPreview;
        this.jWebgl.useFbo (this.fboCornerDataCache);
        this.jWebgl.clear ();
        this.jWebgl.programSmoothCornerRemoveU.uMvp.fill (this.mat4Mvp);
        this.jWebgl.programSmoothCornerRemoveU.uTexture.fillByFbo (this.fboTexture);
        this.jWebgl.programSmoothCornerRemoveU.uTextureSize.fill (dataSrc.textureWidth, dataSrc.textureHeight);
        this.jWebgl.programSmoothCornerRemoveU.uTextureCorner.fillByFbo (this.fboCornerData);
        this.jWebgl.programSmoothCornerRemoveU.uRight.fill (1);
        this.jWebgl.programSmoothCornerRemoveU.add (
            JWebglMathVector4.centerO,
            JWebglMathVector4.axisZStart,
            JWebglMathVector4.axisYEnd,
            2,
            2
        );
        this.jWebgl.programSmoothCornerRemoveU.draw ();
        this.drawFbo (this.fboCornerDataCache, posX, 1);
        this.jWebgl.fillFbo (this.fboCornerData, this.fboCornerDataCache);
        this.smoothTo (posX, 0);
    }

    /**
     * 剔除 T 平滑
     */
    step4CornerRemT () {
        let posX = 4;
        let dataSrc = IndexGlobal.inst.detailMachine.statusPreview;
        this.jWebgl.useFbo (this.fboCornerDataCache);
        this.jWebgl.clear ();
        this.jWebgl.programSmoothCornerRemoveT.uMvp.fill (this.mat4Mvp);
        this.jWebgl.programSmoothCornerRemoveT.uTextureSize.fill (dataSrc.textureWidth, dataSrc.textureHeight);
        this.jWebgl.programSmoothCornerRemoveT.uTextureCorner.fillByFbo (this.fboCornerData);
        this.jWebgl.programSmoothCornerRemoveT.uRight.fill (1);
        this.jWebgl.programSmoothCornerRemoveT.add (
            JWebglMathVector4.centerO,
            JWebglMathVector4.axisZStart,
            JWebglMathVector4.axisYEnd,
            2,
            2
        );
        this.jWebgl.programSmoothCornerRemoveT.draw ();
        this.drawFbo (this.fboCornerDataCache, posX, 1);
        this.jWebgl.fillFbo (this.fboCornerData, this.fboCornerDataCache);
        this.smoothTo (posX, 0);
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
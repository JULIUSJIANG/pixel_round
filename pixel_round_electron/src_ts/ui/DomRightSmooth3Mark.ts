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
import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import MgrRes from "../mgr/MgrRes.js";
import MgrResAssetsImage from "../mgr/MgrResAssetsImage.js";

// 00000000 00000000 00000000 00000000

/**
 * 线的深度
 */
const Z_GRID = 0.1;

/**
 * 尝试更为灵魂的平滑
 */
class DomRightSmooth3Mark extends ReactComponentExtend <number> {

    /**
     * 3d canvas 引用器
     */
    canvasWebglRef = NodeModules.react.createRef();

    jWebgl: JWebgl;

    mat4M = new JWebglMathMatrix4 ();
    mat4V = new JWebglMathMatrix4 ();
    mat4P = new JWebglMathMatrix4 ();

    reactComponentExtendOnInit (): void {
        this.jWebgl = new JWebgl (this.canvasWebglRef.current);
        this.jWebgl.init ();
        this.mat4M.setIdentity ();
    }

    fbo: JWebglFrameBuffer;

    initFbo (width: number, height: number) {
        if (this.fbo == null || this.fbo.width != width || this.fbo.height != height) {
            this.fbo = this.jWebgl.getFbo (width, height);
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
        if (this.finishedData == null) {
            return;
        };
        // 没加载完的不画
        let img = this.jWebgl.getImg (this.finishedData.dataOrigin);
        if (img.currStatus != img.statusFinished) {
            return;
        };

        // 图片尺寸
        let imgWidth = img.assetsImg.image.width;
        let imgHeight = img.assetsImg.image.height;
        // 视图尺寸
        let viewWidth = (img.assetsImg.image.width + this.finishedData.paddingLeft + this.finishedData.paddingRight);
        let viewHeight = (img.assetsImg.image.height + this.finishedData.paddingBottom + this.finishedData.paddingTop);
        // 帧缓冲区尺寸
        let fboWidth = Math.ceil (viewWidth / this.finishedData.pixelWidth);
        let fboHeight = Math.ceil (viewHeight / this.finishedData.pixelHeight);
        
        this.initFbo (fboWidth, fboHeight);
        
        // 把经过裁切、缩放的内容绘制到 fbo 上
        this.jWebgl.useFbo (this.fbo);
        this.jWebgl.clear ();
        this.mat4V.setLookAt (
            viewWidth / 2, viewHeight / 2, 1,
            viewWidth / 2, viewHeight / 2, 0,
            0, 1, 0
        );
        this.mat4P.setOrtho (
            - viewWidth / 2, viewWidth / 2,
            - viewHeight / 2, viewHeight / 2,
            0, 2
        );
        JWebglMathMatrix4.multiplayMat4List (
            this.mat4P,
            this.mat4V,
            this.mat4M,
            this.jWebgl.mat4Mvp
        );
        this.jWebgl.programImg.uMvp.fill (this.jWebgl.mat4Mvp);
        this.jWebgl.programImg.uSampler.fillByImg (img);
        this.posImg.elements [0] = imgWidth / 2 + this.finishedData.paddingLeft;
        this.posImg.elements [1] = imgHeight / 2 + this.finishedData.paddingBottom;
        this.jWebgl.programImg.add (
            this.posImg,
            JWebglMathVector4.axisZStart,
            JWebglMathVector4.axisYEnd,
            imgWidth,
            imgHeight
        );
        this.jWebgl.programImg.draw ();

        // 把 fbo 的内容绘制到屏幕上
        let cameraWidth = fboWidth;
        let cameraHeight = fboHeight;
        this.jWebgl.useFbo (null);
        this.jWebgl.clear ();
        this.mat4V.setLookAt (
            cameraWidth / 2, cameraHeight / 2, 1,
            cameraWidth / 2, cameraHeight / 2, 0,
            0, 1, 0
        );
        this.mat4P.setOrtho (
            -cameraWidth / 2, cameraWidth / 2,
            -cameraHeight / 2, cameraHeight / 2,
             0, 2
        );
        JWebglMathMatrix4.multiplayMat4List (
            this.mat4P,
            this.mat4V,
            this.mat4M,
            this.jWebgl.mat4Mvp
        );
        this.jWebgl.programSmooth3Step1.uVecForward.fill (-1, 1);
        this.jWebgl.programSmooth3Step1.uVecRight.fill (1, 1);
        this.jWebgl.programSmooth3Step1.uTexture.fillByFbo (this.fbo);
        this.jWebgl.programSmooth3Step1.uTextureSize.fill (fboWidth, fboHeight);
        this.jWebgl.programSmooth3Step1.uMvp.fill (this.jWebgl.mat4Mvp);
        this.posImg.elements [0] = fboWidth / 2;
        this.posImg.elements [1] = fboHeight / 2;
        this.jWebgl.programSmooth3Step1.add (
            this.posImg,
            JWebglMathVector4.axisZStart,
            JWebglMathVector4.axisYEnd,
            fboWidth,
            fboHeight
        );
        this.jWebgl.programSmooth3Step1.draw ();

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

    /**
     * 加载完成的图片
     */
    finishedImg: MgrResAssetsImage;
    /**
     * 加载完成的数据
     */
    finishedData: MgrDataItem.ImgData;

    render (): ReactComponentExtendInstance {
        let listImgData = MgrData.inst.get (MgrDataItem.LIST_IMG_DATA);
        let listImgDataInst: MgrDataItem.ImgData;
        for (let i = 0; i < listImgData.length; i++) {
            let listImgDataI = listImgData [i];
            if (listImgDataI.id == MgrData.inst.get (MgrDataItem.CURRENT_IMG)) {
                listImgDataInst = listImgDataI;
                break;
            };
        };

        // 没加载完的不画
        let img = MgrRes.inst.getImg (listImgDataInst.dataOrigin);
        if (img.currStatus == img.statusFinished) {
            this.finishedImg = img;
            this.finishedData = listImgDataInst;
        };
        let canvasWidth = 1;
        let canvasHeight = 1;
        if (this.finishedImg != null) {
            canvasWidth = Math.ceil ((img.image.width + listImgDataInst.paddingRight + listImgDataInst.paddingLeft) / listImgDataInst.pixelWidth) * IndexGlobal.PIXEL_TEX_TO_SCREEN;
            canvasHeight = Math.ceil ((img.image.height + listImgDataInst.paddingTop + listImgDataInst.paddingBottom) / listImgDataInst.pixelHeight) * IndexGlobal.PIXEL_TEX_TO_SCREEN;
        };

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
                            [MgrDomDefine.STYLE_WIDTH]: `${canvasWidth}px`,
                            [MgrDomDefine.STYLE_HEIGHT]: `${canvasHeight}px`,
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
                                width: canvasWidth * IndexGlobal.ANTINA,
                                height: canvasHeight * IndexGlobal.ANTINA,
                                style: {
                                    [MgrDomDefine.STYLE_WIDTH]: `${canvasWidth}px`,
                                    [MgrDomDefine.STYLE_HEIGHT]: `${canvasHeight}px`,
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

export default DomRightSmooth3Mark;
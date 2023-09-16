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

const Z_MASK = 0.2;

class DomRightPreviewImgBeforeWebglCutted extends ReactComponentExtend <number> {
    /**
     * 3d canvas 引用器
     */
    canvasWebglRef = NodeModules.react.createRef();

    jWebgl: JWebgl;

    mat4M = new JWebglMathMatrix4();
    mat4V = new JWebglMathMatrix4();
    mat4P = new JWebglMathMatrix4();

    fbo: JWebglFrameBuffer;

    reactComponentExtendOnInit(): void {
        this.jWebgl = new JWebgl(this.canvasWebglRef.current);
        this.jWebgl.init();
        this.mat4M.setIdentity();
    }

    initFbo (width: number, height: number) {
        if (this.fbo == null || this.fbo.width != width || this.fbo.height != height) {
            this.fbo = this.jWebgl.getFbo (width, height);
        };
    }

    posImg = new JWebglMathVector4 ();
    
    posFrom = new JWebglMathVector4 (0, 0, Z_GRID);
    posTo = new JWebglMathVector4 (0, 0, Z_GRID);

    posOutLB = new JWebglMathVector4 (0, 0, Z_MASK);
    posOutRB = new JWebglMathVector4 (0, 0, Z_MASK);
    posOutLT = new JWebglMathVector4 (0, 0, Z_MASK);
    posOutRT = new JWebglMathVector4 (0, 0, Z_MASK);

    posInLB = new JWebglMathVector4 (0, 0, Z_MASK);
    posInRB = new JWebglMathVector4 (0, 0, Z_MASK);
    posInLT = new JWebglMathVector4 (0, 0, Z_MASK);
    posInRT = new JWebglMathVector4 (0, 0, Z_MASK);

    reactComponentExtendOnDraw(): void {
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
        let img = this.jWebgl.getImg (listImgDataInst.dataOrigin);
        if (img.currStatus != img.statusFinished) {
            return;
        };

        let imgWidth = img.assetsImg.image.width;
        let imgHeight = img.assetsImg.image.height;
        let viewWidth = (img.assetsImg.image.width + listImgDataInst.paddingLeft + listImgDataInst.paddingRight);
        let viewHeight = (img.assetsImg.image.height + listImgDataInst.paddingBottom + listImgDataInst.paddingTop);

        // 绘制 fbo
        this.initFbo (Math.ceil (viewWidth / listImgDataInst.pixelWidth), Math.ceil (viewHeight / listImgDataInst.pixelHeight));
        this.jWebgl.useFbo (this.fbo);

        this.mat4V.setLookAt(
            viewWidth / 2, viewHeight / 2, 1,
            viewWidth / 2, viewHeight / 2, 0,
            0, 1, 0
        );
        this.mat4P.setOrtho (
            -viewWidth / 2, viewWidth / 2,
            -viewHeight / 2, viewHeight / 2,
            0, 2
        );
        JWebglMathMatrix4.multiplayMat4List (
            this.mat4P,
            this.mat4V,
            this.mat4M,
            this.jWebgl.mat4Mvp
        );

        // 图片
        this.jWebgl.programImg.uMvp.fill (this.jWebgl.mat4Mvp);
        this.jWebgl.programImg.uSampler.fillByImg (img);
        this.posImg.elements [0] = imgWidth / 2 + listImgDataInst.paddingLeft;
        this.posImg.elements [1] = imgHeight / 2 + listImgDataInst.paddingBottom;
        this.jWebgl.programImg.add (
            this.posImg,
            JWebglMathVector4.axisZStart,
            JWebglMathVector4.axisYEnd,
            imgWidth,
            imgHeight
        );
        this.jWebgl.programImg.draw ();

        // 绘制屏幕
        this.jWebgl.useFbo (null);
        viewWidth = Math.ceil (viewWidth / listImgDataInst.pixelWidth);
        viewHeight = Math.ceil (viewHeight / listImgDataInst.pixelHeight);

        this.mat4V.setLookAt(
            viewWidth / 2, viewHeight / 2, 1,
            viewWidth / 2, viewHeight / 2, 0,
            0, 1, 0
        );
        this.mat4P.setOrtho (
            -viewWidth / 2, viewWidth / 2,
            -viewHeight / 2, viewHeight / 2,
            0, 2
        );
        JWebglMathMatrix4.multiplayMat4List (
            this.mat4P,
            this.mat4V,
            this.mat4M,
            this.jWebgl.mat4Mvp
        );

        // 图片
        this.jWebgl.programImg.uMvp.fill (this.jWebgl.mat4Mvp);
        this.jWebgl.programImg.uSampler.fillByFbo (this.fbo);
        this.posImg.elements [0] = viewWidth / 2;
        this.posImg.elements [1] = viewHeight / 2;
        this.jWebgl.programImg.add (
            this.posImg,
            JWebglMathVector4.axisZStart,
            JWebglMathVector4.axisYEnd,
            viewWidth,
            viewHeight
        );
        this.jWebgl.programImg.draw ();

        // 网格
        this.jWebgl.programLine.uMvp.fill (this.jWebgl.mat4Mvp);
        let colorGrid = JWebglColor.COLOR_BLACK;
        for (let i = 0; i <= viewWidth; i++) {
            this.posFrom.elements [0] = i;
            this.posFrom.elements [1] = 0;
            this.posTo.elements [0] = i;
            this.posTo.elements [1] = viewHeight;
            this.jWebgl.programLine.add (
                this.posFrom,
                colorGrid,
                this.posTo,
                colorGrid
            );
        };
        for (let i = 0; i <= viewHeight; i++) {
            this.posFrom.elements [0] = 0;
            this.posFrom.elements [1] = i;
            this.posTo.elements [0] = viewWidth;
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

    finishedImg: MgrResAssetsImage;

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

export default DomRightPreviewImgBeforeWebglCutted;
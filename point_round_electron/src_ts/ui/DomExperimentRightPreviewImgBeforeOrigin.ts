import IndexGlobal from "../IndexGlobal.js";
import NodeModules from "../NodeModules.js";
import JWebgl from "../common/JWebgl.js";
import JWebglColor from "../common/JWebglColor.js";
import JWebglMathMatrix4 from "../common/JWebglMathMatrix4.js";
import JWebglMathVector4 from "../common/JWebglMathVector4.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import MgrRes from "../mgr/MgrRes.js";
import MgrResAssetsImage from "../mgr/MgrResAssetsImage.js";

const Z_GRID = 0.1;

const Z_MASK = 0.2;

class DomExperimentRightPreviewImgBeforeOrigin extends ReactComponentExtend <number> {
    /**
     * 3d canvas 引用器
     */
    canvasWebglRef = NodeModules.react.createRef();

    jWebgl: JWebgl;

    reactComponentExtendOnInit(): void {
        this.jWebgl = new JWebgl(this.canvasWebglRef.current);
        this.jWebgl.init();
    }

    reactComponentExtendOnRelease (): void {
        this.jWebgl.release ();
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

    reactComponentExtendOnDraw (): void {
        let currImg = IndexGlobal.inst.expCurrent ();

        // 清除画面
        this.jWebgl.useFbo (null);
        this.jWebgl.clear ();
        let imgWidth = currImg.expImgData.width;
        let imgHeight = currImg.expImgData.height;
        let paddingTop = Math.max (currImg.expImgData.paddingTop, 0);
        let paddingRight = Math.max (currImg.expImgData.paddingRight, 0);
        let paddingBottom = Math.max (currImg.expImgData.paddingBottom, 0);
        let paddingLeft = Math.max (currImg.expImgData.paddingLeft, 0);
        let viewWidth = imgWidth + paddingRight + paddingLeft;
        let viewHeight = imgHeight + paddingTop + paddingBottom;

        this.jWebgl.mat4V.setLookAt(
            viewWidth / 2, viewHeight / 2, 1,
            viewWidth / 2, viewHeight / 2, 0,
            0, 1, 0
        );
        this.jWebgl.mat4P.setOrtho (
            -viewWidth / 2, viewWidth / 2,
            -viewHeight / 2, viewHeight / 2,
            0, 2
        );
        this.jWebgl.refreshMat4Mvp ();

        // 图片
        this.jWebgl.programImg.uMvp.fill (this.jWebgl.mat4Mvp);

        // 生成图片
        this.jWebgl.programImg.uTexture.fillByUint8Array (currImg.uint8Bin.bin, currImg.expImgData.width, currImg.expImgData.height);

        this.posImg.elements [0] = imgWidth / 2 + paddingLeft;
        this.posImg.elements [1] = imgHeight / 2 + paddingBottom;
        this.jWebgl.programImg.add (
            this.posImg,
            JWebglMathVector4.axisZStart,
            JWebglMathVector4.axisYEnd,
            imgWidth,
            imgHeight
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

        // 裁切
        this.jWebgl.programTriangle.uMvp.fill (this.jWebgl.mat4Mvp);
        let posTop = viewHeight + Math.min (currImg.expImgData.paddingTop, 0);
        let posRight = viewWidth + Math.min (currImg.expImgData.paddingRight, 0);
        let posBottom = - Math.min (currImg.expImgData.paddingBottom, 0);
        let posLeft = - Math.min (currImg.expImgData.paddingLeft, 0);
        let colorMask = JWebglColor.COLOR_BLUE_ALPHA;

        this.posOutLB.elements [0] = 0;
        this.posOutLB.elements [1] = 0;
        this.posOutRB.elements [0] = viewWidth;
        this.posOutRB.elements [1] = 0;
        this.posOutLT.elements [0] = 0;
        this.posOutLT.elements [1] = viewHeight;
        this.posOutRT.elements [0] = viewWidth;
        this.posOutRT.elements [1] = viewHeight;

        this.posInLB.elements [0] = posLeft;
        this.posInLB.elements [1] = posBottom;
        this.posInRB.elements [0] = posRight;
        this.posInRB.elements [1] = posBottom;
        this.posInLT.elements [0] = posLeft;
        this.posInLT.elements [1] = posTop;
        this.posInRT.elements [0] = posRight;
        this.posInRT.elements [1] = posTop;

        this.jWebgl.programTriangle.addTriangle (
            this.posOutLB,
            colorMask,
            this.posInLB,
            colorMask,
            this.posOutRB,
            colorMask
        );
        this.jWebgl.programTriangle.addTriangle (
            this.posOutLB,
            colorMask,
            this.posInLB,
            colorMask,
            this.posInLT,
            colorMask
        );

        this.jWebgl.programTriangle.addTriangle (
            this.posOutRB,
            colorMask,
            this.posInRB,
            colorMask,
            this.posOutRT,
            colorMask
        );
        this.jWebgl.programTriangle.addTriangle (
            this.posOutRB,
            colorMask,
            this.posInRB,
            colorMask,
            this.posInLB,
            colorMask
        );

        this.jWebgl.programTriangle.addTriangle (
            this.posOutRT,
            colorMask,
            this.posInRT,
            colorMask,
            this.posOutLT,
            colorMask
        );
        this.jWebgl.programTriangle.addTriangle (
            this.posOutRT,
            colorMask,
            this.posInRT,
            colorMask,
            this.posInRB,
            colorMask
        );

        this.jWebgl.programTriangle.addTriangle (
            this.posOutLT,
            colorMask,
            this.posInLT,
            colorMask,
            this.posOutLB,
            colorMask
        );
        this.jWebgl.programTriangle.addTriangle (
            this.posOutLT,
            colorMask,
            this.posInLT,
            colorMask,
            this.posInRT,
            colorMask
        );

        this.jWebgl.programTriangle.draw ();
    }

    render (): ReactComponentExtendInstance {
        let currImg = IndexGlobal.inst.expCurrent ();
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
                            [MgrDomDefine.STYLE_WIDTH]: `${currImg.cWidthShowAll * IndexGlobal.PIXEL_TEX_TO_SCREEN}px`,
                            [MgrDomDefine.STYLE_HEIGHT]: `${currImg.cHeightShowAll * IndexGlobal.PIXEL_TEX_TO_SCREEN}px`,
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
                                width: currImg.cWidthShowAll * IndexGlobal.PIXEL_TEX_TO_SCREEN * IndexGlobal.ANTINA,
                                height: currImg.cHeightShowAll * IndexGlobal.PIXEL_TEX_TO_SCREEN * IndexGlobal.ANTINA,
                                style: {
                                    [MgrDomDefine.STYLE_WIDTH]: `${currImg.cWidthShowAll * IndexGlobal.PIXEL_TEX_TO_SCREEN}px`,
                                    [MgrDomDefine.STYLE_HEIGHT]: `${currImg.cHeightShowAll * IndexGlobal.PIXEL_TEX_TO_SCREEN}px`,
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

export default DomExperimentRightPreviewImgBeforeOrigin;
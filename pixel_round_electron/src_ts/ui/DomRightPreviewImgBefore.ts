import IndexGlobal from "../IndexGlobal.js";
import NodeModules from "../NodeModules.js";
import JWebgl from "../common/JWebgl.js";
import JWebglColor from "../common/JWebglColor.js";
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
import DomInputNumber from "./DomInputNumber.js";

class DomRightPreviewImgBefore extends ReactComponentExtend <DomRightPreviewImgBefore.Args> {
    /**
     * 3d canvas 引用器
     */
    canvasWebglRef = NodeModules.react.createRef();

    jWebgl: JWebgl;

    mat4M: JWebglMathMatrix4 = new JWebglMathMatrix4();

    mat4V: JWebglMathMatrix4 = new JWebglMathMatrix4();

    mat4P: JWebglMathMatrix4 = new JWebglMathMatrix4();

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

    posFrom: JWebglMathVector4 = new JWebglMathVector4 ();

    posTo: JWebglMathVector4 = new JWebglMathVector4 ();

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

        // 清除画面
        this.jWebgl.clear ();
        let imgWidth = img.assetsImg.image.width;
        let imgHeight = img.assetsImg.image.height;

        this.mat4P.setOrtho (
            -imgWidth / 2, imgWidth / 2,
            -imgHeight / 2, imgHeight / 2,
            0, 2
        );
        JWebglMathMatrix4.multiplayMat4List (
            this.mat4P,
            this.mat4V,
            this.mat4M,
            this.jWebgl.mat4Mvp
        );

        this.jWebgl.programImg.uMvp.fill (this.jWebgl.mat4Mvp);
        this.jWebgl.programImg.uSampler.fill (img);
        this.jWebgl.programImg.add (
            JWebglMathVector4.centerO,
            JWebglMathVector4.axisZStart,
            JWebglMathVector4.axisYEnd,
            imgWidth,
            imgHeight
        );
        this.jWebgl.programImg.draw ();

        this.jWebgl.programLine.uMvp.fill (this.jWebgl.mat4Mvp);
        for (let i = 0; i <= img.assetsImg.image.width; i++) {
            this.posFrom.elements [0] = i - imgWidth / 2;
            this.posFrom.elements [1] = - imgHeight / 2;
            this.posFrom.elements [2] = 0.1;
            this.posTo.elements [0] = i - imgWidth / 2;
            this.posTo.elements [1] = imgHeight / 2;
            this.posTo.elements [2] = 0.1;
            this.jWebgl.programLine.add (
                this.posFrom,
                JWebglColor.COLOR_BLACK,

                this.posTo,
                JWebglColor.COLOR_BLACK
            );
        };
        for (let i = 0; i <= img.assetsImg.image.height; i++) {
            this.posFrom.elements [0] = - imgWidth / 2;
            this.posFrom.elements [1] = i - imgHeight / 2;
            this.posFrom.elements [2] = 0.1;
            this.posTo.elements [0] = imgWidth / 2;
            this.posTo.elements [1] = i - imgHeight / 2;
            this.posTo.elements [2] = 0.1;
            this.jWebgl.programLine.add (
                this.posFrom,
                JWebglColor.COLOR_BLACK,

                this.posTo,
                JWebglColor.COLOR_BLACK
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
            canvasWidth = img.image.width * IndexGlobal.PIXEL_TEX_TO_SCREEN;
            canvasHeight = img.image.height * IndexGlobal.PIXEL_TEX_TO_SCREEN;
        };

        return ReactComponentExtend.instantiateTag (
            MgrDomDefine.TAG_DIV,
            {
                style: {
                    [MgrDomDefine.STYLE_WIDTH]: MgrDomDefine.STYLE_WIDTH_PERCENTAGE_0,
                    [MgrDomDefine.STYLE_FLEX_GROW]: 1,

                    [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                    [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN
                }
            },

            ReactComponentExtend.instantiateTag (
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
            ),
            ReactComponentExtend.instantiateTag (
                MgrDomDefine.TAG_DIV,
                {
                    style: {
                        [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                        [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW
                    },
                },

                ReactComponentExtend.instantiateComponent (DomInputNumber, DomInputNumber.Args.create (
                    `上边距`, 
                    (val) => {

                    }
                )),
                ReactComponentExtend.instantiateComponent (DomInputNumber, DomInputNumber.Args.create (
                    `右边距`, 
                    (val) => {

                    }
                )),
                ReactComponentExtend.instantiateComponent (DomInputNumber, DomInputNumber.Args.create (
                    `下边距`, 
                    (val) => {

                    }
                )),
                ReactComponentExtend.instantiateComponent (DomInputNumber, DomInputNumber.Args.create (
                    `左边距`, 
                    (val) => {

                    }
                )),
            ),
            ReactComponentExtend.instantiateTag (
                MgrDomDefine.TAG_DIV,
                {
                    style: {
                        [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                        [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW
                    },
                },

                ReactComponentExtend.instantiateComponent (DomInputNumber, null),
            ),
        );
    }
}

namespace DomRightPreviewImgBefore {
    export class Args {
        static poolType = new ObjectPoolType <Args> ({
            instantiate: () => new Args,
            onPop: null,
            onPush: null
        });
    }
}

export default DomRightPreviewImgBefore;
import NodeModules from "../NodeModules.js";
import JWebgl from "../common/JWebgl.js";
import JWebglMathMatrix4 from "../common/JWebglMathMatrix4.js";
import JWebglMathVector4 from "../common/JWebglMathVector4.js";
import ObjectPoolType from "../common/ObjectPoolType.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import MgrRes from "../mgr/MgrRes.js";
const SIZE_SCALE = 8;
class DomRightPreviewImgAfter extends ReactComponentExtend {
    constructor() {
        super(...arguments);
        /**
         * 3d canvas 引用器
         */
        this.canvasWebglRef = NodeModules.react.createRef();
        this.mat4M = new JWebglMathMatrix4();
        this.mat4V = new JWebglMathMatrix4();
        this.mat4P = new JWebglMathMatrix4();
    }
    reactComponentExtendOnInit() {
        this.jWebgl = new JWebgl(this.canvasWebglRef.current);
        this.jWebgl.init();
        this.mat4M.setIdentity();
        this.mat4V.setLookAt(0, 0, 1, 0, 0, 0, 0, 1, 0);
    }
    reactComponentExtendOnDraw() {
        let listImgData = MgrData.inst.get(MgrDataItem.LIST_IMG_DATA);
        let listImgDataInst;
        for (let i = 0; i < listImgData.length; i++) {
            let listImgDataI = listImgData[i];
            if (listImgDataI.id == MgrData.inst.get(MgrDataItem.CURRENT_IMG)) {
                listImgDataInst = listImgDataI;
                break;
            }
            ;
        }
        ;
        // 没加载完的不画
        let img = this.jWebgl.getImg(listImgDataInst.dataOrigin);
        if (img.currStatus != img.statusFinished) {
            return;
        }
        ;
        // 清除画面
        this.jWebgl.clear();
        this.mat4P.setOrtho(-this.jWebgl.canvasWebgl.width / 2, this.jWebgl.canvasWebgl.width / 2, -this.jWebgl.canvasWebgl.height / 2, this.jWebgl.canvasWebgl.height / 2, 0, 2);
        JWebglMathMatrix4.multiplayMat4List(this.mat4P, this.mat4V, this.mat4M, this.jWebgl.mat4Mvp);
        this.jWebgl.programSmooth1.uMvp.fill(this.jWebgl.mat4Mvp);
        this.jWebgl.programSmooth1.uTexture.fill(img);
        this.jWebgl.programSmooth1.uTextureSize.fill(img.assetsImg.image.width / 2, img.assetsImg.image.height / 2);
        this.jWebgl.programSmooth1.uLightFirst.fill(-1);
        this.jWebgl.programSmooth1.add(JWebglMathVector4.centerO, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, this.jWebgl.canvasWebgl.width, this.jWebgl.canvasWebgl.height);
        this.jWebgl.programSmooth1.draw();
    }
    render() {
        let listImgData = MgrData.inst.get(MgrDataItem.LIST_IMG_DATA);
        let listImgDataInst;
        for (let i = 0; i < listImgData.length; i++) {
            let listImgDataI = listImgData[i];
            if (listImgDataI.id == MgrData.inst.get(MgrDataItem.CURRENT_IMG)) {
                listImgDataInst = listImgDataI;
                break;
            }
            ;
        }
        ;
        // 没加载完的不画
        let img = MgrRes.inst.getImg(listImgDataInst.dataOrigin);
        if (img.currStatus == img.statusFinished) {
            this.finishedImg = img;
        }
        ;
        let canvasWidth = 1;
        let canvasHeight = 1;
        if (this.finishedImg != null) {
            canvasWidth = img.image.width * SIZE_SCALE;
            canvasHeight = img.image.height * SIZE_SCALE;
        }
        ;
        return ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_WIDTH]: MgrDomDefine.STYLE_WIDTH_PERCENTAGE_0,
                [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN
            }
        }, 
        // 滚动视图的遮罩
        ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_HEIGHT]: MgrDomDefine.STYLE_HEIGHT_PERCENTAGE_0,
                [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                [MgrDomDefine.STYLE_OVERFLOW_X]: MgrDomDefine.STYLE_OVERFLOW_X_SCROLL,
                [MgrDomDefine.STYLE_OVERFLOW_Y]: MgrDomDefine.STYLE_OVERFLOW_Y_SCROLL
            }
        }, 
        // 滚动的列表
        ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_WIDTH]: `${canvasWidth}px`,
                [MgrDomDefine.STYLE_HEIGHT]: `${canvasHeight}px`,
                [MgrDomDefine.STYLE_FLEX_GROW]: 0,
                [MgrDomDefine.STYLE_DISPLAY]: this.finishedImg == null ? MgrDomDefine.STYLE_DISPLAY_NONE : MgrDomDefine.STYLE_DISPLAY_BLOCK
            }
        }, ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_WIDTH]: 0,
                [MgrDomDefine.STYLE_HEIGHT]: 0,
                [MgrDomDefine.STYLE_POSITION]: MgrDomDefine.STYLE_POSITION_RELATIVE,
                [MgrDomDefine.STYLE_LEFT]: 0,
                [MgrDomDefine.STYLE_TOP]: 0,
            }
        }, ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_CANVAS, {
            ref: this.canvasWebglRef,
            width: canvasWidth,
            height: canvasHeight,
            style: {
                [MgrDomDefine.STYLE_WIDTH]: `${canvasWidth}px`,
                [MgrDomDefine.STYLE_HEIGHT]: `${canvasHeight}px`,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_BLOCK
            }
        })))));
    }
}
(function (DomRightPreviewImgAfter) {
    class Args {
    }
    Args.poolType = new ObjectPoolType({
        instantiate: () => new Args,
        onPop: null,
        onPush: null
    });
    DomRightPreviewImgAfter.Args = Args;
})(DomRightPreviewImgAfter || (DomRightPreviewImgAfter = {}));
export default DomRightPreviewImgAfter;

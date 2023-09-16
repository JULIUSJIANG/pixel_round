import IndexGlobal from "../IndexGlobal.js";
import NodeModules from "../NodeModules.js";
import JWebgl from "../common/JWebgl.js";
import JWebglColor from "../common/JWebglColor.js";
import JWebglMathMatrix4 from "../common/JWebglMathMatrix4.js";
import JWebglMathVector4 from "../common/JWebglMathVector4.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import MgrRes from "../mgr/MgrRes.js";
const Z_GRID = 0.1;
const Z_MASK = 0.2;
class DomRightPreviewImgBeforeWebglOrigin extends ReactComponentExtend {
    constructor() {
        super(...arguments);
        /**
         * 3d canvas 引用器
         */
        this.canvasWebglRef = NodeModules.react.createRef();
        this.mat4M = new JWebglMathMatrix4();
        this.mat4V = new JWebglMathMatrix4();
        this.mat4P = new JWebglMathMatrix4();
        this.posImg = new JWebglMathVector4();
        this.posFrom = new JWebglMathVector4(0, 0, Z_GRID);
        this.posTo = new JWebglMathVector4(0, 0, Z_GRID);
        this.posOutLB = new JWebglMathVector4(0, 0, Z_MASK);
        this.posOutRB = new JWebglMathVector4(0, 0, Z_MASK);
        this.posOutLT = new JWebglMathVector4(0, 0, Z_MASK);
        this.posOutRT = new JWebglMathVector4(0, 0, Z_MASK);
        this.posInLB = new JWebglMathVector4(0, 0, Z_MASK);
        this.posInRB = new JWebglMathVector4(0, 0, Z_MASK);
        this.posInLT = new JWebglMathVector4(0, 0, Z_MASK);
        this.posInRT = new JWebglMathVector4(0, 0, Z_MASK);
    }
    reactComponentExtendOnInit() {
        this.jWebgl = new JWebgl(this.canvasWebglRef.current);
        this.jWebgl.init();
        this.mat4M.setIdentity();
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
        let imgWidth = img.assetsImg.image.width;
        let imgHeight = img.assetsImg.image.height;
        let paddingTop = Math.max(listImgDataInst.paddingTop, 0);
        let paddingRight = Math.max(listImgDataInst.paddingRight, 0);
        let paddingBottom = Math.max(listImgDataInst.paddingBottom, 0);
        let paddingLeft = Math.max(listImgDataInst.paddingLeft, 0);
        let viewWidth = img.assetsImg.image.width + paddingRight + paddingLeft;
        let viewHeight = img.assetsImg.image.height + paddingTop + paddingBottom;
        this.mat4V.setLookAt(viewWidth / 2, viewHeight / 2, 1, viewWidth / 2, viewHeight / 2, 0, 0, 1, 0);
        this.mat4P.setOrtho(-viewWidth / 2, viewWidth / 2, -viewHeight / 2, viewHeight / 2, 0, 2);
        JWebglMathMatrix4.multiplayMat4List(this.mat4P, this.mat4V, this.mat4M, this.jWebgl.mat4Mvp);
        // 图片
        this.jWebgl.programImg.uMvp.fill(this.jWebgl.mat4Mvp);
        this.jWebgl.programImg.uSampler.fillByImg(img);
        this.posImg.elements[0] = imgWidth / 2 + paddingLeft;
        this.posImg.elements[1] = imgHeight / 2 + paddingBottom;
        this.jWebgl.programImg.add(this.posImg, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, imgWidth, imgHeight);
        this.jWebgl.programImg.draw();
        // 网格
        this.jWebgl.programLine.uMvp.fill(this.jWebgl.mat4Mvp);
        let colorGrid = JWebglColor.COLOR_BLACK;
        for (let i = 0; i <= viewWidth; i++) {
            this.posFrom.elements[0] = i;
            this.posFrom.elements[1] = 0;
            this.posTo.elements[0] = i;
            this.posTo.elements[1] = viewHeight;
            this.jWebgl.programLine.add(this.posFrom, colorGrid, this.posTo, colorGrid);
        }
        ;
        for (let i = 0; i <= viewHeight; i++) {
            this.posFrom.elements[0] = 0;
            this.posFrom.elements[1] = i;
            this.posTo.elements[0] = viewWidth;
            this.posTo.elements[1] = i;
            this.jWebgl.programLine.add(this.posFrom, colorGrid, this.posTo, colorGrid);
        }
        ;
        this.jWebgl.programLine.draw();
        // 裁切
        this.jWebgl.programTriangle.uMvp.fill(this.jWebgl.mat4Mvp);
        let posTop = viewHeight + Math.min(listImgDataInst.paddingTop, 0);
        let posRight = viewWidth + Math.min(listImgDataInst.paddingRight, 0);
        let posBottom = -Math.min(listImgDataInst.paddingBottom, 0);
        let posLeft = -Math.min(listImgDataInst.paddingLeft, 0);
        let colorMask = JWebglColor.COLOR_BLUE_ALPHA;
        this.posOutLB.elements[0] = 0;
        this.posOutLB.elements[1] = 0;
        this.posOutRB.elements[0] = viewWidth;
        this.posOutRB.elements[1] = 0;
        this.posOutLT.elements[0] = 0;
        this.posOutLT.elements[1] = viewHeight;
        this.posOutRT.elements[0] = viewWidth;
        this.posOutRT.elements[1] = viewHeight;
        this.posInLB.elements[0] = posLeft;
        this.posInLB.elements[1] = posBottom;
        this.posInRB.elements[0] = posRight;
        this.posInRB.elements[1] = posBottom;
        this.posInLT.elements[0] = posLeft;
        this.posInLT.elements[1] = posTop;
        this.posInRT.elements[0] = posRight;
        this.posInRT.elements[1] = posTop;
        this.jWebgl.programTriangle.add(this.posOutLB, colorMask, this.posInLB, colorMask, this.posOutRB, colorMask);
        this.jWebgl.programTriangle.add(this.posOutLB, colorMask, this.posInLB, colorMask, this.posInLT, colorMask);
        this.jWebgl.programTriangle.add(this.posOutRB, colorMask, this.posInRB, colorMask, this.posOutRT, colorMask);
        this.jWebgl.programTriangle.add(this.posOutRB, colorMask, this.posInRB, colorMask, this.posInLB, colorMask);
        this.jWebgl.programTriangle.add(this.posOutRT, colorMask, this.posInRT, colorMask, this.posOutLT, colorMask);
        this.jWebgl.programTriangle.add(this.posOutRT, colorMask, this.posInRT, colorMask, this.posInRB, colorMask);
        this.jWebgl.programTriangle.add(this.posOutLT, colorMask, this.posInLT, colorMask, this.posOutLB, colorMask);
        this.jWebgl.programTriangle.add(this.posOutLT, colorMask, this.posInLT, colorMask, this.posInRT, colorMask);
        this.jWebgl.programTriangle.draw();
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
            let paddingTop = Math.max(listImgDataInst.paddingTop, 0);
            let paddingRight = Math.max(listImgDataInst.paddingRight, 0);
            let paddingBottom = Math.max(listImgDataInst.paddingBottom, 0);
            let paddingLeft = Math.max(listImgDataInst.paddingLeft, 0);
            canvasWidth = (img.image.width + paddingRight + paddingLeft) * IndexGlobal.PIXEL_TEX_TO_SCREEN;
            canvasHeight = (img.image.height + paddingTop + paddingBottom) * IndexGlobal.PIXEL_TEX_TO_SCREEN;
        }
        ;
        return ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
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
        ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
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
            width: canvasWidth * IndexGlobal.ANTINA,
            height: canvasHeight * IndexGlobal.ANTINA,
            style: {
                [MgrDomDefine.STYLE_WIDTH]: `${canvasWidth}px`,
                [MgrDomDefine.STYLE_HEIGHT]: `${canvasHeight}px`,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_BLOCK
            }
        })))));
    }
}
export default DomRightPreviewImgBeforeWebglOrigin;

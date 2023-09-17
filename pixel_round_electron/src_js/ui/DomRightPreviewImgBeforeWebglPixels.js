import IndexGlobal from "../IndexGlobal.js";
import NodeModules from "../NodeModules.js";
import JWebgl from "../common/JWebgl.js";
import JWebglColor from "../common/JWebglColor.js";
import JWebglEnum from "../common/JWebglEnum.js";
import JWebglMathMatrix4 from "../common/JWebglMathMatrix4.js";
import JWebglMathVector4 from "../common/JWebglMathVector4.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import MgrRes from "../mgr/MgrRes.js";
const Z_GRID = 0.1;
const Z_MASK = 0.2;
class DomRightPreviewImgBeforeWebglPixels extends ReactComponentExtend {
    constructor() {
        super(...arguments);
        /**
         * 3d canvas 引用器
         */
        this.canvasWebglRef = NodeModules.react.createRef();
        this.mat4M = new JWebglMathMatrix4();
        this.mat4V = new JWebglMathMatrix4();
        this.mat4P = new JWebglMathMatrix4();
        this.fboColor = new Uint32Array(1);
        this.fboColorLen = 1;
        this.fboPixels = new Uint8Array(4);
        this.fboPixelsLen = 4;
        this.fboColorSet = new Set();
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
    initFbo(width, height) {
        if (this.fbo == null || this.fbo.width != width || this.fbo.height != height) {
            this.fbo = this.jWebgl.getFbo(width, height);
        }
        ;
        this.fboColorLen = width * height;
        // 存储空间不够，扩容
        if (this.fboColor.length < this.fboColorLen) {
            let size = this.fboColor.length;
            while (size < this.fboColorLen) {
                size *= 2;
            }
            ;
            this.fboColor = new Uint32Array(size);
        }
        ;
        this.fboPixelsLen = width * height * 4;
        // 存储空间不够，扩容
        if (this.fboPixels.length < this.fboPixelsLen) {
            let size = this.fboPixels.length;
            while (size < this.fboPixelsLen) {
                size *= 2;
            }
            ;
            this.fboPixels = new Uint8Array(size);
        }
        ;
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
        let imgWidth = img.assetsImg.image.width;
        let imgHeight = img.assetsImg.image.height;
        let viewWidth = (img.assetsImg.image.width + listImgDataInst.paddingLeft + listImgDataInst.paddingRight);
        let viewHeight = (img.assetsImg.image.height + listImgDataInst.paddingBottom + listImgDataInst.paddingTop);
        // 绘制 fbo
        this.initFbo(Math.ceil(viewWidth / listImgDataInst.pixelWidth), Math.ceil(viewHeight / listImgDataInst.pixelHeight));
        this.jWebgl.useFbo(this.fbo);
        this.mat4V.setLookAt(viewWidth / 2, viewHeight / 2, 1, viewWidth / 2, viewHeight / 2, 0, 0, 1, 0);
        this.mat4P.setOrtho(-viewWidth / 2, viewWidth / 2, -viewHeight / 2, viewHeight / 2, 0, 2);
        JWebglMathMatrix4.multiplayMat4List(this.mat4P, this.mat4V, this.mat4M, this.jWebgl.mat4Mvp);
        // 图片
        this.jWebgl.programImg.uMvp.fill(this.jWebgl.mat4Mvp);
        this.jWebgl.programImg.uSampler.fillByImg(img);
        this.posImg.elements[0] = imgWidth / 2 + listImgDataInst.paddingLeft;
        this.posImg.elements[1] = imgHeight / 2 + listImgDataInst.paddingBottom;
        this.jWebgl.programImg.add(this.posImg, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, imgWidth, imgHeight);
        this.jWebgl.programImg.draw();
        // 绘制屏幕
        this.jWebgl.useFbo(null);
        viewWidth = Math.ceil(viewWidth / listImgDataInst.pixelWidth);
        viewHeight = Math.ceil(viewHeight / listImgDataInst.pixelHeight);
        this.mat4V.setLookAt(viewWidth / 2, viewHeight / 2, 1, viewWidth / 2, viewHeight / 2, 0, 0, 1, 0);
        this.mat4P.setOrtho(-viewWidth / 2, viewWidth / 2, -viewHeight / 2, viewHeight / 2, 0, 2);
        JWebglMathMatrix4.multiplayMat4List(this.mat4P, this.mat4V, this.mat4M, this.jWebgl.mat4Mvp);
        // 图片
        this.jWebgl.programImg.uMvp.fill(this.jWebgl.mat4Mvp);
        this.jWebgl.programImg.uSampler.fillByFbo(this.fbo);
        this.posImg.elements[0] = viewWidth / 2;
        this.posImg.elements[1] = viewHeight / 2;
        this.jWebgl.programImg.add(this.posImg, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, viewWidth, viewHeight);
        this.jWebgl.programImg.draw();
        this.fboColorSet.clear();
        this.jWebgl.canvasWebglCtx.readPixels(0, 0, viewWidth, viewHeight, JWebglEnum.TexImage2DFormat.RGBA, JWebglEnum.VertexAttriPointerType.UNSIGNED_BYTE, this.fboPixels);
        for (let i = 0; i < this.fboColorLen; i++) {
            this.fboColor[i] = 0;
            for (let j = 0; j < 4; j++) {
                this.fboColor[i] += this.fboPixels[i * 4 + j] * 2 ** (8 * (3 - j));
            }
            ;
            this.fboColorSet.add(this.fboColor[i]);
        }
        ;
        // 接收所有像素数据
        IndexGlobal.inst.detailMachine.statusPreview.onPixels(viewWidth, viewHeight, this.fboColor);
        // 接收所有颜色数据
        IndexGlobal.inst.detailMachine.statusPreview.onColorTable(this.fboColorSet);
        return;
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
            canvasWidth = Math.ceil((img.image.width + listImgDataInst.paddingRight + listImgDataInst.paddingLeft) / listImgDataInst.pixelWidth);
            canvasHeight = Math.ceil((img.image.height + listImgDataInst.paddingTop + listImgDataInst.paddingBottom) / listImgDataInst.pixelHeight);
        }
        ;
        return ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_HEIGHT]: MgrDomDefine.STYLE_WIDTH_PERCENTAGE_0,
                [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.CONFIG_TXT_BG_COLOR,
                // [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_NONE,
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
export default DomRightPreviewImgBeforeWebglPixels;

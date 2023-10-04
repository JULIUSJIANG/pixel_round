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
class DomRightPreviewImgSplit extends ReactComponentExtend {
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
        this.posPoint = new JWebglMathVector4();
        this.posA = new JWebglMathVector4();
        this.posB = new JWebglMathVector4();
        this.posC = new JWebglMathVector4();
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
        // 没分块完的不画
        if (IndexGlobal.inst.detailMachine.statusPreview.listImgPixelGroupAllNotEmpty.length == 0) {
            return;
        }
        ;
        // 清空画布
        this.jWebgl.useFbo(null);
        this.jWebgl.clear();
        // 计算视图尺寸
        let viewWidth = (img.assetsImg.image.width + listImgDataInst.paddingLeft + listImgDataInst.paddingRight);
        let viewHeight = (img.assetsImg.image.height + listImgDataInst.paddingBottom + listImgDataInst.paddingTop);
        // 帧缓冲区尺寸
        let fboWidth = Math.ceil(viewWidth / listImgDataInst.pixelWidth);
        let fboHeight = Math.ceil(viewHeight / listImgDataInst.pixelHeight);
        // 绘制 fbo
        this.initFbo(fboWidth, fboHeight);
        // 相机宽高
        let cameraWidth = fboWidth;
        let cameraHeight = fboHeight * IndexGlobal.inst.detailMachine.statusPreview.listImgPixelGroupAllNotEmpty.length;
        // 开始对所有的组进行绘制
        this.jWebgl.clear();
        for (let i = 0; i < IndexGlobal.inst.detailMachine.statusPreview.listImgPixelGroupAllNotEmpty.length; i++) {
            let idx = i;
            let listImgPixelGroupAllI = IndexGlobal.inst.detailMachine.statusPreview.listImgPixelGroupAllNotEmpty[idx];
            let yBase = (IndexGlobal.inst.detailMachine.statusPreview.listImgPixelGroupAllNotEmpty.length - idx - 1) * fboHeight;
            // 把分块绘制到帧缓冲区里面
            this.jWebgl.useFbo(this.fbo);
            this.jWebgl.clear();
            this.mat4V.setLookAt(fboWidth / 2, fboHeight / 2, 1, fboWidth / 2, fboHeight / 2, 0, 0, 1, 0);
            this.mat4P.setOrtho(-fboWidth / 2, fboWidth / 2, -fboHeight / 2, fboHeight / 2, 0, 2);
            JWebglMathMatrix4.multiplayMat4List(this.mat4P, this.mat4V, this.mat4M, this.jWebgl.mat4Mvp);
            this.jWebgl.programPoint.uMvp.fill(this.jWebgl.mat4Mvp);
            this.jWebgl.programPoint.uColor.fill(listImgPixelGroupAllI.colorObj.data01);
            this.jWebgl.programPoint.uSize.fill(1);
            for (let j = 0; j < listImgPixelGroupAllI.listPos.length; j += 2) {
                let x = listImgPixelGroupAllI.listPos[j + 0];
                let y = listImgPixelGroupAllI.listPos[j + 1];
                this.posPoint.elements[0] = x + 1 + listImgDataInst.paddingLeft;
                this.posPoint.elements[1] = y + 1 + listImgDataInst.paddingBottom;
                this.jWebgl.programPoint.add(this.posPoint);
            }
            ;
            this.jWebgl.programPoint.draw();
            // 把帧缓冲区内容作为图片绘制到画布上面
            this.jWebgl.useFbo(null);
            this.mat4V.setLookAt(cameraWidth / 2, cameraHeight / 2, 1, cameraWidth / 2, cameraHeight / 2, 0, 0, 1, 0);
            this.mat4P.setOrtho(-cameraWidth / 2, cameraWidth / 2, -cameraHeight / 2, cameraHeight / 2, 0, 2);
            JWebglMathMatrix4.multiplayMat4List(this.mat4P, this.mat4V, this.mat4M, this.jWebgl.mat4Mvp);
            this.jWebgl.programImg.uMvp.fill(this.jWebgl.mat4Mvp);
            this.jWebgl.programImg.uSampler.fillByFbo(this.fbo);
            this.posImg.elements[0] = fboWidth / 2;
            this.posImg.elements[1] = fboHeight / 2 + yBase;
            this.jWebgl.programImg.add(this.posImg, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, fboWidth, fboHeight);
            this.jWebgl.programImg.draw();
        }
        ;
        this.jWebgl.useFbo(null);
        this.mat4V.setLookAt(cameraWidth / 2, cameraHeight / 2, 1, cameraWidth / 2, cameraHeight / 2, 0, 0, 1, 0);
        this.mat4P.setOrtho(-cameraWidth / 2, cameraWidth / 2, -cameraHeight / 2, cameraHeight / 2, 0, 2);
        JWebglMathMatrix4.multiplayMat4List(this.mat4P, this.mat4V, this.mat4M, this.jWebgl.mat4Mvp);
        // 网格
        this.jWebgl.programLine.uMvp.fill(this.jWebgl.mat4Mvp);
        let colorGrid = JWebglColor.COLOR_BLACK;
        for (let i = 0; i <= cameraWidth; i++) {
            if (i != 0 && i != cameraWidth) {
                continue;
            }
            ;
            this.posFrom.elements[0] = i;
            this.posFrom.elements[1] = 0;
            this.posTo.elements[0] = i;
            this.posTo.elements[1] = cameraHeight;
            this.jWebgl.programLine.add(this.posFrom, colorGrid, this.posTo, colorGrid);
        }
        ;
        for (let i = 0; i < IndexGlobal.inst.detailMachine.statusPreview.listImgPixelGroupAllNotEmpty.length; i++) {
            for (let j = 0; j <= fboHeight; j++) {
                if (j != 0 && j != fboHeight) {
                    continue;
                }
                ;
                this.posFrom.elements[0] = 0;
                this.posFrom.elements[1] = i * fboHeight + j;
                this.posTo.elements[0] = fboWidth;
                this.posTo.elements[1] = i * fboHeight + j;
                this.jWebgl.programLine.add(this.posFrom, colorGrid, this.posTo, colorGrid);
            }
            ;
            this.jWebgl.programLine.draw();
        }
        ;
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
        if (this.finishedImg != null && 0 < IndexGlobal.inst.detailMachine.statusPreview.listImgPixelGroupAllNotEmpty.length) {
            let fboWidth = Math.ceil((img.image.width + listImgDataInst.paddingRight + listImgDataInst.paddingLeft) / listImgDataInst.pixelWidth);
            let fboHeight = Math.ceil((img.image.height + listImgDataInst.paddingTop + listImgDataInst.paddingBottom) / listImgDataInst.pixelHeight);
            let scale = IndexGlobal.PIXEL_TEX_TO_SCREEN;
            canvasWidth = fboWidth * scale;
            canvasHeight = fboHeight * IndexGlobal.inst.detailMachine.statusPreview.listImgPixelGroupAllNotEmpty.length * scale;
        }
        ;
        return ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_WIDTH]: MgrDomDefine.STYLE_WIDTH_PERCENTAGE_0,
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
export default DomRightPreviewImgSplit;

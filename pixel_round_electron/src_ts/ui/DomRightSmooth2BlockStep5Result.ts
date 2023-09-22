import IndexGlobal from "../IndexGlobal.js";
import NodeModules from "../NodeModules.js";
import JWebgl from "../common/JWebgl.js";
import JWebglEnum from "../common/JWebglEnum.js";
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

const Z_GRID = 0.1;

class DomRightSmooth2BlockStep5Result extends ReactComponentExtend <number> {
    /**
     * 3d canvas 引用器
     */
    canvasWebglRef = NodeModules.react.createRef();

    jWebgl: JWebgl;

    mat4M = new JWebglMathMatrix4();
    mat4V = new JWebglMathMatrix4();
    mat4P = new JWebglMathMatrix4();

    fboCurrent: JWebglFrameBuffer;
    fboSmooth: JWebglFrameBuffer;

    reactComponentExtendOnInit(): void {
        this.jWebgl = new JWebgl(this.canvasWebglRef.current);
        this.jWebgl.init();
        this.mat4M.setIdentity();
    }

    initFbo (width: number, height: number) {
        if (this.fboCurrent == null || this.fboCurrent.width != width || this.fboCurrent.height != height) {
            this.fboCurrent = this.jWebgl.getFbo (width, height);
            this.fboSmooth = this.jWebgl.getFbo (width, height);
        };
    }

    posImg = new JWebglMathVector4 ();
    
    posFrom = new JWebglMathVector4 (0, 0, Z_GRID);
    posTo = new JWebglMathVector4 (0, 0, Z_GRID);

    posPoint = new JWebglMathVector4 ();

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

        // 没分块完的不画
        if (IndexGlobal.inst.detailMachine.statusPreview.listImgPixelGroupAllNotEmpty.length == 0) {
            return;
        };

        // 计算视图尺寸
        let viewWidth = (img.assetsImg.image.width + listImgDataInst.paddingLeft + listImgDataInst.paddingRight);
        let viewHeight = (img.assetsImg.image.height + listImgDataInst.paddingBottom + listImgDataInst.paddingTop);

        // 帧缓冲区尺寸
        let fboWidth = Math.ceil (viewWidth / listImgDataInst.pixelWidth);
        let fboHeight = Math.ceil (viewHeight / listImgDataInst.pixelHeight);

        // 绘制 fbo
        this.initFbo (fboWidth, fboHeight);

        // 清空画布
        this.jWebgl.useFbo (this.fboCurrent);
        this.jWebgl.clear ();
        this.jWebgl.useFbo (null);
        this.jWebgl.clear ();

        for (let i = 0; i < IndexGlobal.inst.detailMachine.statusPreview.listImgPixelGroupAllNotEmpty.length; i++) {
            let idx = i;
            let listImgPixelGroupAllI = IndexGlobal.inst.detailMachine.statusPreview.listImgPixelGroupAllNotEmpty [idx];
            
            // 把分块绘制到帧缓冲区里面
            this.jWebgl.useFbo (this.fboCurrent);
            this.mat4V.setLookAt(
                fboWidth / 2, fboHeight / 2, 1,
                fboWidth / 2, fboHeight / 2, 0,
                0, 1, 0
            );
            this.mat4P.setOrtho (
                -fboWidth / 2, fboWidth / 2,
                -fboHeight / 2, fboHeight / 2,
                0, 2
            );
            JWebglMathMatrix4.multiplayMat4List (
                this.mat4P,
                this.mat4V,
                this.mat4M,
                this.jWebgl.mat4Mvp
            );
            this.jWebgl.programPoint.uMvp.fill (this.jWebgl.mat4Mvp);
            this.jWebgl.programPoint.uColor.fill (listImgPixelGroupAllI.colorObj.data01);
            this.jWebgl.programPoint.uSize.fill (1);
            for (let j = 0; j < listImgPixelGroupAllI.listPos.length; j += 2) {
                let x = listImgPixelGroupAllI.listPos [j + 0];
                let y = listImgPixelGroupAllI.listPos [j + 1];
                this.posPoint.elements [0] = x + 1;
                this.posPoint.elements [1] = y + 1;
                this.jWebgl.programPoint.add (this.posPoint);
            };
            this.jWebgl.programPoint.draw ();

            // 把分块内容绘制到平滑缓冲区里面
            this.jWebgl.useFbo (this.fboSmooth);
            this.jWebgl.clear ();
            this.mat4V.setLookAt (
                0, 0, 1,
                0, 0, 0,
                0, 1, 0
            );
            this.mat4P.setOrtho (
                -1, 1,
                -1, 1,
                0, 2
            );
            JWebglMathMatrix4.multiplayMat4List (
                this.mat4P,
                this.mat4V,
                this.mat4M,
                this.jWebgl.mat4Mvp
            );
            this.jWebgl.programImgDyeing.uMvp.fill (this.jWebgl.mat4Mvp);
            this.jWebgl.programImgDyeing.uSampler.fillByFbo (this.fboCurrent);
            this.jWebgl.programImgDyeing.uColor.fill (listImgPixelGroupAllI.colorObj.data01);
            this.jWebgl.programImgDyeing.add (
                JWebglMathVector4.centerO,
                JWebglMathVector4.axisZStart,
                JWebglMathVector4.axisYEnd,
                2,
                2
            );
            this.jWebgl.programImgDyeing.draw ();

            // 把平滑缓冲区内容绘制到画布中
            this.jWebgl.useFbo (null);
            this.jWebgl.programSmooth2.uMvp.fill (this.jWebgl.mat4Mvp);
            this.jWebgl.programSmooth2.uTextureMain.fillByFbo (this.fboSmooth);
            this.jWebgl.programSmooth2.uTextureSize.fill (fboWidth, fboHeight);
            this.posImg.elements [0] = 0;
            this.posImg.elements [1] = 0;
            this.posImg.elements [2] = i / IndexGlobal.inst.detailMachine.statusPreview.listImgPixelGroupAllNotEmpty.length;
            this.jWebgl.programSmooth2.add (
                this.posImg,
                JWebglMathVector4.axisZStart,
                JWebglMathVector4.axisYEnd,
                2,
                2
            );
            this.jWebgl.canvasWebglCtx.blendFunc (JWebglEnum.BlendFunc.ONE_MINUS_DST_ALPHA, JWebglEnum.BlendFunc.DST_ALPHA);
            this.jWebgl.programSmooth2.draw ();
            this.jWebgl.canvasWebglCtx.blendFunc (JWebglEnum.BlendFunc.SRC_ALPHA, JWebglEnum.BlendFunc.ONE_MINUS_SRC_ALPHA);
        };
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
        if (this.finishedImg != null && 0 < IndexGlobal.inst.detailMachine.statusPreview.listImgPixelGroupAllNotEmpty.length) {
            let fboWidth = Math.ceil ((img.image.width + listImgDataInst.paddingRight + listImgDataInst.paddingLeft) / listImgDataInst.pixelWidth);
            let fboHeight = Math.ceil ((img.image.height + listImgDataInst.paddingTop + listImgDataInst.paddingBottom) / listImgDataInst.pixelHeight);
            let scale = IndexGlobal.PIXEL_TEX_TO_SCREEN;
            canvasWidth = fboWidth * scale;
            canvasHeight = fboHeight * scale;
        };

        return ReactComponentExtend.instantiateTag (
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
        );
    }
}

export default DomRightSmooth2BlockStep5Result;
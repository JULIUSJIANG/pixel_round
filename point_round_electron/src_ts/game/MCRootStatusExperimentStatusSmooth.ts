import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import DomExperimentRightPreview from "../ui/DomExperimentRightPreview.js";
import MCRootStatusExperimentStatus from "./MCRootStatusExperimentStatus.js";
import TextureColor from "./TextureColor.js";
import SmoothMachine from "./SmoothMachine.js";
import JWebglFrameBuffer from "../common/JWebglFrameBuffer.js";
import JWebgl from "../common/JWebgl.js";
import JWebglMathMatrix4 from "../common/JWebglMathMatrix4.js";
import JWebglMathVector4 from "../common/JWebglMathVector4.js";
import objectPool from "../common/ObjectPool.js";
import DomImageSmooth from "../ui/DomImageSmooth.js";
import MCRootStatusExperiment from "./MCRootStatusExperiment.js";

export default class MCRootStatusExperimentStatusSmooth extends MCRootStatusExperimentStatus {

    constructor (machine: MCRootStatusExperiment, id: number) {
        super (machine, id);
        this.argsSmooth = objectPool.pop (DomImageSmooth.Args.poolType);
    }

    onEnter (): void {
        this.onImg (MgrData.inst.get (MgrDataItem.EXP_CURRENT_IMG));
    }

    onCreate (): void {
        this.relMachine.enter (this.relMachine.statusCreate);
    }

    /**
     * 当前控制的图片
     */
    imgMachine: SmoothMachine;

    onImg (id: number): void {
        MgrData.inst.set (MgrDataItem.EXP_CURRENT_IMG, id);
        let rec = this.imgMachine;
        this.imgMachine = new SmoothMachine (this, id);
        if (rec) {
            rec.onDestroy ();
        };
        this.imgMachine.onCreate ();
    }

    onRender (): ReactComponentExtendInstance {
        return ReactComponentExtend.instantiateComponent (DomExperimentRightPreview, null);
    }

    /**
     * 平滑参数
     */
    argsSmooth: DomImageSmooth.Args;

    /**
     * 源图宽度
     */
    imgWidth: number;
    /**
     * 源图高度
     */
    imgHeight: number;
    /**
     * 源图宽度 + 内边距
     */
    imgWidthWithPadding: number;
    /**
     * 源图高度 + 内边距
     */
    imgHeightWidthPadding: number;
    /**
     * 展示裁切内容时候图片宽度
     */
    imgWidthShowAll: number;
    /**
     * 展示裁切内容时候图片高度
     */
    imgHeightShowAll: number;
    /**
     * (源图宽度 + 内边距) + 缩放
     */
    textureWidth: number = 1;
    /**
     * (源图高度 + 内边距) + 缩放
     */
    textureHeight: number = 1;

    /**
     * 每四个数字代表一个颜色
     */
    binXYToRgbaUint = new Uint8Array (1);
    binXYToRgbaUintSize = 4;

    /**
     * 每个数字代表一个颜色
     */
    binXYToColorUint = new Uint32Array (1);
    binXYToColorUintSize = 1;

    /**
     * 所有颜色
     */
    listColor = new Array <TextureColor> ();
    /**
     * 标识到具体颜色的映射
     */
    mapIdToColor = new Map <number, TextureColor> ();

    /**
     * 把附带内边距的图片绘制到一个帧缓冲区里面
     * @param jWebgl 
     * @param fbo 
     */
    drawImgPadding (jWebgl: JWebgl, fbo: JWebglFrameBuffer) {
        jWebgl.useFbo (fbo);
        jWebgl.clear ();

        jWebgl.mat4M.setIdentity ();
        jWebgl.mat4V.setLookAt(
            this.imgWidthWithPadding / 2, this.imgHeightWidthPadding / 2, 1,
            this.imgWidthWithPadding / 2, this.imgHeightWidthPadding / 2, 0,
            0, 1, 0
        );
        jWebgl.mat4P.setOrtho (
            -this.imgWidthWithPadding / 2, this.imgWidthWithPadding / 2,
            -this.imgHeightWidthPadding / 2, this.imgHeightWidthPadding / 2,
            0, 2
        );
        JWebglMathMatrix4.multiplayMat4List (
            jWebgl.mat4P,
            jWebgl.mat4V,
            jWebgl.mat4M,
            jWebgl.mat4Mvp
        );

        // 图片
        jWebgl.programImg.uMvp.fill (jWebgl.mat4Mvp);
        jWebgl.programImg.uTexture.fillByImg (jWebgl.getImg (this.imgMachine.dataInst.dataOrigin));
        let posImg = JWebglMathVector4.create (this.imgWidth / 2 + this.imgMachine.dataInst.paddingLeft, this.imgHeight / 2 + this.imgMachine.dataInst.paddingBottom, 0);
        jWebgl.programImg.add (
            posImg,
            JWebglMathVector4.axisZStart,
            JWebglMathVector4.axisYEnd,
            this.imgWidth,
            this.imgHeight
        );
        objectPool.push (posImg);
        jWebgl.programImg.draw ();
    }
}
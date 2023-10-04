import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import DomRightPreview from "../ui/DomRightPreview.js";
import DetailMachineStatus from "./DetailMachineStatus.js";
import ImgMachine from "./ImgMachine.js";
import JWebglMathMatrix4 from "../common/JWebglMathMatrix4.js";
import JWebglMathVector4 from "../common/JWebglMathVector4.js";
export default class DetailMachineStatusPreview extends DetailMachineStatus {
    constructor(machine, id) {
        super(machine, id);
        /**
         * (源图宽度 + 内边距) + 缩放
         */
        this.textureWidth = 1;
        /**
         * (源图高度 + 内边距) + 缩放
         */
        this.textureHeight = 1;
        /**
         * 每四个数字代表一个颜色
         */
        this.binXYToRgbaUint = new Uint8Array(1);
        this.binXYToRgbaUintSize = 4;
        /**
         * 每个数字代表一个颜色
         */
        this.binXYToColorUint = new Uint32Array(1);
        this.binXYToColorUintSize = 1;
        /**
         * 所有颜色
         */
        this.listColor = new Array();
        /**
         * 标识到具体颜色的映射
         */
        this.mapIdToColor = new Map();
    }
    onEnter() {
        this.onImg(MgrData.inst.get(MgrDataItem.CURRENT_IMG));
    }
    onCreate() {
        this.relMachine.enter(this.relMachine.statusCreate);
    }
    onImg(id) {
        MgrData.inst.set(MgrDataItem.CURRENT_IMG, id);
        let rec = this.imgMachine;
        this.imgMachine = new ImgMachine(this, id);
        if (rec) {
            rec.onDestroy();
        }
        ;
        this.imgMachine.onCreate();
    }
    onRender() {
        return ReactComponentExtend.instantiateComponent(DomRightPreview, null);
    }
    /**
     * 把附带内边距的图片绘制到一个帧缓冲区里面
     * @param jWebgl
     * @param fbo
     */
    drawImgPadding(jWebgl, fbo) {
        jWebgl.useFbo(fbo);
        jWebgl.clear();
        jWebgl.mat4M.setIdentity();
        jWebgl.mat4V.setLookAt(this.imgWidthWithPadding / 2, this.imgHeightWidthPadding / 2, 1, this.imgWidthWithPadding / 2, this.imgHeightWidthPadding / 2, 0, 0, 1, 0);
        jWebgl.mat4P.setOrtho(-this.imgWidthWithPadding / 2, this.imgWidthWithPadding / 2, -this.imgHeightWidthPadding / 2, this.imgHeightWidthPadding / 2, 0, 2);
        JWebglMathMatrix4.multiplayMat4List(jWebgl.mat4P, jWebgl.mat4V, jWebgl.mat4M, jWebgl.mat4Mvp);
        // 图片
        jWebgl.programImg.uMvp.fill(jWebgl.mat4Mvp);
        jWebgl.programImg.uSampler.fillByImg(jWebgl.getImg(this.imgMachine.dataInst.dataOrigin));
        let posImg = JWebglMathVector4.create(this.imgWidth / 2 + this.imgMachine.dataInst.paddingLeft, this.imgHeight / 2 + this.imgMachine.dataInst.paddingBottom, 0);
        jWebgl.programImg.add(posImg, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, this.imgWidth, this.imgHeight);
        jWebgl.programImg.draw();
    }
    /**
     * 刷新角平滑的处理
     */
    refreshCorner() {
    }
}

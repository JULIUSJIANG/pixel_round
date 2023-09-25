import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import DomRightPreview from "../ui/DomRightPreview.js";
import DetailMachineStatus from "./DetailMachineStatus.js";
import ImgMachine from "./ImgMachine.js";
import CornerTypeRSSide from "./CornerTypeRSSide.js";
import JWebglMathMatrix4 from "../common/JWebglMathMatrix4.js";
import JWebglMathVector4 from "../common/JWebglMathVector4.js";
export default class DetailMachineStatusPreview extends DetailMachineStatus {
    constructor(machine, id) {
        super(machine, id);
        /**
         * (源图宽度 + 内边距) + 缩放
         */
        this.imgWidthPaddingScaled = 1;
        /**
         * (源图高度 + 内边距) + 缩放
         */
        this.imgHeightPaddingScaled = 1;
        /**
         * 每四个数字代表一个颜色
         */
        this.binXYToRgba = new Uint8Array(1);
        this.binXYToRgbaSize = 4;
        /**
         * 每个数字代表一个颜色
         */
        this.binXYToColor = new Uint32Array(1);
        this.binXYToColorSize = 1;
        /**
         * 所有颜色
         */
        this.listColor = new Array();
        /**
         * 标识到具体颜色的映射
         */
        this.mapIdToColor = new Map();
        /**
         * 存储分块信息的集合，与位置相关
         */
        this.listXYToTextureGroup = new Array();
        /**
         * 仅关注类型
         */
        this.listTextureGroup = new Array();
        /**
         * 仅关注类型 - 不为空
         */
        this.listTextureGroupNotEmpty = new Array();
        /**
         * 所有像素的记录
         */
        this.listXYToTexturePixel = new Array();
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
     * 获取颜色
     * @param x
     * @param y
     * @returns
     */
    getColor(x, y) {
        let idx = y * this.imgWidthPaddingScaled + x;
        let colorId;
        if (x < 0 || this.imgWidthPaddingScaled <= x || y < 0 || this.imgHeightPaddingScaled <= y) {
            colorId = 0;
        }
        else {
            let idx = y * this.imgWidthPaddingScaled + x;
            colorId = this.binXYToColor[idx];
        }
        ;
        return this.mapIdToColor.get(colorId);
    }
    /**
     * 获取像素记录
     * @param x
     * @param y
     * @returns
     */
    getTexturePixel(x, y) {
        if (x < 0 || this.imgWidthPaddingScaled <= x || y < 0 || this.imgHeightPaddingScaled <= y) {
            return null;
        }
        ;
        let idx = y * this.imgWidthPaddingScaled + x;
        return this.listXYToTexturePixel[idx];
    }
    /**
     * 获取角的裁切类型
     * @param posCurrentX
     * @param posCurrentY
     */
    getCornerTypeBoth(posCurrentX, posCurrentY, vecForwardX, vecForwardY) {
        let vecRightX = vecForwardY;
        let vecRightY = -vecForwardX;
        let rsSideLeft = this.getCornerTypeSide(posCurrentX, posCurrentY, vecForwardX, vecForwardY, vecRightX, vecRightY);
        let rsSideRight = this.getCornerTypeSide(posCurrentX, posCurrentY, vecForwardX, vecForwardY, -vecRightX, -vecRightY);
        return rsSideLeft.onRight(rsSideRight);
    }
    /**
     * 获取角的裁切类型
     * @param posCurrentX
     * @param posCurrentY
     */
    getCornerTypeSide(posCurrentX, posCurrentY, vecForwardX, vecForwardY, vecRightX, vecRightY) {
        // 位置
        let posForwardX = posCurrentX + vecForwardX * 2.0;
        let posForwardY = posCurrentY + vecForwardY * 2.0;
        let posBackX = posCurrentX - vecForwardX * 2.0;
        let posBackY = posCurrentY - vecForwardY * 2.0;
        let posRightX = posCurrentX + vecRightX * 2.0;
        let posRightY = posCurrentY + vecRightY * 2.0;
        let posLeftX = posCurrentX - vecRightX * 2.0;
        let posLeftY = posCurrentY - vecRightY * 2.0;
        let posRFX = posCurrentX + vecRightX + vecForwardX;
        let posRFY = posCurrentY + vecRightY + vecForwardY;
        let posLFX = posCurrentX - vecRightX + vecForwardX;
        let posLFY = posCurrentY - vecRightY + vecForwardY;
        let posRBX = posCurrentX + vecRightX - vecForwardX;
        let posRBY = posCurrentY + vecRightY - vecForwardY;
        let posLBX = posCurrentX - vecRightX - vecForwardX;
        let posLBY = posCurrentY - vecRightY - vecForwardY;
        // 颜色
        let colorCurrent = this.getColor(posCurrentX, posCurrentY);
        let colorForward = this.getColor(posForwardX, posForwardY);
        let colorBack = this.getColor(posBackX, posBackY);
        let colorRight = this.getColor(posRightX, posRightY);
        let colorLeft = this.getColor(posLeftX, posLeftY);
        let colorRF = this.getColor(posRFX, posRFY);
        let colorLF = this.getColor(posLFX, posLFY);
        let colorRB = this.getColor(posRBX, posRBY);
        let colorLB = this.getColor(posLBX, posLBY);
        // 左前颜色与中心颜色一致，不用平滑
        if (colorLF == colorCurrent) {
            return CornerTypeRSSide.none;
        }
        // 颜色不一致，保留可能
        else {
            // 左前以及右前颜色一致，前方平滑，但是也有侧方平滑的可能
            if (colorLF == colorRF) {
                // 左方以及右前颜色一致，侧方平滑
                if (colorLeft == colorRF) {
                    return CornerTypeRSSide.side;
                }
                // 否则只是前方平滑
                else {
                    return CornerTypeRSSide.forward;
                }
                ;
            }
            // 否则不用平滑
            else {
                return CornerTypeRSSide.none;
            }
            ;
        }
        ;
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
        jWebgl.mat4V.setLookAt(this.imgWidthPadding / 2, this.imgHeightPadding / 2, 1, this.imgWidthPadding / 2, this.imgHeightPadding / 2, 0, 0, 1, 0);
        jWebgl.mat4P.setOrtho(-this.imgWidthPadding / 2, this.imgWidthPadding / 2, -this.imgHeightPadding / 2, this.imgHeightPadding / 2, 0, 2);
        JWebglMathMatrix4.multiplayMat4List(jWebgl.mat4P, jWebgl.mat4V, jWebgl.mat4M, jWebgl.mat4Mvp);
        // 图片
        jWebgl.programImg.uMvp.fill(jWebgl.mat4Mvp);
        jWebgl.programImg.uSampler.fillByImg(jWebgl.getImg(this.imgMachine.dataInst.dataOrigin));
        let posImg = JWebglMathVector4.create(this.imgWidth / 2 + this.imgMachine.dataInst.paddingLeft, this.imgHeight / 2 + this.imgMachine.dataInst.paddingBottom, 0);
        jWebgl.programImg.add(posImg, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, this.imgWidth, this.imgHeight);
        jWebgl.programImg.draw();
    }
}

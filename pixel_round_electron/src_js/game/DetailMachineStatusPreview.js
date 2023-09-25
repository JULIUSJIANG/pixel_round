import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import DomRightPreview from "../ui/DomRightPreview.js";
import DetailMachineStatus from "./DetailMachineStatus.js";
import ImgMachine from "./ImgMachine.js";
import TexturePixel from "./TexturePixel.js";
import CornerTypeRSSide from "./CornerTypeRSSide.js";
import JWebglMathMatrix4 from "../common/JWebglMathMatrix4.js";
import JWebglMathVector4 from "../common/JWebglMathVector4.js";
import CornerTypeRSBoth from "./CornerTypeRSBoth.js";
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
        let posForwardX = posCurrentX + vecForwardX;
        let posForwardY = posCurrentY + vecForwardY * 2.0;
        let posBackX = posCurrentX - vecForwardX;
        let posBackY = posCurrentY - vecForwardY;
        let posRightX = posCurrentX + vecRightX;
        let posRightY = posCurrentY + vecRightY;
        let posLeftX = posCurrentX - vecRightX;
        let posLeftY = posCurrentY - vecRightY;
        let posRFX = posCurrentX + vecRightX / 2 + vecForwardX / 2;
        let posRFY = posCurrentY + vecRightY / 2 + vecForwardY / 2;
        let posLFX = posCurrentX - vecRightX / 2 + vecForwardX / 2;
        let posLFY = posCurrentY - vecRightY / 2 + vecForwardY / 2;
        let posRBX = posCurrentX + vecRightX / 2 - vecForwardX / 2;
        let posRBY = posCurrentY + vecRightY / 2 - vecForwardY / 2;
        let posLBX = posCurrentX - vecRightX / 2 - vecForwardX / 2;
        let posLBY = posCurrentY - vecRightY / 2 - vecForwardY / 2;
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
    /**
     * 刷新角平滑的处理
     */
    refreshCorner() {
    }
    /**
     * 确定各个角的基准平滑类型
     */
    step1CornerBase() {
        for (let x = 0; x < this.imgWidthPaddingScaled; x++) {
            for (let y = 0; y < this.imgHeightPaddingScaled; y++) {
                // 索引
                let idx = y * this.imgWidthPaddingScaled + x;
                let texturePixel = this.listXYToTexturePixel[idx];
                // 确定平滑方向
                for (let i = 0; i < TexturePixel.listCornerX.length; i++) {
                    let listCornerXI = TexturePixel.listCornerX[i];
                    for (let j = 0; j < TexturePixel.listCornerY.length; j++) {
                        let listCornerYJ = TexturePixel.listCornerY[j];
                        let corner = TexturePixel.getCorner(texturePixel, listCornerXI, listCornerYJ);
                        corner.rsBoth = this.getCornerTypeBoth(x, y, listCornerXI, listCornerYJ);
                    }
                    ;
                }
                ;
            }
            ;
        }
        ;
    }
    /**
     * 修复对角交叉的平滑问题
     */
    step2FixX() {
        for (let x = 0; x < this.imgWidthPaddingScaled; x++) {
            for (let y = 0; y < this.imgHeightPaddingScaled; y++) {
                let recCurrent = this.getTexturePixel(x, y);
                let recRight = this.getTexturePixel(x + 1, y);
                let recTop = this.getTexturePixel(x, y + 1);
                let recRT = this.getTexturePixel(x + 1, y + 1);
                // 越界，忽略
                if (recRight == null || recTop == null) {
                    continue;
                }
                ;
                // 非交叉情况，忽略
                if (recCurrent.cornerRT.rsBoth == CornerTypeRSBoth.none) {
                    continue;
                }
                ;
                if (recRT.cornerLB.rsBoth == CornerTypeRSBoth.none) {
                    continue;
                }
                ;
                if (recRight.cornerLT.rsBoth == CornerTypeRSBoth.none) {
                    continue;
                }
                ;
                if (recTop.cornerRB.rsBoth == CornerTypeRSBoth.none) {
                    continue;
                }
                ;
                let colorCurrent = this.getColor(x, y);
                let colorRight = this.getColor(x + 1, y);
                let smoothFirst = this.imgMachine.getColorFirst(colorCurrent.id, colorRight.id);
                if (smoothFirst) {
                    recCurrent.cornerRT.rsBoth = CornerTypeRSBoth.none;
                    recRT.cornerLB.rsBoth = CornerTypeRSBoth.none;
                }
                else {
                    recRight.cornerLT.rsBoth = CornerTypeRSBoth.none;
                    recTop.cornerRB.rsBoth = CornerTypeRSBoth.none;
                }
                ;
            }
            ;
        }
        ;
    }
    /**
     * 补充一些平滑，以让形状看起来自然
     */
    step3Addition() {
        for (let x = 0; x < this.imgWidthPaddingScaled; x++) {
            for (let y = 0; y < this.imgHeightPaddingScaled; y++) {
                // 索引
                let idx = y * this.imgWidthPaddingScaled + x;
                let texturePixel = this.listXYToTexturePixel[idx];
                // 确定平滑方向
                for (let i = 0; i < TexturePixel.listCornerX.length; i++) {
                    let listCornerXI = TexturePixel.listCornerX[i];
                    for (let j = 0; j < TexturePixel.listCornerY.length; j++) {
                        let listCornerYJ = TexturePixel.listCornerY[j];
                        let corner = TexturePixel.getCorner(texturePixel, listCornerXI, listCornerYJ);
                        corner.rsBoth = this.getAdditionSmoothBoth(x, y, listCornerXI, listCornerYJ);
                    }
                    ;
                }
                ;
            }
            ;
        }
        ;
    }
    /**
     * 考虑到线条连贯所以才增加的平滑
     * @param x
     * @param y
     * @param vecForwardX
     * @param vecForwardY
     */
    getAdditionSmoothBoth(posCurrentX, posCurrentY, vecForwardX, vecForwardY) {
        let textureCurrent = this.getTexturePixel(posCurrentX, posCurrentY);
        let cornerCurrent = TexturePixel.getCorner(textureCurrent, vecForwardX, vecForwardY);
        // 本身已有平滑认为，那么不进行新增
        if (cornerCurrent.rsBoth != CornerTypeRSBoth.none) {
            return cornerCurrent.rsBoth;
        }
        ;
        let vecRightX = vecForwardY;
        let vecRightY = -vecForwardX;
        // 左侧许可
        let ableLeft = this.getAdditionSmoothAbleSide(posCurrentX, posCurrentY, vecForwardX, vecForwardY, vecRightX, vecRightY);
        // 右侧许可
        let ableRight = this.getAdditionSmoothAbleSide(posCurrentX, posCurrentY, vecForwardX, vecForwardY, -vecRightX, -vecRightY);
        if (posCurrentX == 3 && posCurrentY == 14 && vecForwardX == 1 && vecForwardY == -1) {
            console.log(`ableLeft[${ableLeft}] ableRight[${ableRight}]`);
        }
        ;
        // 其中一个不许可，都立即终止
        if (!ableLeft || !ableRight) {
            return cornerCurrent.rsBoth;
        }
        ;
        // 左侧需要平滑兼容
        let smoothLeft = this.getAdditionSmoothSide(posCurrentX, posCurrentY, vecForwardX, vecForwardY, vecRightX, vecRightY);
        // 右侧需要平滑兼容
        let smoothRight = this.getAdditionSmoothSide(posCurrentX, posCurrentY, vecForwardX, vecForwardY, -vecRightX, -vecRightY);
        // 同时兼容俩边
        if (smoothLeft && smoothRight) {
            return CornerTypeRSBoth.forward;
        }
        ;
        // 兼容左边
        if (smoothLeft) {
            return CornerTypeRSBoth.left;
        }
        ;
        // 兼容右边
        if (smoothRight) {
            return CornerTypeRSBoth.right;
        }
        ;
        // 否则原样返回
        return cornerCurrent.rsBoth;
    }
    /**
     * 获取额外平滑的许可
     * @param posCurrentX
     * @param posCurrentY
     * @param vecForwardX
     * @param vecForwardY
     * @param vecRightX
     * @param vecRightY
     * @returns
     */
    getAdditionSmoothAbleSide(posCurrentX, posCurrentY, vecForwardX, vecForwardY, vecRightX, vecRightY) {
        // 当前位置的记录
        let textureCurrent = this.getTexturePixel(posCurrentX, posCurrentY);
        let cornerRightType = TexturePixel.getCorner(textureCurrent, vecRightX, vecRightY).rsBoth.namedByAxis(vecForwardX, vecForwardY, vecRightX, vecRightY);
        if (cornerRightType == CornerTypeRSBoth.left || cornerRightType == CornerTypeRSBoth.bothSide) {
            return false;
        }
        ;
        let cornerLeftType = TexturePixel.getCorner(textureCurrent, -vecRightX, -vecRightY).rsBoth.namedByAxis(vecForwardX, vecForwardY, vecRightX, vecRightY);
        if (cornerLeftType == CornerTypeRSBoth.right || cornerLeftType == CornerTypeRSBoth.bothSide) {
            return false;
        }
        ;
        // 右上方位置
        let posRFX = posCurrentX + vecRightX / 2 + vecForwardX / 2;
        let posRFY = posCurrentY + vecRightY / 2 + vecForwardY / 2;
        // 右上方位置的记录
        let textureRF = this.getTexturePixel(posRFX, posRFY);
        // 越界，那么不新增平滑
        if (!textureRF) {
            return false;
        }
        ;
        // 右前方的左角有平滑任务，自己不新增
        if (TexturePixel.getCorner(textureRF, -vecRightX, -vecRightY).rsBoth != CornerTypeRSBoth.none) {
            return false;
        }
        ;
        return true;
    }
    /**
     * 考虑到线条连贯所以才增加的平滑
     * @param posCurrentX
     * @param posCurrentY
     * @param vecForwardX
     * @param vecForwardY
     * @param vecRightX
     * @param vecRightY
     */
    getAdditionSmoothSide(posCurrentX, posCurrentY, vecForwardX, vecForwardY, vecRightX, vecRightY) {
        // 当前记录
        let textureCurrent = this.getTexturePixel(posCurrentX, posCurrentY);
        // 右上方位置
        let posRFX = posCurrentX + vecRightX / 2 + vecForwardX / 2;
        let posRFY = posCurrentY + vecRightY / 2 + vecForwardY / 2;
        // 右上方的记录
        let textureRF = this.getTexturePixel(posRFX, posRFY);
        // 右上方在边界出产生了一个点，那么试着平滑它
        let rfOriginSmoothBoth = TexturePixel.getCorner(textureRF, -vecForwardX, -vecForwardY).rsBoth;
        let rfAxisSmoothBoth = rfOriginSmoothBoth.namedByAxis(vecForwardX, vecForwardY, vecRightX, vecRightY);
        if (rfAxisSmoothBoth == CornerTypeRSBoth.forward || rfAxisSmoothBoth == CornerTypeRSBoth.left) {
            return true;
        }
        ;
        return false;
    }
}

import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import DomRightPreview from "../ui/DomRightPreview.js";
import DetailMachineStatus from "./DetailMachineStatus.js";
import TextureColor from "./TextureColor.js";
import ImgMachine from "./ImgMachine.js";
import TextureGroup from "./TextureGroup.js";
import TexturePixel from "./TexturePixel.js";
import DetailMachine from "./DetailMachine.js";
import CornerTypeRSSide from "./CornerTypeRSSide.js";
import JWebglFrameBuffer from "../common/JWebglFrameBuffer.js";
import JWebgl from "../common/JWebgl.js";
import JWebglMathMatrix4 from "../common/JWebglMathMatrix4.js";
import JWebglMathVector4 from "../common/JWebglMathVector4.js";
import CornerTypeRSBoth from "./CornerTypeRSBoth.js";

export default class DetailMachineStatusPreview extends DetailMachineStatus {

    constructor (machine: DetailMachine, id: number) {
        super (machine, id);
    }

    onEnter (): void {
        this.onImg (MgrData.inst.get (MgrDataItem.CURRENT_IMG));
    }

    onCreate (): void {
        this.relMachine.enter (this.relMachine.statusCreate);
    }

    /**
     * 当前控制的图片
     */
    imgMachine: ImgMachine;

    onImg (id: number): void {
        MgrData.inst.set (MgrDataItem.CURRENT_IMG, id);
        let rec = this.imgMachine;
        this.imgMachine = new ImgMachine (this, id);
        if (rec) {
            rec.onDestroy ();
        };
        this.imgMachine.onCreate ();
    }

    onRender (): ReactComponentExtendInstance {
        return ReactComponentExtend.instantiateComponent (DomRightPreview, null);
    }

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
    imgWidthPadding: number;
    /**
     * 源图高度 + 内边距
     */
    imgHeightPadding: number;
    /**
     * (源图宽度 + 内边距) + 缩放
     */
    imgWidthPaddingScaled: number = 1;
    /**
     * (源图高度 + 内边距) + 缩放
     */
    imgHeightPaddingScaled: number = 1;
    /**
     * 展示裁切内容时候图片宽度
     */
    imgWidthAll: number;
    /**
     * 展示裁切内容时候图片高度
     */
    imgHeightAll: number;

    /**
     * 每四个数字代表一个颜色
     */
    binXYToRgba = new Uint8Array (1);
    binXYToRgbaSize = 4;

    /**
     * 每个数字代表一个颜色
     */
    binXYToColor = new Uint32Array (1);
    binXYToColorSize = 1;

    /**
     * 所有颜色
     */
    listColor = new Array <TextureColor> ();
    /**
     * 标识到具体颜色的映射
     */
    mapIdToColor = new Map <number, TextureColor> ();

    /**
     * 存储分块信息的集合，与位置相关
     */
    listXYToTextureGroup = new Array <TextureGroup> ();
    /**
     * 仅关注类型
     */
    listTextureGroup = new Array <TextureGroup> ();
    /**
     * 仅关注类型 - 不为空
     */
    listTextureGroupNotEmpty = new Array <TextureGroup> ();

    /**
     * 所有像素的记录
     */
    listXYToTexturePixel = new Array <TexturePixel> ();

    /**
     * 获取颜色
     * @param x 
     * @param y 
     * @returns 
     */
    getColor (
        x: number,
        y: number
    )
    {
        let colorId: number;
        if (x < 0 || this.imgWidthPaddingScaled <= x || y < 0 || this.imgHeightPaddingScaled <= y) {
            colorId = 0;
        }
        else {
            let idx = y * this.imgWidthPaddingScaled + x;
            colorId = this.binXYToColor [idx]; 
        };
        return this.mapIdToColor.get (colorId);
    }

    /**
     * 获取像素记录
     * @param x 
     * @param y 
     * @returns 
     */
    getTexturePixel (
        x: number,
        y: number
    )
    {
        if (x < 0 || this.imgWidthPaddingScaled <= x || y < 0 || this.imgHeightPaddingScaled <= y) {
            return null;
        };
        let idx = y * this.imgWidthPaddingScaled + x;
        return this.listXYToTexturePixel [idx];
    }

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
            this.imgWidthPadding / 2, this.imgHeightPadding / 2, 1,
            this.imgWidthPadding / 2, this.imgHeightPadding / 2, 0,
            0, 1, 0
        );
        jWebgl.mat4P.setOrtho (
            -this.imgWidthPadding / 2, this.imgWidthPadding / 2,
            -this.imgHeightPadding / 2, this.imgHeightPadding / 2,
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
        jWebgl.programImg.uSampler.fillByImg (jWebgl.getImg (this.imgMachine.dataInst.dataOrigin));
        let posImg = JWebglMathVector4.create (this.imgWidth / 2 + this.imgMachine.dataInst.paddingLeft, this.imgHeight / 2 + this.imgMachine.dataInst.paddingBottom, 0);
        jWebgl.programImg.add (
            posImg,
            JWebglMathVector4.axisZStart,
            JWebglMathVector4.axisYEnd,
            this.imgWidth,
            this.imgHeight
        );
        jWebgl.programImg.draw ();
    }

    /**
     * 刷新角平滑的处理
     */
    refreshCorner () {

    }

    /**
     * 确定各个角的基准平滑类型
     */
    step1CornerBase () {
        for (let x = 0; x < this.imgWidthPaddingScaled; x++) {
            for (let y = 0; y < this.imgHeightPaddingScaled; y++) {
                // 索引
                let idx = y * this.imgWidthPaddingScaled + x;
                let texturePixel = this.listXYToTexturePixel [idx];

                // 确定平滑方向
                for (let i = 0; i < TexturePixel.listCornerX.length; i++) {
                    let listCornerXI = TexturePixel.listCornerX [i];
                    for (let j = 0; j < TexturePixel.listCornerY.length; j++) {
                        let listCornerYJ = TexturePixel.listCornerY [j];
                        let corner = TexturePixel.getCorner (texturePixel, listCornerXI, listCornerYJ);
                        corner.rsBoth = this.step1GetCornerTypeBoth (x, y, listCornerXI, listCornerYJ);
                    };
                };
            };
        };
    }

    /**
     * 获取角的裁切类型
     * @param posCurrentX 
     * @param posCurrentY 
     */
    step1GetCornerTypeBoth (
        posCurrentX: number, 
        posCurrentY: number, 
        
        vecForwardX: number,
        vecForwardY: number
    )
    {
        let vecRightX = vecForwardY;
        let vecRightY = -vecForwardX;

        let rsSideLeft = this.step1GetCornerTypeSide (
            posCurrentX,
            posCurrentY,

            vecForwardX,
            vecForwardY,

            vecRightX,
            vecRightY
        );
        let rsSideRight = this.step1GetCornerTypeSide (
            posCurrentX,
            posCurrentY,

            vecForwardX,
            vecForwardY,

            - vecRightX,
            - vecRightY
        );
        return rsSideLeft.onRight (rsSideRight);
    }

    /**
     * 获取角的裁切类型
     * @param posCurrentX 
     * @param posCurrentY 
     */
    step1GetCornerTypeSide (
        posCurrentX: number, 
        posCurrentY: number, 
        
        vecForwardX: number,
        vecForwardY: number,

        vecRightX: number,
        vecRightY: number
    ) 
    {
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
        let colorCurrent = this.getColor (posCurrentX, posCurrentY);
        let colorForward = this.getColor (posForwardX, posForwardY);
        let colorBack = this.getColor (posBackX, posBackY);
        let colorRight = this.getColor (posRightX, posRightY);
        let colorLeft = this.getColor (posLeftX, posLeftY);
        let colorRF = this.getColor (posRFX, posRFY);
        let colorLF = this.getColor (posLFX, posLFY);
        let colorRB = this.getColor (posRBX, posRBY);
        let colorLB = this.getColor (posLBX, posLBY);

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
                };
            }
            // 否则不用平滑
            else {
                return CornerTypeRSSide.none;
            };
        };
    }

    /**
     * 修复对角交叉的平滑问题
     */
    step2FixX () {
        for (let x = 0; x < this.imgWidthPaddingScaled; x++) {
            for (let y = 0; y < this.imgHeightPaddingScaled; y++) {
                let recCurrent = this.getTexturePixel (x, y);
                let recRight = this.getTexturePixel (x + 1, y);
                let recTop = this.getTexturePixel (x, y + 1);
                let recRT = this.getTexturePixel (x + 1, y + 1);
                // 越界，忽略
                if (recRight == null || recTop == null) {
                    continue;
                };
                // 非交叉情况，忽略
                if (recCurrent.cornerRT.rsBoth == CornerTypeRSBoth.none) {
                    continue;
                };
                if (recRT.cornerLB.rsBoth == CornerTypeRSBoth.none) {
                    continue;
                };
                if (recRight.cornerLT.rsBoth == CornerTypeRSBoth.none) {
                    continue;
                };
                if (recTop.cornerRB.rsBoth == CornerTypeRSBoth.none) {
                    continue;
                };
                let colorCurrent = this.getColor (x, y);
                let colorRight = this.getColor (x + 1, y);
                let smoothFirst = this.imgMachine.getColorFirst (colorCurrent.id, colorRight.id);
                if (smoothFirst) {
                    recCurrent.cornerRT.rsBoth = CornerTypeRSBoth.none;
                    recRT.cornerLB.rsBoth = CornerTypeRSBoth.none;
                }
                else {
                    recRight.cornerLT.rsBoth = CornerTypeRSBoth.none;
                    recTop.cornerRB.rsBoth = CornerTypeRSBoth.none;
                };
            };
        };
    }

    /**
     * 修复端点问题
     */
    step3Point () {
        for (let x = 0; x < this.imgWidthPaddingScaled; x++) {
            for (let y = 0; y < this.imgHeightPaddingScaled; y++) {
                let rec = this.getTexturePixel (x, y);
                let bothLT = rec.cornerLT.rsBoth;
                let bothRT = rec.cornerRT.rsBoth;
                let bothRB = rec.cornerRB.rsBoth;
                let bothLB = rec.cornerLB.rsBoth;
                // 考察上方向
                if (this.step3CheckSurround (x, y, 0, 1)) {
                    bothLT = CornerTypeRSBoth.forwardHalf;
                    bothRT = CornerTypeRSBoth.forwardHalf;
                };
                // 考察右方向
                if (this.step3CheckSurround (x, y, 1, 0)) {
                    bothRT = CornerTypeRSBoth.forwardHalf;
                    bothRB = CornerTypeRSBoth.forwardHalf;
                };
                // 考察下方向
                if (this.step3CheckSurround (x, y, 0, - 1)) {
                    bothRB = CornerTypeRSBoth.forwardHalf;
                    bothLB = CornerTypeRSBoth.forwardHalf;
                };
                // 考察左方向
                if (this.step3CheckSurround (x, y, -1, 0)) {
                    bothLB = CornerTypeRSBoth.forwardHalf;
                    bothLT = CornerTypeRSBoth.forwardHalf;
                };
                rec.cornerLT.rsBoth = bothLT;
                rec.cornerRT.rsBoth = bothRT;
                rec.cornerRB.rsBoth = bothRB;
                rec.cornerLB.rsBoth = bothLB;
            };
        };
    }

    /**
     * 检查某个方向是否包围结构
     * @param x 
     * @param y 
     * @param vecForwardX 
     * @param vecForwardY 
     */
    step3CheckSurround (x: number, y: number, vecForwardX: number, vecForwardY: number) {
        let vecRightX = vecForwardY;
        let vecRightY = - vecForwardX;

        let colorCurrent = this.getColor (x, y);
        let colorForward = this.getColor (x + vecForwardX, y + vecForwardY);
        let colorBack = this.getColor (x - vecForwardX, y - vecForwardY);
        let colorRight = this.getColor (x + vecRightX, y + vecRightY);
        let colorLeft = this.getColor (x - vecRightX, y - vecRightY);
        let colorRB = this.getColor (x + vecRightX - vecForwardX, y + vecRightY - vecForwardY);
        let colorLB = this.getColor (x - vecRightX - vecForwardX, y - vecRightY - vecForwardY);

        if (colorCurrent == colorForward) {
            return false;
        };
        if (colorLeft != colorForward || colorRight != colorForward) {
            return false;
        };
        if (colorLB == colorCurrent || colorRB == colorCurrent) {
            return false;
        };
        return true;
    }

    /**
     * 补充一些平滑，以让形状看起来自然
     */
    step4Addition () {
        for (let x = 0; x < this.imgWidthPaddingScaled; x++) {
            for (let y = 0; y < this.imgHeightPaddingScaled; y++) {
                // 索引
                let idx = y * this.imgWidthPaddingScaled + x;
                let texturePixel = this.listXYToTexturePixel [idx];

                // 确定平滑方向
                for (let i = 0; i < TexturePixel.listCornerX.length; i++) {
                    let listCornerXI = TexturePixel.listCornerX [i];
                    for (let j = 0; j < TexturePixel.listCornerY.length; j++) {
                        let listCornerYJ = TexturePixel.listCornerY [j];
                        let corner = TexturePixel.getCorner (texturePixel, listCornerXI, listCornerYJ);
                        corner.rsBoth = this.step4GetAdditionSmoothBoth (x, y, listCornerXI, listCornerYJ);
                    };
                };
            };
        };
    }

    /**
     * 考虑到线条连贯所以才增加的平滑
     * @param x 
     * @param y 
     * @param vecForwardX 
     * @param vecForwardY 
     */
    step4GetAdditionSmoothBoth (posCurrentX: number, posCurrentY: number, vecForwardX: number, vecForwardY: number) {
        let textureCurrent = this.getTexturePixel (posCurrentX, posCurrentY);
        let cornerCurrent = TexturePixel.getCorner (textureCurrent, vecForwardX, vecForwardY);

        // 本身前方已有平滑，那么不进行新增
        if (cornerCurrent.rsBoth != CornerTypeRSBoth.none) {
            return cornerCurrent.rsBoth;
        };

        let vecRightX = vecForwardY;
        let vecRightY = - vecForwardX;

        // 左侧许可
        let ableLeft = this.step4GetAdditionSmoothAbleSide (
            posCurrentX,
            posCurrentY,

            vecForwardX,
            vecForwardY,

            vecRightX,
            vecRightY
        );

        // 右侧许可
        let ableRight = this.step4GetAdditionSmoothAbleSide (
            posCurrentX,
            posCurrentY,

            vecForwardX,
            vecForwardY,

            - vecRightX,
            - vecRightY
        );

        // 其中一个不许可，都立即终止
        if (!ableLeft || !ableRight) {
            return cornerCurrent.rsBoth;
        };

        // 左侧需要平滑兼容
        let smoothLeft = this.step4GetAdditionSmoothSide (
            posCurrentX,
            posCurrentY,

            vecForwardX,
            vecForwardY,

            vecRightX,
            vecRightY
        );

        // 右侧需要平滑兼容
        let smoothRight = this.step4GetAdditionSmoothSide (
            posCurrentX,
            posCurrentY,

            vecForwardX,
            vecForwardY,

            - vecRightX,
            - vecRightY
        );

        // 同时兼容俩边
        if (smoothLeft && smoothRight) {
            return CornerTypeRSBoth.forward;
        };

        // 兼容左边
        if (smoothLeft) {
            return CornerTypeRSBoth.left;
        };

        // 兼容右边
        if (smoothRight) {
            return CornerTypeRSBoth.right;
        };

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
    step4GetAdditionSmoothAbleSide (
        posCurrentX: number, 
        posCurrentY: number, 
        
        vecForwardX: number,
        vecForwardY: number,

        vecRightX: number,
        vecRightY: number
    )
    {
        // 当前位置的记录
        let textureCurrent = this.getTexturePixel (posCurrentX, posCurrentY);

        let cornerRightType = TexturePixel.getCorner (textureCurrent, vecRightX, vecRightY).rsBoth.namedByAxis (vecForwardX, vecForwardY, vecRightX, vecRightY);
        if (cornerRightType == CornerTypeRSBoth.left || cornerRightType == CornerTypeRSBoth.bothSide) {
            return false;
        };

        let cornerLeftType = TexturePixel.getCorner (textureCurrent, - vecRightX, - vecRightY).rsBoth.namedByAxis (vecForwardX, vecForwardY, vecRightX, vecRightY);
        if (cornerLeftType == CornerTypeRSBoth.right || cornerLeftType == CornerTypeRSBoth.bothSide) {
            return false;
        };

        // 右上方位置
        let posRFX = posCurrentX + vecRightX / 2 + vecForwardX / 2;
        let posRFY = posCurrentY + vecRightY / 2 + vecForwardY / 2;

        // 右上方位置的记录
        let textureRF = this.getTexturePixel (posRFX, posRFY);

        // 越界，那么不新增平滑
        if (!textureRF) {
            return false;
        };
        
        // 右前方的左角有平滑任务，自己不新增
        if (TexturePixel.getCorner (textureRF, - vecRightX, - vecRightY).rsBoth != CornerTypeRSBoth.none) {
            return false;
        };

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
    step4GetAdditionSmoothSide (
        posCurrentX: number, 
        posCurrentY: number, 
        
        vecForwardX: number,
        vecForwardY: number,

        vecRightX: number,
        vecRightY: number
    ) 
    {
        // 当前记录
        let textureCurrent = this.getTexturePixel (posCurrentX, posCurrentY);

        // 右上方位置
        let posRFX = posCurrentX + vecRightX / 2 + vecForwardX / 2;
        let posRFY = posCurrentY + vecRightY / 2 + vecForwardY / 2;

        // 右上方的记录
        let textureRF = this.getTexturePixel (posRFX, posRFY);

        // 右上方在边界出产生了一个点，那么试着平滑它
        let rfOriginSmoothBoth = TexturePixel.getCorner (textureRF, - vecForwardX, - vecForwardY).rsBoth;
        let rfAxisSmoothBoth = rfOriginSmoothBoth.namedByAxis (vecForwardX, vecForwardY, vecRightX, vecRightY);

        if (rfAxisSmoothBoth == CornerTypeRSBoth.forward || rfAxisSmoothBoth == CornerTypeRSBoth.left) {
            return true;
        };

        return false;
    }
}
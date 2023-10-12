import IndexGlobal from "../IndexGlobal.js";
import NodeModules from "../NodeModules.js";
import JWebgl from "../common/JWebgl.js";
import JWebglColor from "../common/JWebglColor.js";
import JWebglMathMatrix4 from "../common/JWebglMathMatrix4.js";
import JWebglMathVector4 from "../common/JWebglMathVector4.js";
import objectPool from "../common/ObjectPool.js";
import ObjectPoolType from "../common/ObjectPoolType.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrData from "../mgr/MgrData.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
const HORIZON_COUNT = 7;
const VERTICAL_COUNT = 4;
/**
 * 线的深度
 */
const Z_GRID = 0.1;
/**
 * 尝试更为灵魂的平滑
 */
class DomImageSmooth extends ReactComponentExtend {
    constructor() {
        super(...arguments);
        /**
         * 模型
         */
        this.mat4M = new JWebglMathMatrix4();
        /**
         * 视图
         */
        this.mat4V = new JWebglMathMatrix4();
        /**
         * 投影
         */
        this.mat4P = new JWebglMathMatrix4();
        /**
         * 模型 - 视图 - 投影
         */
        this.mat4Mvp = new JWebglMathMatrix4();
        /**
         * 3d canvas 引用器
         */
        this.canvasWebglRef = NodeModules.react.createRef();
        /**
         * 格子位置 x
         */
        this.gridX = 0;
        /**
         * 格子位置 y
         */
        this.gridY = 0;
        /**
         * 图片位置
         */
        this.posImg = new JWebglMathVector4();
        /**
         * 线的起始位置
         */
        this.posFrom = new JWebglMathVector4(0, 0, Z_GRID);
        /**
         * 线的结束位置
         */
        this.posTo = new JWebglMathVector4(0, 0, Z_GRID);
        /**
         * 准星颜色
         */
        this.colorFocus = new JWebglColor(1, 0, 0, 1);
    }
    reactComponentExtendOnInit() {
        this.jWebgl = new JWebgl(this.canvasWebglRef.current);
        this.jWebgl.init();
        // 准备好图片的 mvp 矩阵
        this.mat4M.setIdentity();
        this.mat4V.setLookAt(0, 0, 1, 0, 0, 0, 0, 1, 0);
        this.mat4P.setOrtho(-1, 1, -1, 1, 0, 2);
        JWebglMathMatrix4.multiplayMat4List(this.mat4P, this.mat4V, this.mat4M, this.mat4Mvp);
        let canvasWidth = this.props.cacheTexWidth * HORIZON_COUNT * IndexGlobal.PIXEL_TEX_TO_SCREEN;
        let canvasHeight = this.props.cacheTexHeight * VERTICAL_COUNT * IndexGlobal.PIXEL_TEX_TO_SCREEN;
        this.jWebgl.evtTouchStart.on(() => {
            if (this.jWebgl.currentTouch.posCanvas[0] < 0
                || canvasWidth < this.jWebgl.currentTouch.posCanvas[0]
                || this.jWebgl.currentTouch.posCanvas[1] < 0
                || canvasHeight < this.jWebgl.currentTouch.posCanvas[1]) {
                return;
            }
            ;
            let touchX = Math.floor(this.jWebgl.currentTouch.posCanvas[0]);
            let touchY = Math.floor(this.jWebgl.currentTouch.posCanvas[1]);
            let gridX = Math.floor(touchX / IndexGlobal.PIXEL_TEX_TO_SCREEN);
            let gridY = Math.floor(touchY / IndexGlobal.PIXEL_TEX_TO_SCREEN);
            this.loadGridX(gridX, gridY);
        });
    }
    reactComponentExtendOnRelease() {
        this.jWebgl.release();
    }
    /**
     * 载入格子位置
     * @param x
     * @param y
     */
    loadGridX(x, y) {
        if (x == this.gridX && y == this.gridY) {
            return;
        }
        ;
        this.gridX = x;
        this.gridY = y;
        // 刷新画面
        MgrData.inst.callDataChange();
    }
    reactComponentExtendOnDraw() {
        // 图片没加载完毕，什么也别动
        if (this.props.img == null) {
            return;
        }
        ;
        // 绘制 fbo
        if (this.fboTexture == null || this.fboTexture.width != this.props.cacheTexWidth || this.fboTexture.height != this.props.cacheTexHeight) {
            this.jWebgl.destroyFbo(this.fboTexture);
            this.fboTexture = this.jWebgl.getFbo(this.props.cacheTexWidth, this.props.cacheTexHeight);
            this.jWebgl.destroyFbo(this.fboTickness);
            this.fboTickness = this.jWebgl.getFbo(this.props.cacheTexWidth, this.props.cacheTexHeight);
            this.jWebgl.destroyFbo(this.fboFlat);
            this.fboFlat = this.jWebgl.getFbo(this.props.cacheTexWidth * 2, this.props.cacheTexHeight * 2);
            this.jWebgl.destroyFbo(this.fboCornerData);
            this.fboCornerData = this.jWebgl.getFbo(this.props.cacheTexWidth * 2, this.props.cacheTexHeight * 2);
            this.jWebgl.destroyFbo(this.fboCornerDataCache);
            this.fboCornerDataCache = this.jWebgl.getFbo(this.props.cacheTexWidth * 2, this.props.cacheTexHeight * 2);
            this.jWebgl.destroyFbo(this.fboEnumData);
            this.fboEnumData = this.jWebgl.getFbo(this.props.cacheTexWidth * 2, this.props.cacheTexHeight * 2);
            this.jWebgl.destroyFbo(this.fboEnumDataCache);
            this.fboEnumDataCache = this.jWebgl.getFbo(this.props.cacheTexWidth * 2, this.props.cacheTexHeight * 2);
            this.jWebgl.destroyFbo(this.fboAreaLeft);
            this.fboAreaLeft = this.jWebgl.getFbo(this.props.cacheTexWidth * 2, this.props.cacheTexHeight * 2);
            this.jWebgl.destroyFbo(this.fboAreaRight);
            this.fboAreaRight = this.jWebgl.getFbo(this.props.cacheTexWidth * 2, this.props.cacheTexHeight * 2);
            this.jWebgl.destroyFbo(this.fboAngleLeft);
            this.fboAngleLeft = this.jWebgl.getFbo(this.props.cacheTexWidth * 2, this.props.cacheTexHeight * 2);
            this.jWebgl.destroyFbo(this.fboAngleRight);
            this.fboAngleRight = this.jWebgl.getFbo(this.props.cacheTexWidth * 2, this.props.cacheTexHeight * 2);
            this.jWebgl.destroyFbo(this.fboDisplay);
            this.fboDisplay = this.jWebgl.getFbo(this.props.cacheTexWidth * IndexGlobal.PIXEL_TEX_TO_SCREEN * IndexGlobal.ANTINA, this.props.cacheTexHeight * IndexGlobal.PIXEL_TEX_TO_SCREEN * IndexGlobal.ANTINA);
        }
        ;
        // 清除所有
        this.jWebgl.useFbo(null);
        this.jWebgl.clear();
        this.jWebgl.useFbo(this.fboEnumData);
        this.jWebgl.clear();
        this.step0Texture();
        this.step0Tickness();
        this.step0Flat();
        this.step1CornerData(1, 0);
        this.step2CornerRemA(2, 0);
        this.step3CornerRemX(3, 0);
        this.step4CornerRemT(4, 0);
        this.step5CornerRemI(5, 0);
        this.step6CornerRemV(6, 0);
        this.step7EnumRound(1, 2);
        this.step8EnumSide(2, 2);
        this.step9Area(3, 2);
        this.step10Angle(3, 3);
        this.smoothCircleTo(5, 2);
        // 网格
        let cameraWidth = this.props.cacheTexWidth * HORIZON_COUNT;
        let cameraHeight = this.props.cacheTexHeight * VERTICAL_COUNT;
        this.jWebgl.programLine.uMvp.fill(this.jWebgl.mat4Mvp);
        let colorGrid = JWebglColor.COLOR_BLACK;
        for (let i = 0; i <= cameraWidth; i++) {
            this.posFrom.elements[0] = i;
            this.posFrom.elements[1] = 0;
            this.posTo.elements[0] = i;
            this.posTo.elements[1] = cameraHeight;
            this.jWebgl.programLine.add(this.posFrom, colorGrid, this.posTo, colorGrid);
        }
        ;
        this.jWebgl.programLine.draw();
        for (let i = 0; i <= cameraHeight; i++) {
            this.posFrom.elements[0] = 0;
            this.posFrom.elements[1] = i;
            this.posTo.elements[0] = cameraWidth;
            this.posTo.elements[1] = i;
            this.jWebgl.programLine.add(this.posFrom, colorGrid, this.posTo, colorGrid);
        }
        ;
        this.jWebgl.programLine.draw();
        // 准星
        let gridXMod = this.gridX % this.props.cacheTexWidth + 0.5;
        let gridYMod = this.gridY % this.props.cacheTexHeight + 0.5;
        // 竖线
        for (let i = 0; i < HORIZON_COUNT; i++) {
            this.posFrom.elements[0] = i * this.props.cacheTexWidth + gridXMod;
            this.posFrom.elements[1] = 0;
            this.posTo.elements[0] = i * this.props.cacheTexWidth + gridXMod;
            this.posTo.elements[1] = cameraHeight;
            this.jWebgl.programLine.add(this.posFrom, this.colorFocus, this.posTo, this.colorFocus);
        }
        ;
        // 横线
        for (let i = 0; i < VERTICAL_COUNT; i++) {
            this.posFrom.elements[0] = 0;
            this.posFrom.elements[1] = i * this.props.cacheTexHeight + gridYMod;
            this.posTo.elements[0] = cameraWidth;
            this.posTo.elements[1] = i * this.props.cacheTexHeight + gridYMod;
            this.jWebgl.programLine.add(this.posFrom, this.colorFocus, this.posTo, this.colorFocus);
        }
        ;
        this.jWebgl.programLine.draw();
    }
    /**
     * 在位置 x、y 绘制当前结果
     * @param x
     * @param y
     */
    drawFbo(fbo, x, y) {
        this.jWebgl.useFbo(null);
        let cameraWidth = this.props.cacheTexWidth * HORIZON_COUNT;
        let cameraHeight = this.props.cacheTexHeight * VERTICAL_COUNT;
        this.jWebgl.mat4V.setLookAt(cameraWidth / 2, cameraHeight / 2, 1, cameraWidth / 2, cameraHeight / 2, 0, 0, 1, 0);
        this.jWebgl.mat4P.setOrtho(-cameraWidth / 2, cameraWidth / 2, -cameraHeight / 2, cameraHeight / 2, 0, 2);
        this.jWebgl.refreshMat4Mvp();
        this.jWebgl.programImg.uMvp.fill(this.jWebgl.mat4Mvp);
        this.jWebgl.programImg.uTexture.fillByFbo(fbo);
        this.posImg.elements[0] = this.props.cacheTexWidth * (0.5 + x);
        this.posImg.elements[1] = this.props.cacheTexHeight * (VERTICAL_COUNT - 1 + 0.5 - y);
        this.jWebgl.programImg.add(this.posImg, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, this.props.cacheTexWidth, this.props.cacheTexHeight);
        this.jWebgl.programImg.draw();
    }
    /**
     * 把平滑结果绘制在 x、y - 经典款
     * @param x
     * @param y
     */
    smoothOrdinaryTo(x, y) {
        // 最终结果
        this.jWebgl.useFbo(this.fboDisplay);
        this.jWebgl.clear();
        this.jWebgl.programSmoothDisplayOrdinary.uMvp.fill(this.mat4Mvp);
        this.jWebgl.programSmoothDisplayOrdinary.uTextureMain.fillByFbo(this.fboTexture);
        this.jWebgl.programSmoothDisplayOrdinary.uTextureSize.fill(this.props.cacheTexWidth, this.props.cacheTexHeight);
        this.jWebgl.programSmoothDisplayOrdinary.uTextureCorner.fillByFbo(this.fboCornerData);
        this.jWebgl.programSmoothDisplayOrdinary.uTextureEnum.fillByFbo(this.fboEnumData);
        this.jWebgl.programSmoothDisplayOrdinary.add(JWebglMathVector4.centerO, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, 2, 2);
        this.jWebgl.programSmoothDisplayOrdinary.draw();
        this.drawFbo(this.fboDisplay, x, y);
    }
    /**
     * 把平滑结果绘制在 x、y - 高级款
     * @param x
     * @param y
     */
    smoothCircleTo(x, y) {
        // 最终结果
        this.jWebgl.useFbo(this.fboDisplay);
        this.jWebgl.clear();
        this.jWebgl.programSmoothDisplayCircle.uMvp.fill(this.mat4Mvp);
        this.jWebgl.programSmoothDisplayCircle.uTextureMain.fillByFbo(this.fboTexture);
        this.jWebgl.programSmoothDisplayCircle.uTextureSize.fill(this.props.cacheTexWidth, this.props.cacheTexHeight);
        this.jWebgl.programSmoothDisplayCircle.uTextureCorner.fillByFbo(this.fboCornerData);
        this.jWebgl.programSmoothDisplayCircle.uTextureEnum.fillByFbo(this.fboEnumData);
        this.jWebgl.programSmoothDisplayCircle.uTextureAreaLeft.fillByFbo(this.fboAreaLeft);
        this.jWebgl.programSmoothDisplayCircle.uTextureAreaRight.fillByFbo(this.fboAreaRight);
        this.jWebgl.programSmoothDisplayCircle.uTextureAngleLeft.fillByFbo(this.fboAngleLeft);
        this.jWebgl.programSmoothDisplayCircle.uTextureAngleRight.fillByFbo(this.fboAngleRight);
        this.jWebgl.programSmoothDisplayCircle.add(JWebglMathVector4.centerO, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, 2, 2);
        this.jWebgl.programSmoothDisplayCircle.draw();
        this.drawFbo(this.fboDisplay, x, y);
    }
    /**
     * 准备好源纹理
     */
    step0Texture() {
        // 得到简略图
        DomImageSmooth.Args.drawImgPadding(this.props, this.jWebgl, this.fboTexture);
        // 原图
        this.drawFbo(this.fboTexture, 0, 0);
    }
    /**
     * 源纹理 -> 厚度纹理
     */
    step0Tickness() {
        // 厚度数据
        this.jWebgl.useFbo(this.fboTickness);
        this.jWebgl.clear();
        this.jWebgl.programSmoothTickness.uMvp.fill(this.mat4Mvp);
        this.jWebgl.programSmoothTickness.uTexture.fillByFbo(this.fboTexture);
        this.jWebgl.programSmoothTickness.uTextureSize.fill(this.props.cacheTexWidth, this.props.cacheTexHeight);
        this.jWebgl.programSmoothTickness.add(JWebglMathVector4.centerO, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, 2, 2);
        this.jWebgl.programSmoothTickness.draw();
        this.drawFbo(this.fboTickness, 0, 1);
    }
    /**
     * 源纹理 -> 平坦纹理
     */
    step0Flat() {
        // 各个角的数据
        this.jWebgl.useFbo(this.fboFlat);
        this.jWebgl.clear();
        this.jWebgl.programSmoothFlat.uMvp.fill(this.mat4Mvp);
        this.jWebgl.programSmoothFlat.uTexture.fillByFbo(this.fboTexture);
        this.jWebgl.programSmoothFlat.uTextureSize.fill(this.props.cacheTexWidth, this.props.cacheTexHeight);
        this.jWebgl.programSmoothFlat.uRight.fill(1);
        this.jWebgl.programSmoothFlat.add(JWebglMathVector4.centerO, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, 2, 2);
        this.jWebgl.programSmoothFlat.draw();
        this.drawFbo(this.fboFlat, 0, 2);
    }
    /**
     * 源纹理 -> 角数据纹理
     */
    step1CornerData(posX, posY) {
        // 各个角的数据
        this.jWebgl.useFbo(this.fboCornerData);
        this.jWebgl.clear();
        this.jWebgl.programSmoothCornerData.uMvp.fill(this.mat4Mvp);
        this.jWebgl.programSmoothCornerData.uTextureMain.fillByFbo(this.fboTexture);
        this.jWebgl.programSmoothCornerData.uTextureFlat.fillByFbo(this.fboFlat);
        this.jWebgl.programSmoothCornerData.uTextureSize.fill(this.props.cacheTexWidth, this.props.cacheTexHeight);
        this.jWebgl.programSmoothCornerData.uRight.fill(1);
        this.jWebgl.programSmoothCornerData.add(JWebglMathVector4.centerO, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, 2, 2);
        this.jWebgl.programSmoothCornerData.draw();
        this.drawFbo(this.fboCornerData, posX, posY + 1);
        this.smoothOrdinaryTo(posX, posY + 0);
    }
    /**
     * 剔除 A 平滑
     */
    step2CornerRemA(posX, posY) {
        this.jWebgl.useFbo(this.fboCornerDataCache);
        this.jWebgl.clear();
        this.jWebgl.programSmoothCornerRemoveA.uMvp.fill(this.mat4Mvp);
        this.jWebgl.programSmoothCornerRemoveA.uTextureSize.fill(this.props.cacheTexWidth, this.props.cacheTexHeight);
        this.jWebgl.programSmoothCornerRemoveA.uTextureMain.fillByFbo(this.fboTexture);
        this.jWebgl.programSmoothCornerRemoveA.uTextureCorner.fillByFbo(this.fboCornerData);
        this.jWebgl.programSmoothCornerRemoveA.uRight.fill(1);
        this.jWebgl.programSmoothCornerRemoveA.add(JWebglMathVector4.centerO, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, 2, 2);
        this.jWebgl.programSmoothCornerRemoveA.draw();
        this.drawFbo(this.fboCornerDataCache, posX, posY + 1);
        this.jWebgl.fillFboByFbo(this.fboCornerData, this.fboCornerDataCache);
        this.smoothOrdinaryTo(posX, posY + 0);
    }
    /**
     * 剔除 X 平滑
     */
    step3CornerRemX(posX, posY) {
        this.jWebgl.useFbo(this.fboCornerDataCache);
        this.jWebgl.clear();
        this.jWebgl.programSmoothCornerRemoveX.uMvp.fill(this.mat4Mvp);
        this.jWebgl.programSmoothCornerRemoveX.uTextureSize.fill(this.props.cacheTexWidth, this.props.cacheTexHeight);
        this.jWebgl.programSmoothCornerRemoveX.uTextureMain.fillByFbo(this.fboTexture);
        this.jWebgl.programSmoothCornerRemoveX.uTextureTickness.fillByFbo(this.fboTickness);
        this.jWebgl.programSmoothCornerRemoveX.uTextureCorner.fillByFbo(this.fboCornerData);
        this.jWebgl.programSmoothCornerRemoveX.uRight.fill(1);
        this.jWebgl.programSmoothCornerRemoveX.add(JWebglMathVector4.centerO, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, 2, 2);
        this.jWebgl.programSmoothCornerRemoveX.draw();
        this.drawFbo(this.fboCornerDataCache, posX, posY + 1);
        this.jWebgl.fillFboByFbo(this.fboCornerData, this.fboCornerDataCache);
        this.smoothOrdinaryTo(posX, posY + 0);
    }
    /**
     * 剔除 T 平滑
     */
    step4CornerRemT(posX, posY) {
        this.jWebgl.useFbo(this.fboCornerDataCache);
        this.jWebgl.clear();
        this.jWebgl.programSmoothCornerRemoveT.uMvp.fill(this.mat4Mvp);
        this.jWebgl.programSmoothCornerRemoveT.uTextureSize.fill(this.props.cacheTexWidth, this.props.cacheTexHeight);
        this.jWebgl.programSmoothCornerRemoveT.uTextureCorner.fillByFbo(this.fboCornerData);
        this.jWebgl.programSmoothCornerRemoveT.uRight.fill(1);
        this.jWebgl.programSmoothCornerRemoveT.add(JWebglMathVector4.centerO, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, 2, 2);
        this.jWebgl.programSmoothCornerRemoveT.draw();
        this.drawFbo(this.fboCornerDataCache, posX, posY + 1);
        this.jWebgl.fillFboByFbo(this.fboCornerData, this.fboCornerDataCache);
        this.smoothOrdinaryTo(posX, posY + 0);
    }
    /**
     * 剔除 I 平滑
     */
    step5CornerRemI(posX, posY) {
        this.jWebgl.useFbo(this.fboCornerDataCache);
        this.jWebgl.clear();
        this.jWebgl.programSmoothCornerRemoveI.uMvp.fill(this.mat4Mvp);
        this.jWebgl.programSmoothCornerRemoveI.uTextureSize.fill(this.props.cacheTexWidth, this.props.cacheTexHeight);
        this.jWebgl.programSmoothCornerRemoveI.uTextureCorner.fillByFbo(this.fboCornerData);
        this.jWebgl.programSmoothCornerRemoveI.uRight.fill(1);
        this.jWebgl.programSmoothCornerRemoveI.add(JWebglMathVector4.centerO, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, 2, 2);
        this.jWebgl.programSmoothCornerRemoveI.draw();
        this.drawFbo(this.fboCornerDataCache, posX, posY + 1);
        this.jWebgl.fillFboByFbo(this.fboCornerData, this.fboCornerDataCache);
        this.smoothOrdinaryTo(posX, posY + 0);
    }
    /**
     * 剔除尖锐平滑
     */
    step6CornerRemV(posX, posY) {
        this.jWebgl.useFbo(this.fboCornerDataCache);
        this.jWebgl.clear();
        this.jWebgl.programSmoothCornerRemoveV.uMvp.fill(this.mat4Mvp);
        this.jWebgl.programSmoothCornerRemoveV.uTextureSize.fill(this.props.cacheTexWidth, this.props.cacheTexHeight);
        this.jWebgl.programSmoothCornerRemoveV.uTextureMain.fillByFbo(this.fboTexture);
        this.jWebgl.programSmoothCornerRemoveV.uTextureCorner.fillByFbo(this.fboCornerData);
        this.jWebgl.programSmoothCornerRemoveV.uRight.fill(1);
        this.jWebgl.programSmoothCornerRemoveV.add(JWebglMathVector4.centerO, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, 2, 2);
        this.jWebgl.programSmoothCornerRemoveV.draw();
        this.drawFbo(this.fboCornerDataCache, posX, posY + 1);
        this.jWebgl.fillFboByFbo(this.fboCornerData, this.fboCornerDataCache);
        this.smoothOrdinaryTo(posX, posY + 0);
    }
    /**
     * 角数据纹理 -> 平滑数据纹理
     */
    step7EnumRound(posX, posY) {
        this.jWebgl.useFbo(this.fboEnumDataCache);
        this.jWebgl.clear();
        this.jWebgl.programSmoothEnumRound.uMvp.fill(this.mat4Mvp);
        this.jWebgl.programSmoothEnumRound.uTextureSize.fill(this.props.cacheTexWidth, this.props.cacheTexHeight);
        this.jWebgl.programSmoothEnumRound.uTextureMain.fillByFbo(this.fboTexture);
        this.jWebgl.programSmoothEnumRound.uTextureCorner.fillByFbo(this.fboCornerData);
        this.jWebgl.programSmoothEnumRound.uRight.fill(1);
        this.jWebgl.programSmoothEnumRound.add(JWebglMathVector4.centerO, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, 2, 2);
        this.jWebgl.programSmoothEnumRound.draw();
        this.drawFbo(this.fboEnumDataCache, posX, posY + 1);
        this.jWebgl.fillFboByFbo(this.fboEnumData, this.fboEnumDataCache);
        this.smoothOrdinaryTo(posX, posY + 0);
    }
    /**
     * 平滑数据纹理 -> 平滑数据纹理
     */
    step8EnumSide(posX, posY) {
        this.jWebgl.useFbo(this.fboEnumDataCache);
        this.jWebgl.clear();
        this.jWebgl.programSmoothEnumSide.uMvp.fill(this.mat4Mvp);
        this.jWebgl.programSmoothEnumSide.uTextureSize.fill(this.props.cacheTexWidth, this.props.cacheTexHeight);
        this.jWebgl.programSmoothEnumSide.uTextureMain.fillByFbo(this.fboTexture);
        this.jWebgl.programSmoothEnumSide.uTextureCorner.fillByFbo(this.fboCornerData);
        this.jWebgl.programSmoothEnumSide.uTextureEnum.fillByFbo(this.fboEnumData);
        this.jWebgl.programSmoothEnumSide.uRight.fill(1);
        this.jWebgl.programSmoothEnumSide.add(JWebglMathVector4.centerO, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, 2, 2);
        this.jWebgl.programSmoothEnumSide.draw();
        this.drawFbo(this.fboEnumDataCache, posX, posY + 1);
        this.jWebgl.fillFboByFbo(this.fboEnumData, this.fboEnumDataCache);
        this.smoothOrdinaryTo(posX, posY + 0);
    }
    /**
     * 平滑数据纹理 -> 平滑区域纹理
     * @param posX
     * @param posY
     */
    step9Area(posX, posY) {
        this.jWebgl.programSmoothArea.uMvp.fill(this.mat4Mvp);
        this.jWebgl.programSmoothArea.uTextureSize.fill(this.props.cacheTexWidth, this.props.cacheTexHeight);
        this.jWebgl.programSmoothArea.uTextureMain.fillByFbo(this.fboTexture);
        this.jWebgl.programSmoothArea.uTextureCorner.fillByFbo(this.fboCornerData);
        this.jWebgl.programSmoothArea.uTextureEnum.fillByFbo(this.fboEnumData);
        this.jWebgl.useFbo(this.fboAreaLeft);
        this.jWebgl.clear();
        this.jWebgl.programSmoothArea.add(JWebglMathVector4.centerO, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, 2, 2);
        this.jWebgl.programSmoothArea.uRight.fill(1);
        this.jWebgl.programSmoothArea.draw();
        this.drawFbo(this.fboAreaLeft, posX, posY);
        this.jWebgl.programSmoothArea.uTextureMain.fillByFbo(this.fboTexture);
        this.jWebgl.programSmoothArea.uTextureCorner.fillByFbo(this.fboCornerData);
        this.jWebgl.programSmoothArea.uTextureEnum.fillByFbo(this.fboEnumData);
        this.jWebgl.useFbo(this.fboAreaRight);
        this.jWebgl.clear();
        this.jWebgl.programSmoothArea.add(JWebglMathVector4.centerO, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, 2, 2);
        this.jWebgl.programSmoothArea.uRight.fill(-1);
        this.jWebgl.programSmoothArea.draw();
        this.drawFbo(this.fboAreaRight, posX + 1, posY);
    }
    /**
     * 平滑数据纹理 -> 平滑角度纹理
     * @param posX
     * @param posY
     */
    step10Angle(posX, posY) {
        this.jWebgl.programSmoothAngle.uMvp.fill(this.mat4Mvp);
        this.jWebgl.programSmoothAngle.uTextureSize.fill(this.props.cacheTexWidth, this.props.cacheTexHeight);
        this.jWebgl.programSmoothAngle.uTextureMain.fillByFbo(this.fboTexture);
        this.jWebgl.programSmoothAngle.uTextureCorner.fillByFbo(this.fboCornerData);
        this.jWebgl.programSmoothAngle.uTextureEnum.fillByFbo(this.fboEnumData);
        this.jWebgl.useFbo(this.fboAngleLeft);
        this.jWebgl.clear();
        this.jWebgl.programSmoothAngle.add(JWebglMathVector4.centerO, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, 2, 2);
        this.jWebgl.programSmoothAngle.uRight.fill(1);
        this.jWebgl.programSmoothAngle.draw();
        this.drawFbo(this.fboAngleLeft, posX, posY);
        this.jWebgl.programSmoothAngle.uTextureMain.fillByFbo(this.fboTexture);
        this.jWebgl.programSmoothAngle.uTextureCorner.fillByFbo(this.fboCornerData);
        this.jWebgl.programSmoothAngle.uTextureEnum.fillByFbo(this.fboEnumData);
        this.jWebgl.useFbo(this.fboAngleRight);
        this.jWebgl.clear();
        this.jWebgl.programSmoothAngle.add(JWebglMathVector4.centerO, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, 2, 2);
        this.jWebgl.programSmoothAngle.uRight.fill(-1);
        this.jWebgl.programSmoothAngle.draw();
        this.drawFbo(this.fboAngleRight, posX + 1, posY);
    }
    render() {
        return ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_HEIGHT]: MgrDomDefine.STYLE_HEIGHT_PERCENTAGE_0,
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
                [MgrDomDefine.STYLE_WIDTH]: `${this.props.cacheTexWidth * IndexGlobal.PIXEL_TEX_TO_SCREEN * HORIZON_COUNT}px`,
                [MgrDomDefine.STYLE_HEIGHT]: `${this.props.cacheTexHeight * IndexGlobal.PIXEL_TEX_TO_SCREEN * VERTICAL_COUNT}px`,
                [MgrDomDefine.STYLE_FLEX_GROW]: 0,
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
            width: this.props.cacheTexWidth * IndexGlobal.PIXEL_TEX_TO_SCREEN * HORIZON_COUNT * IndexGlobal.ANTINA,
            height: this.props.cacheTexHeight * IndexGlobal.PIXEL_TEX_TO_SCREEN * VERTICAL_COUNT * IndexGlobal.ANTINA,
            style: {
                [MgrDomDefine.STYLE_WIDTH]: `${this.props.cacheTexWidth * IndexGlobal.PIXEL_TEX_TO_SCREEN * HORIZON_COUNT}px`,
                [MgrDomDefine.STYLE_HEIGHT]: `${this.props.cacheTexHeight * IndexGlobal.PIXEL_TEX_TO_SCREEN * VERTICAL_COUNT}px`,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_BLOCK
            }
        })))));
    }
}
(function (DomImageSmooth) {
    class Args {
        constructor() {
            /**
             * 最终要处理的图片宽度
             */
            this.cacheTexWidth = 1;
            /**
             * 最终要处理的图片高度
             */
            this.cacheTexHeight = 1;
        }
        /**
         * 构造实例
         * @param rs
         * @param img
         * @param imgWidth
         * @param imgHeight
         * @param paddingTop
         * @param paddingRight
         * @param paddingBottom
         * @param paddingLeft
         * @param pixelSizeWidth
         * @param pixelSizeHeight
         * @returns
         */
        static create(rs, img, imgWidth, imgHeight, paddingTop, paddingRight, paddingBottom, paddingLeft, pixelSizeWidth, pixelSizeHeight) {
            let inst = objectPool.pop(this.poolType);
            inst.init(rs, img, imgWidth, imgHeight, paddingTop, paddingRight, paddingBottom, paddingLeft, pixelSizeWidth, pixelSizeHeight);
            return inst;
        }
        /**
         * 构造实例
         * @param rs
         * @param img
         * @param imgWidth
         * @param imgHeight
         * @param paddingTop
         * @param paddingRight
         * @param paddingBottom
         * @param paddingLeft
         * @param pixelSizeWidth
         * @param pixelSizeHeight
         * @returns
         */
        init(rs, img, imgWidth, imgHeight, paddingTop, paddingRight, paddingBottom, paddingLeft, pixelSizeWidth, pixelSizeHeight) {
            this.rs = rs;
            this.img = img;
            // 如果已经加载完毕，那当然采纳真实的数据
            this.imgWidth = imgWidth;
            this.imgHeight = imgHeight;
            if (this.img != null) {
                this.imgWidth = this.img.width;
                this.imgHeight = this.img.height;
            }
            ;
            this.paddingTop = paddingTop;
            this.paddingRight = paddingRight;
            this.paddingBottom = paddingBottom;
            this.paddingLeft = paddingLeft;
            this.pixelSizeWidth = pixelSizeWidth;
            this.pixelSizeHeight = pixelSizeHeight;
            this.cachePaddingWidth = this.paddingLeft + this.imgWidth + this.paddingRight;
            this.cachePaddingHeight = this.paddingTop + this.imgHeight + this.paddingBottom;
            this.cacheTexWidth = Math.ceil(this.cachePaddingWidth / this.pixelSizeWidth);
            this.cacheTexHeight = Math.ceil(this.cachePaddingHeight / this.pixelSizeHeight);
        }
        /**
         * 绘制出要处理的图片
         * @param jWebgl
         * @param fbo
         */
        static drawImgPadding(self, jWebgl, fbo) {
            jWebgl.useFbo(fbo);
            jWebgl.clear();
            jWebgl.mat4M.setIdentity();
            jWebgl.mat4V.setLookAt(self.cachePaddingWidth / 2, self.cachePaddingHeight / 2, 1, self.cachePaddingWidth / 2, self.cachePaddingHeight / 2, 0, 0, 1, 0);
            jWebgl.mat4P.setOrtho(-self.cachePaddingWidth / 2, self.cachePaddingWidth / 2, -self.cachePaddingHeight / 2, self.cachePaddingHeight / 2, 0, 2);
            JWebglMathMatrix4.multiplayMat4List(jWebgl.mat4P, jWebgl.mat4V, jWebgl.mat4M, jWebgl.mat4Mvp);
            // 图片
            jWebgl.programImg.uMvp.fill(jWebgl.mat4Mvp);
            jWebgl.programImg.uTexture.fillByImg(jWebgl.getImg(self.img.src));
            let posImg = JWebglMathVector4.create(self.imgWidth / 2 + self.paddingLeft, self.imgHeight / 2 + self.paddingBottom, 0);
            jWebgl.programImg.add(posImg, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, self.imgWidth, self.imgHeight);
            objectPool.push(posImg);
            jWebgl.programImg.draw();
        }
    }
    /**
     * 对象池类型
     */
    Args.poolType = new ObjectPoolType({
        instantiate: () => {
            return new Args();
        },
        onPop: null,
        onPush: null
    });
    DomImageSmooth.Args = Args;
})(DomImageSmooth || (DomImageSmooth = {}));
export default DomImageSmooth;

import IndexGlobal from "../IndexGlobal.js";
import NodeModules from "../NodeModules.js";
import JWebgl from "../common/JWebgl.js";
import JWebglColor from "../common/JWebglColor.js";
import JWebglMathMatrix4 from "../common/JWebglMathMatrix4.js";
import JWebglMathVector4 from "../common/JWebglMathVector4.js";
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
class DomRightSmoothCanvas extends ReactComponentExtend {
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
        this.jWebgl.evtTouchStart.on(() => {
            let touchX = Math.floor(this.jWebgl.currentTouch.posCanvas[0]);
            let touchY = Math.floor(this.jWebgl.currentTouch.posCanvas[1]);
            let gridX = Math.floor(touchX / IndexGlobal.PIXEL_TEX_TO_SCREEN);
            let gridY = Math.floor(touchY / IndexGlobal.PIXEL_TEX_TO_SCREEN);
            this.loadGridX(gridX, gridY);
        });
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
        let dataSrc = IndexGlobal.inst.detailMachine.statusPreview;
        let imgMachine = dataSrc.imgMachine;
        // 只有加载完毕等待缓存的时候才进行下述的缓存内容
        if (imgMachine.currStatus == imgMachine.statusIdle) {
            return;
        }
        ;
        // 绘制 fbo
        if (this.fboTexture == null || this.fboTexture.width != dataSrc.textureWidth || this.fboTexture.height != dataSrc.textureHeight) {
            this.jWebgl.destroyFbo(this.fboTexture);
            this.fboTexture = this.jWebgl.getFbo(dataSrc.textureWidth, dataSrc.textureHeight);
            this.jWebgl.destroyFbo(this.fboTickness);
            this.fboTickness = this.jWebgl.getFbo(dataSrc.textureWidth, dataSrc.textureHeight);
            this.jWebgl.destroyFbo(this.fboFlat);
            this.fboFlat = this.jWebgl.getFbo(dataSrc.textureWidth * 2, dataSrc.textureHeight * 2);
            this.jWebgl.destroyFbo(this.fboCornerData);
            this.fboCornerData = this.jWebgl.getFbo(dataSrc.textureWidth * 2, dataSrc.textureHeight * 2);
            this.jWebgl.destroyFbo(this.fboCornerDataCache);
            this.fboCornerDataCache = this.jWebgl.getFbo(dataSrc.textureWidth * 2, dataSrc.textureHeight * 2);
            this.jWebgl.destroyFbo(this.fboEnumData);
            this.fboEnumData = this.jWebgl.getFbo(dataSrc.textureWidth * 2, dataSrc.textureHeight * 2);
            this.jWebgl.destroyFbo(this.fboEnumDataCache);
            this.fboEnumDataCache = this.jWebgl.getFbo(dataSrc.textureWidth * 2, dataSrc.textureHeight * 2);
            this.jWebgl.destroyFbo(this.fboAreaLeft);
            this.fboAreaLeft = this.jWebgl.getFbo(dataSrc.textureWidth * 2, dataSrc.textureHeight * 2);
            this.jWebgl.destroyFbo(this.fboAreaRight);
            this.fboAreaRight = this.jWebgl.getFbo(dataSrc.textureWidth * 2, dataSrc.textureHeight * 2);
            this.jWebgl.destroyFbo(this.fboAngleLeft);
            this.fboAngleLeft = this.jWebgl.getFbo(dataSrc.textureWidth * 2, dataSrc.textureHeight * 2);
            this.jWebgl.destroyFbo(this.fboAngleRight);
            this.fboAngleRight = this.jWebgl.getFbo(dataSrc.textureWidth * 2, dataSrc.textureHeight * 2);
            this.jWebgl.destroyFbo(this.fboDisplay);
            this.fboDisplay = this.jWebgl.getFbo(dataSrc.textureWidth * IndexGlobal.PIXEL_TEX_TO_SCREEN, dataSrc.textureHeight * IndexGlobal.PIXEL_TEX_TO_SCREEN);
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
        let cameraWidth = dataSrc.textureWidth * HORIZON_COUNT;
        let cameraHeight = dataSrc.textureHeight * VERTICAL_COUNT;
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
        let gridXMod = this.gridX % dataSrc.textureWidth + 0.5;
        let gridYMod = this.gridY % dataSrc.textureHeight + 0.5;
        // 竖线
        for (let i = 0; i < HORIZON_COUNT; i++) {
            this.posFrom.elements[0] = i * dataSrc.textureWidth + gridXMod;
            this.posFrom.elements[1] = 0;
            this.posTo.elements[0] = i * dataSrc.textureWidth + gridXMod;
            this.posTo.elements[1] = cameraHeight;
            this.jWebgl.programLine.add(this.posFrom, this.colorFocus, this.posTo, this.colorFocus);
        }
        ;
        // 横线
        for (let i = 0; i < VERTICAL_COUNT; i++) {
            this.posFrom.elements[0] = 0;
            this.posFrom.elements[1] = i * dataSrc.textureHeight + gridYMod;
            this.posTo.elements[0] = cameraWidth;
            this.posTo.elements[1] = i * dataSrc.textureHeight + gridYMod;
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
        let dataSrc = IndexGlobal.inst.detailMachine.statusPreview;
        this.jWebgl.useFbo(null);
        let cameraWidth = dataSrc.textureWidth * HORIZON_COUNT;
        let cameraHeight = dataSrc.textureHeight * VERTICAL_COUNT;
        this.jWebgl.mat4V.setLookAt(cameraWidth / 2, cameraHeight / 2, 1, cameraWidth / 2, cameraHeight / 2, 0, 0, 1, 0);
        this.jWebgl.mat4P.setOrtho(-cameraWidth / 2, cameraWidth / 2, -cameraHeight / 2, cameraHeight / 2, 0, 2);
        this.jWebgl.refreshMat4Mvp();
        this.jWebgl.programImg.uMvp.fill(this.jWebgl.mat4Mvp);
        this.jWebgl.programImg.uTexture.fillByFbo(fbo);
        this.posImg.elements[0] = dataSrc.textureWidth * (0.5 + x);
        this.posImg.elements[1] = dataSrc.textureHeight * (VERTICAL_COUNT - 1 + 0.5 - y);
        this.jWebgl.programImg.add(this.posImg, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, dataSrc.textureWidth, dataSrc.textureHeight);
        this.jWebgl.programImg.draw();
    }
    /**
     * 把平滑结果绘制在 x、y - 经典款
     * @param x
     * @param y
     */
    smoothOrdinaryTo(x, y) {
        let dataSrc = IndexGlobal.inst.detailMachine.statusPreview;
        // 最终结果
        this.jWebgl.useFbo(this.fboDisplay);
        this.jWebgl.clear();
        this.jWebgl.programSmoothDisplayOrdinary.uMvp.fill(this.mat4Mvp);
        this.jWebgl.programSmoothDisplayOrdinary.uTextureMain.fillByFbo(this.fboTexture);
        this.jWebgl.programSmoothDisplayOrdinary.uTextureSize.fill(dataSrc.textureWidth, dataSrc.textureHeight);
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
        let dataSrc = IndexGlobal.inst.detailMachine.statusPreview;
        // 最终结果
        this.jWebgl.useFbo(this.fboDisplay);
        this.jWebgl.clear();
        this.jWebgl.programSmoothDisplayCircle.uMvp.fill(this.mat4Mvp);
        this.jWebgl.programSmoothDisplayCircle.uTextureMain.fillByFbo(this.fboTexture);
        this.jWebgl.programSmoothDisplayCircle.uTextureSize.fill(dataSrc.textureWidth, dataSrc.textureHeight);
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
        let dataSrc = IndexGlobal.inst.detailMachine.statusPreview;
        // 得到简略图
        dataSrc.drawImgPadding(this.jWebgl, this.fboTexture);
        // 原图
        this.drawFbo(this.fboTexture, 0, 0);
    }
    /**
     * 源纹理 -> 厚度纹理
     */
    step0Tickness() {
        let dataSrc = IndexGlobal.inst.detailMachine.statusPreview;
        // 厚度数据
        this.jWebgl.useFbo(this.fboTickness);
        this.jWebgl.clear();
        this.jWebgl.programSmoothTickness.uMvp.fill(this.mat4Mvp);
        this.jWebgl.programSmoothTickness.uTexture.fillByFbo(this.fboTexture);
        this.jWebgl.programSmoothTickness.uTextureSize.fill(dataSrc.textureWidth, dataSrc.textureHeight);
        this.jWebgl.programSmoothTickness.add(JWebglMathVector4.centerO, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, 2, 2);
        this.jWebgl.programSmoothTickness.draw();
        this.drawFbo(this.fboTickness, 0, 1);
    }
    /**
     * 源纹理 -> 平坦纹理
     */
    step0Flat() {
        let dataSrc = IndexGlobal.inst.detailMachine.statusPreview;
        // 各个角的数据
        this.jWebgl.useFbo(this.fboFlat);
        this.jWebgl.clear();
        this.jWebgl.programSmoothFlat.uMvp.fill(this.mat4Mvp);
        this.jWebgl.programSmoothFlat.uTexture.fillByFbo(this.fboTexture);
        this.jWebgl.programSmoothFlat.uTextureSize.fill(dataSrc.textureWidth, dataSrc.textureHeight);
        this.jWebgl.programSmoothFlat.uRight.fill(1);
        this.jWebgl.programSmoothFlat.add(JWebglMathVector4.centerO, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, 2, 2);
        this.jWebgl.programSmoothFlat.draw();
        this.drawFbo(this.fboFlat, 0, 2);
    }
    /**
     * 源纹理 -> 角数据纹理
     */
    step1CornerData(posX, posY) {
        let dataSrc = IndexGlobal.inst.detailMachine.statusPreview;
        // 各个角的数据
        this.jWebgl.useFbo(this.fboCornerData);
        this.jWebgl.clear();
        this.jWebgl.programSmoothCornerData.uMvp.fill(this.mat4Mvp);
        this.jWebgl.programSmoothCornerData.uTextureMain.fillByFbo(this.fboTexture);
        this.jWebgl.programSmoothCornerData.uTextureFlat.fillByFbo(this.fboFlat);
        this.jWebgl.programSmoothCornerData.uTextureSize.fill(dataSrc.textureWidth, dataSrc.textureHeight);
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
        let dataSrc = IndexGlobal.inst.detailMachine.statusPreview;
        this.jWebgl.useFbo(this.fboCornerDataCache);
        this.jWebgl.clear();
        this.jWebgl.programSmoothCornerRemoveA.uMvp.fill(this.mat4Mvp);
        this.jWebgl.programSmoothCornerRemoveA.uTextureSize.fill(dataSrc.textureWidth, dataSrc.textureHeight);
        this.jWebgl.programSmoothCornerRemoveA.uTextureMain.fillByFbo(this.fboTexture);
        this.jWebgl.programSmoothCornerRemoveA.uTextureCorner.fillByFbo(this.fboCornerData);
        this.jWebgl.programSmoothCornerRemoveA.uRight.fill(1);
        this.jWebgl.programSmoothCornerRemoveA.add(JWebglMathVector4.centerO, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, 2, 2);
        this.jWebgl.programSmoothCornerRemoveA.draw();
        this.drawFbo(this.fboCornerDataCache, posX, posY + 1);
        this.jWebgl.fillFbo(this.fboCornerData, this.fboCornerDataCache);
        this.smoothOrdinaryTo(posX, posY + 0);
    }
    /**
     * 剔除 X 平滑
     */
    step3CornerRemX(posX, posY) {
        let dataSrc = IndexGlobal.inst.detailMachine.statusPreview;
        this.jWebgl.useFbo(this.fboCornerDataCache);
        this.jWebgl.clear();
        this.jWebgl.programSmoothCornerRemoveX.uMvp.fill(this.mat4Mvp);
        this.jWebgl.programSmoothCornerRemoveX.uTextureSize.fill(dataSrc.textureWidth, dataSrc.textureHeight);
        this.jWebgl.programSmoothCornerRemoveX.uTextureMain.fillByFbo(this.fboTexture);
        this.jWebgl.programSmoothCornerRemoveX.uTextureTickness.fillByFbo(this.fboTickness);
        this.jWebgl.programSmoothCornerRemoveX.uTextureCorner.fillByFbo(this.fboCornerData);
        this.jWebgl.programSmoothCornerRemoveX.uRight.fill(1);
        this.jWebgl.programSmoothCornerRemoveX.add(JWebglMathVector4.centerO, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, 2, 2);
        this.jWebgl.programSmoothCornerRemoveX.draw();
        this.drawFbo(this.fboCornerDataCache, posX, posY + 1);
        this.jWebgl.fillFbo(this.fboCornerData, this.fboCornerDataCache);
        this.smoothOrdinaryTo(posX, posY + 0);
    }
    /**
     * 剔除 T 平滑
     */
    step4CornerRemT(posX, posY) {
        let dataSrc = IndexGlobal.inst.detailMachine.statusPreview;
        this.jWebgl.useFbo(this.fboCornerDataCache);
        this.jWebgl.clear();
        this.jWebgl.programSmoothCornerRemoveT.uMvp.fill(this.mat4Mvp);
        this.jWebgl.programSmoothCornerRemoveT.uTextureSize.fill(dataSrc.textureWidth, dataSrc.textureHeight);
        this.jWebgl.programSmoothCornerRemoveT.uTextureCorner.fillByFbo(this.fboCornerData);
        this.jWebgl.programSmoothCornerRemoveT.uRight.fill(1);
        this.jWebgl.programSmoothCornerRemoveT.add(JWebglMathVector4.centerO, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, 2, 2);
        this.jWebgl.programSmoothCornerRemoveT.draw();
        this.drawFbo(this.fboCornerDataCache, posX, posY + 1);
        this.jWebgl.fillFbo(this.fboCornerData, this.fboCornerDataCache);
        this.smoothOrdinaryTo(posX, posY + 0);
    }
    /**
     * 剔除 I 平滑
     */
    step5CornerRemI(posX, posY) {
        let dataSrc = IndexGlobal.inst.detailMachine.statusPreview;
        this.jWebgl.useFbo(this.fboCornerDataCache);
        this.jWebgl.clear();
        this.jWebgl.programSmoothCornerRemoveI.uMvp.fill(this.mat4Mvp);
        this.jWebgl.programSmoothCornerRemoveI.uTextureSize.fill(dataSrc.textureWidth, dataSrc.textureHeight);
        this.jWebgl.programSmoothCornerRemoveI.uTextureCorner.fillByFbo(this.fboCornerData);
        this.jWebgl.programSmoothCornerRemoveI.uRight.fill(1);
        this.jWebgl.programSmoothCornerRemoveI.add(JWebglMathVector4.centerO, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, 2, 2);
        this.jWebgl.programSmoothCornerRemoveI.draw();
        this.drawFbo(this.fboCornerDataCache, posX, posY + 1);
        this.jWebgl.fillFbo(this.fboCornerData, this.fboCornerDataCache);
        this.smoothOrdinaryTo(posX, posY + 0);
    }
    /**
     * 剔除尖锐平滑
     */
    step6CornerRemV(posX, posY) {
        let dataSrc = IndexGlobal.inst.detailMachine.statusPreview;
        this.jWebgl.useFbo(this.fboCornerDataCache);
        this.jWebgl.clear();
        this.jWebgl.programSmoothCornerRemoveV.uMvp.fill(this.mat4Mvp);
        this.jWebgl.programSmoothCornerRemoveV.uTextureSize.fill(dataSrc.textureWidth, dataSrc.textureHeight);
        this.jWebgl.programSmoothCornerRemoveV.uTextureMain.fillByFbo(this.fboTexture);
        this.jWebgl.programSmoothCornerRemoveV.uTextureCorner.fillByFbo(this.fboCornerData);
        this.jWebgl.programSmoothCornerRemoveV.uRight.fill(1);
        this.jWebgl.programSmoothCornerRemoveV.add(JWebglMathVector4.centerO, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, 2, 2);
        this.jWebgl.programSmoothCornerRemoveV.draw();
        this.drawFbo(this.fboCornerDataCache, posX, posY + 1);
        this.jWebgl.fillFbo(this.fboCornerData, this.fboCornerDataCache);
        this.smoothOrdinaryTo(posX, posY + 0);
    }
    /**
     * 角数据纹理 -> 平滑数据纹理
     */
    step7EnumRound(posX, posY) {
        let dataSrc = IndexGlobal.inst.detailMachine.statusPreview;
        this.jWebgl.useFbo(this.fboEnumDataCache);
        this.jWebgl.clear();
        this.jWebgl.programSmoothEnumRound.uMvp.fill(this.mat4Mvp);
        this.jWebgl.programSmoothEnumRound.uTextureSize.fill(dataSrc.textureWidth, dataSrc.textureHeight);
        this.jWebgl.programSmoothEnumRound.uTextureMain.fillByFbo(this.fboTexture);
        this.jWebgl.programSmoothEnumRound.uTextureCorner.fillByFbo(this.fboCornerData);
        this.jWebgl.programSmoothEnumRound.uRight.fill(1);
        this.jWebgl.programSmoothEnumRound.add(JWebglMathVector4.centerO, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, 2, 2);
        this.jWebgl.programSmoothEnumRound.draw();
        this.drawFbo(this.fboEnumDataCache, posX, posY + 1);
        this.jWebgl.fillFbo(this.fboEnumData, this.fboEnumDataCache);
        this.smoothOrdinaryTo(posX, posY + 0);
    }
    /**
     * 平滑数据纹理 -> 平滑数据纹理
     */
    step8EnumSide(posX, posY) {
        let dataSrc = IndexGlobal.inst.detailMachine.statusPreview;
        this.jWebgl.useFbo(this.fboEnumDataCache);
        this.jWebgl.clear();
        this.jWebgl.programSmoothEnumSide.uMvp.fill(this.mat4Mvp);
        this.jWebgl.programSmoothEnumSide.uTextureSize.fill(dataSrc.textureWidth, dataSrc.textureHeight);
        this.jWebgl.programSmoothEnumSide.uTextureMain.fillByFbo(this.fboTexture);
        this.jWebgl.programSmoothEnumSide.uTextureCorner.fillByFbo(this.fboCornerData);
        this.jWebgl.programSmoothEnumSide.uTextureEnum.fillByFbo(this.fboEnumData);
        this.jWebgl.programSmoothEnumSide.uRight.fill(1);
        this.jWebgl.programSmoothEnumSide.add(JWebglMathVector4.centerO, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, 2, 2);
        this.jWebgl.programSmoothEnumSide.draw();
        this.drawFbo(this.fboEnumDataCache, posX, posY + 1);
        this.jWebgl.fillFbo(this.fboEnumData, this.fboEnumDataCache);
        this.smoothOrdinaryTo(posX, posY + 0);
    }
    /**
     * 平滑数据纹理 -> 平滑区域纹理
     * @param posX
     * @param posY
     */
    step9Area(posX, posY) {
        let dataSrc = IndexGlobal.inst.detailMachine.statusPreview;
        this.jWebgl.programSmoothArea.uMvp.fill(this.mat4Mvp);
        this.jWebgl.programSmoothArea.uTextureSize.fill(dataSrc.textureWidth, dataSrc.textureHeight);
        this.jWebgl.programSmoothArea.uTextureMain.fillByFbo(this.fboTexture);
        this.jWebgl.programSmoothArea.uTextureCorner.fillByFbo(this.fboCornerData);
        this.jWebgl.programSmoothArea.uTextureEnum.fillByFbo(this.fboEnumData);
        this.jWebgl.useFbo(this.fboAreaLeft);
        this.jWebgl.clear();
        this.jWebgl.programSmoothArea.add(JWebglMathVector4.centerO, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, 2, 2);
        this.jWebgl.programSmoothArea.uRight.fill(1);
        this.jWebgl.programSmoothArea.draw();
        this.drawFbo(this.fboAreaLeft, posX, posY);
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
        let dataSrc = IndexGlobal.inst.detailMachine.statusPreview;
        this.jWebgl.programSmoothAngle.uMvp.fill(this.mat4Mvp);
        this.jWebgl.programSmoothAngle.uTextureSize.fill(dataSrc.textureWidth, dataSrc.textureHeight);
        this.jWebgl.programSmoothAngle.uTextureMain.fillByFbo(this.fboTexture);
        this.jWebgl.programSmoothAngle.uTextureCorner.fillByFbo(this.fboCornerData);
        this.jWebgl.programSmoothAngle.uTextureEnum.fillByFbo(this.fboEnumData);
        this.jWebgl.useFbo(this.fboAngleLeft);
        this.jWebgl.clear();
        this.jWebgl.programSmoothAngle.add(JWebglMathVector4.centerO, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, 2, 2);
        this.jWebgl.programSmoothAngle.uRight.fill(1);
        this.jWebgl.programSmoothAngle.draw();
        this.drawFbo(this.fboAngleLeft, posX, posY);
        this.jWebgl.useFbo(this.fboAngleRight);
        this.jWebgl.clear();
        this.jWebgl.programSmoothAngle.add(JWebglMathVector4.centerO, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, 2, 2);
        this.jWebgl.programSmoothAngle.uRight.fill(-1);
        this.jWebgl.programSmoothAngle.draw();
        this.drawFbo(this.fboAngleRight, posX + 1, posY);
    }
    render() {
        let dataSrc = IndexGlobal.inst.detailMachine.statusPreview;
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
                [MgrDomDefine.STYLE_WIDTH]: `${dataSrc.textureWidth * IndexGlobal.PIXEL_TEX_TO_SCREEN * HORIZON_COUNT}px`,
                [MgrDomDefine.STYLE_HEIGHT]: `${dataSrc.textureHeight * IndexGlobal.PIXEL_TEX_TO_SCREEN * VERTICAL_COUNT}px`,
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
            width: dataSrc.textureWidth * IndexGlobal.PIXEL_TEX_TO_SCREEN * HORIZON_COUNT * IndexGlobal.ANTINA,
            height: dataSrc.textureHeight * IndexGlobal.PIXEL_TEX_TO_SCREEN * VERTICAL_COUNT * IndexGlobal.ANTINA,
            style: {
                [MgrDomDefine.STYLE_WIDTH]: `${dataSrc.textureWidth * IndexGlobal.PIXEL_TEX_TO_SCREEN * HORIZON_COUNT}px`,
                [MgrDomDefine.STYLE_HEIGHT]: `${dataSrc.textureHeight * IndexGlobal.PIXEL_TEX_TO_SCREEN * VERTICAL_COUNT}px`,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_BLOCK
            }
        })))));
    }
}
export default DomRightSmoothCanvas;

import IndexGlobal from "../IndexGlobal.js";
import NodeModules from "../NodeModules.js";
import JWebgl from "../common/JWebgl.js";
import JWebglColor from "../common/JWebglColor.js";
import JWebglEnum from "../common/JWebglEnum.js";
import JWebglMathVector4 from "../common/JWebglMathVector4.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrData from "../mgr/MgrData.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
/**
 * 尝试更为灵魂的平滑
 */
class DomDrawingBoardRightPaintCanvasSource extends ReactComponentExtend {
    constructor() {
        super(...arguments);
        /**
         * 3d canvas 引用器
         */
        this.canvasWebglRef = NodeModules.react.createRef();
        /**
         * 线的起始位置
         */
        this.posFrom = new JWebglMathVector4(0, 0, 0);
        /**
         * 线的结束位置
         */
        this.posTo = new JWebglMathVector4(0, 0, 0);
    }
    reactComponentExtendOnInit() {
        this.jWebgl = new JWebgl(this.canvasWebglRef.current);
        this.jWebgl.init();
        this.jWebgl.canvasWebglCtx.disable(JWebglEnum.EnableCap.DEPTH_TEST);
        this.jWebgl.canvasWebglCtx.blendFunc(JWebglEnum.BlendFunc.ONE, JWebglEnum.BlendFunc.ZERO);
        this.jWebgl.evtTouchStart.on(() => {
            IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrStatus.onStart(this.jWebgl.currentTouch.posCanvas[0], this.jWebgl.currentTouch.posCanvas[1]);
            MgrData.inst.callDataChange();
        });
        this.jWebgl.evtTouchMove.on(() => {
            IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrStatus.onMove(this.jWebgl.currentTouch.posCanvas[0], this.jWebgl.currentTouch.posCanvas[1]);
            MgrData.inst.callDataChange();
        });
        this.jWebgl.evtTouchEnd.on(() => {
            IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrStatus.onEnd(this.jWebgl.currentTouch.posCanvas[0], this.jWebgl.currentTouch.posCanvas[1]);
            MgrData.inst.callDataChange();
        });
        this.jWebgl.evtEnter.on(() => {
            IndexGlobal.inst.mcRoot.statusDrawingBoard.hoverCurrStatus.onHoverEnter();
            MgrData.inst.callDataChange();
        });
        this.jWebgl.evtLeave.on(() => {
            IndexGlobal.inst.mcRoot.statusDrawingBoard.hoverCurrStatus.onHoverExit();
            MgrData.inst.callDataChange();
        });
    }
    reactComponentExtendOnRelease() {
        this.jWebgl.release();
    }
    reactComponentExtendOnDraw() {
        let dataSrc = IndexGlobal.inst.mcRoot.statusDrawingBoard.getCurrentCache();
        this.jWebgl.useFbo(null);
        this.jWebgl.clear();
        // 画布像素单位
        let canvasTextureUnit = 1 / (IndexGlobal.PIXEL_TEX_TO_SCREEN * IndexGlobal.ANTINA);
        // 网格
        let cameraWidth = dataSrc.dbImgData.width;
        let cameraHeight = dataSrc.dbImgData.height;
        this.jWebgl.mat4V.setLookAt(cameraWidth / 2, cameraHeight / 2, 1, cameraWidth / 2, cameraHeight / 2, 0, 0, 1, 0);
        this.jWebgl.mat4P.setOrtho(-cameraWidth / 2, cameraWidth / 2, -cameraHeight / 2, cameraHeight / 2, 0, 2);
        this.jWebgl.refreshMat4Mvp();
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
        // 已离开窗口，不绘制准星
        if (IndexGlobal.inst.mcRoot.statusDrawingBoard.hoverCurrStatus == IndexGlobal.inst.mcRoot.statusDrawingBoard.hoverStatusLeaved) {
            return;
        }
        ;
        let colorMark = JWebglColor.COLOR_PURE_RED;
        this.drawCross(colorMark, -1);
        this.drawCross(colorMark, 0);
        this.drawCross(colorMark, 1);
        this.drawMark(colorMark, -1);
        this.drawMark(colorMark, 0);
        this.drawMark(colorMark, 1);
    }
    /**
     * 绘制交叉线
     */
    drawCross(colorMark, unitOffset) {
        let dataSrc = IndexGlobal.inst.mcRoot.statusDrawingBoard.getCurrentCache();
        // 画布像素单位
        let canvasTextureUnit = 1 / (IndexGlobal.PIXEL_TEX_TO_SCREEN * IndexGlobal.ANTINA);
        // 网格
        let cameraWidth = dataSrc.dbImgData.width;
        let cameraHeight = dataSrc.dbImgData.height;
        this.jWebgl.mat4V.setLookAt(cameraWidth / 2, cameraHeight / 2, 1, cameraWidth / 2, cameraHeight / 2, 0, 0, 1, 0);
        this.jWebgl.mat4P.setOrtho(-cameraWidth / 2, cameraWidth / 2, -cameraHeight / 2, cameraHeight / 2, 0, 2);
        this.jWebgl.refreshMat4Mvp();
        this.jWebgl.programLine.uMvp.fill(this.jWebgl.mat4Mvp);
        let offset = canvasTextureUnit * unitOffset;
        // 竖线 - 上
        this.posFrom.elements[0] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridXFloat + offset;
        this.posFrom.elements[1] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridYInt + 1;
        this.posTo.elements[0] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridXFloat + offset;
        this.posTo.elements[1] = cameraHeight;
        this.jWebgl.programLine.add(this.posFrom, colorMark, this.posTo, colorMark);
        // 竖线 - 下
        this.posFrom.elements[0] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridXFloat + offset;
        this.posFrom.elements[1] = 0;
        this.posTo.elements[0] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridXFloat + offset;
        this.posTo.elements[1] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridYInt;
        this.jWebgl.programLine.add(this.posFrom, colorMark, this.posTo, colorMark);
        // 横线 - 左
        this.posFrom.elements[0] = 0;
        this.posFrom.elements[1] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridYFloat + offset;
        this.posTo.elements[0] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridXInt;
        this.posTo.elements[1] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridYFloat + offset;
        this.jWebgl.programLine.add(this.posFrom, colorMark, this.posTo, colorMark);
        // 横线 - 右
        this.posFrom.elements[0] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridXInt + 1;
        this.posFrom.elements[1] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridYFloat + offset;
        this.posTo.elements[0] = cameraWidth;
        this.posTo.elements[1] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridYFloat + offset;
        this.jWebgl.programLine.add(this.posFrom, colorMark, this.posTo, colorMark);
    }
    /**
     * 绘制方块
     */
    drawMark(colorMark, unitOffset) {
        let dataSrc = IndexGlobal.inst.mcRoot.statusDrawingBoard.getCurrentCache();
        // 画布像素单位
        let canvasTextureUnit = 1 / (IndexGlobal.PIXEL_TEX_TO_SCREEN * IndexGlobal.ANTINA);
        // 网格
        let cameraWidth = dataSrc.dbImgData.width;
        let cameraHeight = dataSrc.dbImgData.height;
        this.jWebgl.mat4V.setLookAt(cameraWidth / 2, cameraHeight / 2, 1, cameraWidth / 2, cameraHeight / 2, 0, 0, 1, 0);
        this.jWebgl.mat4P.setOrtho(-cameraWidth / 2, cameraWidth / 2, -cameraHeight / 2, cameraHeight / 2, 0, 2);
        this.jWebgl.refreshMat4Mvp();
        this.jWebgl.programLine.uMvp.fill(this.jWebgl.mat4Mvp);
        // 【准星 - 方块】
        let offset = canvasTextureUnit * unitOffset;
        // 线 - 左
        this.posFrom.elements[0] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridXInt + offset;
        this.posFrom.elements[1] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridYInt + offset;
        this.posTo.elements[0] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridXInt + offset;
        this.posTo.elements[1] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridYInt - offset + 1;
        this.jWebgl.programLine.add(this.posFrom, colorMark, this.posTo, colorMark);
        // 线 - 上
        this.posFrom.elements[0] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridXInt + offset;
        this.posFrom.elements[1] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridYInt - offset + 1;
        this.posTo.elements[0] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridXInt - offset + 1;
        this.posTo.elements[1] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridYInt - offset + 1;
        this.jWebgl.programLine.add(this.posFrom, colorMark, this.posTo, colorMark);
        // 线 - 右
        this.posFrom.elements[0] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridXInt - offset + 1;
        this.posFrom.elements[1] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridYInt - offset + 1;
        this.posTo.elements[0] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridXInt - offset + 1;
        this.posTo.elements[1] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridYInt + offset;
        this.jWebgl.programLine.add(this.posFrom, colorMark, this.posTo, colorMark);
        // 线 - 下
        this.posFrom.elements[0] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridXInt - offset + 1;
        this.posFrom.elements[1] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridYInt + offset;
        this.posTo.elements[0] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridXInt + offset;
        this.posTo.elements[1] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridYInt + offset;
        this.jWebgl.programLine.add(this.posFrom, colorMark, this.posTo, colorMark);
        this.jWebgl.programLine.draw();
    }
    render() {
        let dataSrc = IndexGlobal.inst.mcRoot.statusDrawingBoard.getCurrentCache();
        return ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_WIDTH]: MgrDomDefine.STYLE_HEIGHT_PERCENTAGE_0,
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
                [MgrDomDefine.STYLE_WIDTH]: `${dataSrc.dbImgData.width * IndexGlobal.PIXEL_TEX_TO_SCREEN}px`,
                [MgrDomDefine.STYLE_HEIGHT]: `${dataSrc.dbImgData.height * IndexGlobal.PIXEL_TEX_TO_SCREEN}px`,
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
            width: dataSrc.dbImgData.width * IndexGlobal.PIXEL_TEX_TO_SCREEN * IndexGlobal.ANTINA,
            height: dataSrc.dbImgData.height * IndexGlobal.PIXEL_TEX_TO_SCREEN * IndexGlobal.ANTINA,
            style: {
                [MgrDomDefine.STYLE_WIDTH]: `${dataSrc.dbImgData.width * IndexGlobal.PIXEL_TEX_TO_SCREEN}px`,
                [MgrDomDefine.STYLE_HEIGHT]: `${dataSrc.dbImgData.height * IndexGlobal.PIXEL_TEX_TO_SCREEN}px`,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_BLOCK
            }
        })))));
    }
}
export default DomDrawingBoardRightPaintCanvasSource;

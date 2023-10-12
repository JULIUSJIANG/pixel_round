import IndexGlobal from "../IndexGlobal.js";
import NodeModules from "../NodeModules.js";
import JWebgl from "../common/JWebgl.js";
import JWebglColor from "../common/JWebglColor.js";
import JWebglMathVector4 from "../common/JWebglMathVector4.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
const Z_GRID = 0.1;
class DomExperimentRightPreviewImgBeforeWebglCutted extends ReactComponentExtend {
    constructor() {
        super(...arguments);
        /**
         * 3d canvas 引用器
         */
        this.canvasWebglRef = NodeModules.react.createRef();
        /**
         * 2d canvas 引用器
         */
        this.canvas2dRef = NodeModules.react.createRef();
        /**
         * 点的起始位置
         */
        this.posFrom = new JWebglMathVector4(0, 0, Z_GRID);
        /**
         * 点的结束位置
         */
        this.posTo = new JWebglMathVector4(0, 0, Z_GRID);
    }
    reactComponentExtendOnInit() {
        this.jWebgl = new JWebgl(this.canvasWebglRef.current);
        this.jWebgl.init();
        this.canvas2d = this.canvas2dRef.current;
        this.canvas2dCtx = this.canvas2d.getContext(`2d`);
    }
    reactComponentExtendOnRelease() {
        this.jWebgl.release();
    }
    reactComponentExtendOnDraw() {
        let dataSrc = IndexGlobal.mcExp().statusPreview;
        let imgMachine = dataSrc.imgMachine;
        // 没加载完毕，不对画布进行改动
        if (imgMachine.currStatus == imgMachine.statusIdle) {
            return;
        }
        ;
        // 初始化 fbo
        if (this.fbo == null || this.fbo.width != dataSrc.textureWidth || this.fbo.height != dataSrc.textureHeight) {
            this.fbo = this.jWebgl.getFbo(dataSrc.textureWidth, dataSrc.textureHeight);
        }
        ;
        // 得到简略图
        dataSrc.drawImgPadding(this.jWebgl, this.fbo);
        // 把 fbo 绘制到屏幕
        this.jWebgl.fillFboByFbo(null, this.fbo);
        // 网格
        this.jWebgl.mat4V.setLookAt(dataSrc.textureWidth / 2, dataSrc.textureHeight / 2, 1, dataSrc.textureWidth / 2, dataSrc.textureHeight / 2, 0, 0, 1, 0);
        this.jWebgl.mat4P.setOrtho(-dataSrc.textureWidth / 2, dataSrc.textureWidth / 2, -dataSrc.textureHeight / 2, dataSrc.textureHeight / 2, 0, 2);
        this.jWebgl.refreshMat4Mvp();
        this.jWebgl.programLine.uMvp.fill(this.jWebgl.mat4Mvp);
        let colorGrid = JWebglColor.COLOR_BLACK;
        for (let i = 0; i <= dataSrc.textureWidth; i++) {
            this.posFrom.elements[0] = i;
            this.posFrom.elements[1] = 0;
            this.posTo.elements[0] = i;
            this.posTo.elements[1] = dataSrc.textureHeight;
            this.jWebgl.programLine.add(this.posFrom, colorGrid, this.posTo, colorGrid);
        }
        ;
        for (let i = 0; i <= dataSrc.textureHeight; i++) {
            this.posFrom.elements[0] = 0;
            this.posFrom.elements[1] = i;
            this.posTo.elements[0] = dataSrc.textureWidth;
            this.posTo.elements[1] = i;
            this.jWebgl.programLine.add(this.posFrom, colorGrid, this.posTo, colorGrid);
        }
        ;
        this.jWebgl.programLine.draw();
        this.canvas2dCtx.clearRect(0, 0, this.canvas2d.width, this.canvas2d.height);
        this.canvas2dCtx.font = `10px Microsoft YaHei`;
        this.canvas2dCtx.textAlign = "center";
        this.canvas2dCtx.textBaseline = `middle`;
        for (let x = 0; x < dataSrc.textureWidth; x++) {
            for (let y = 0; y < dataSrc.textureHeight; y++) {
                let colorId = dataSrc.binXYToColorUint[y * dataSrc.textureWidth + x];
                let colorInst = dataSrc.mapIdToColor.get(colorId);
                if (colorInst == null) {
                    continue;
                }
                ;
                this.canvas2dCtx.fillStyle = colorInst.colorRel.str2dText;
                this.canvas2dCtx.fillText(`${colorInst.idx}`, (x + 0.5) * IndexGlobal.PIXEL_TEX_TO_SCREEN, ((dataSrc.textureHeight - y) - 0.5) * IndexGlobal.PIXEL_TEX_TO_SCREEN);
            }
            ;
        }
        ;
    }
    render() {
        let dataSrc = IndexGlobal.mcExp().statusPreview;
        return ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_HEIGHT]: MgrDomDefine.STYLE_WIDTH_PERCENTAGE_0,
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
                [MgrDomDefine.STYLE_WIDTH]: `${dataSrc.textureWidth * IndexGlobal.PIXEL_TEX_TO_SCREEN}px`,
                [MgrDomDefine.STYLE_HEIGHT]: `${dataSrc.textureHeight * IndexGlobal.PIXEL_TEX_TO_SCREEN}px`,
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
            width: dataSrc.textureWidth * IndexGlobal.PIXEL_TEX_TO_SCREEN * IndexGlobal.ANTINA,
            height: dataSrc.textureHeight * IndexGlobal.PIXEL_TEX_TO_SCREEN * IndexGlobal.ANTINA,
            style: {
                [MgrDomDefine.STYLE_WIDTH]: `${dataSrc.textureWidth * IndexGlobal.PIXEL_TEX_TO_SCREEN}px`,
                [MgrDomDefine.STYLE_HEIGHT]: `${dataSrc.textureHeight * IndexGlobal.PIXEL_TEX_TO_SCREEN}px`,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_BLOCK
            }
        })), ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_WIDTH]: 0,
                [MgrDomDefine.STYLE_HEIGHT]: 0,
                [MgrDomDefine.STYLE_POSITION]: MgrDomDefine.STYLE_POSITION_RELATIVE,
                [MgrDomDefine.STYLE_LEFT]: 0,
                [MgrDomDefine.STYLE_TOP]: 0,
            }
        }, ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_CANVAS, {
            ref: this.canvas2dRef,
            width: dataSrc.textureWidth * IndexGlobal.PIXEL_TEX_TO_SCREEN,
            height: dataSrc.textureHeight * IndexGlobal.PIXEL_TEX_TO_SCREEN,
            style: {
                [MgrDomDefine.STYLE_WIDTH]: `${dataSrc.textureWidth * IndexGlobal.PIXEL_TEX_TO_SCREEN}px`,
                [MgrDomDefine.STYLE_HEIGHT]: `${dataSrc.textureHeight * IndexGlobal.PIXEL_TEX_TO_SCREEN}px`,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_BLOCK
            }
        })))));
    }
}
export default DomExperimentRightPreviewImgBeforeWebglCutted;

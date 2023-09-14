import IndexGlobal from "../IndexGlobal.js";
import NodeModules from "../NodeModules.js";
import JWebgl from "../common/JWebgl.js";
import JWebglMathMatrix4 from "../common/JWebglMathMatrix4.js";
import JWebglMathVector4 from "../common/JWebglMathVector4.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
/**
 * 宽
 */
const WIDTH = 400;
/**
 * 高
 */
const HEIGHT = 400;
export default class DomRightCreate extends ReactComponentExtend {
    constructor() {
        super(...arguments);
        /**
         * 3d canvas 引用器
         */
        this.canvasWebglRef = NodeModules.react.createRef();
        this.mat4M = new JWebglMathMatrix4();
        this.mat4V = new JWebglMathMatrix4();
        this.mat4P = new JWebglMathMatrix4();
    }
    reactComponentExtendOnInit() {
        this.jWebgl = new JWebgl(this.canvasWebglRef.current);
        this.jWebgl.init();
        this.mat4M.setIdentity();
        this.mat4V.setLookAt(0, 0, 1, 0, 0, 0, 0, 1, 0);
    }
    reactComponentExtendOnDraw() {
        // 清除画面
        this.jWebgl.clear();
        this.mat4P.setOrtho(-IndexGlobal.inst.createMachine.canvasWidth / 2, IndexGlobal.inst.createMachine.canvasWidth / 2, -IndexGlobal.inst.createMachine.canvasHeight / 2, IndexGlobal.inst.createMachine.canvasHeight / 2, 0, 2);
        JWebglMathMatrix4.multiplayMat4List(this.mat4P, this.mat4V, this.mat4M, this.jWebgl.mat4Mvp);
        // this.jWebgl.programImg.uMvp.fill (this.jWebgl.mat4Mvp);
        // this.jWebgl.programImg.uSampler.fill (this.jWebgl.getImg (IndexGlobal.inst.createMachine.img.src));
        // this.jWebgl.programImg.add (
        //     JWebglMathVector4.centerO,
        //     JWebglMathVector4.axisZStart,
        //     JWebglMathVector4.axisYEnd,
        //     IndexGlobal.inst.createMachine.canvasWidth,
        //     IndexGlobal.inst.createMachine.canvasHeight
        // );
        // this.jWebgl.programImg.draw ();
        this.jWebgl.programBlur.uMvp.fill(this.jWebgl.mat4Mvp);
        this.jWebgl.programBlur.uSampler.fill(this.jWebgl.getImg(`./resources/sky_256.jpg`));
        this.jWebgl.programBlur.uNoise.fill(this.jWebgl.getImg(`./resources/noise.png`));
        this.jWebgl.programBlur.add(JWebglMathVector4.centerO, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, IndexGlobal.inst.createMachine.canvasWidth, IndexGlobal.inst.createMachine.canvasHeight);
        this.jWebgl.programBlur.draw();
    }
    render() {
        return ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_WIDTH]: MgrDomDefine.STYLE_WIDTH_PERCENTAGE_0,
                [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.CONFIG_TXT_BG_COLOR,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN,
            }
        }, ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_HEIGHT]: MgrDomDefine.STYLE_WIDTH_PERCENTAGE_0,
                [MgrDomDefine.STYLE_FLEX_GROW]: 1,
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
                [MgrDomDefine.STYLE_OVERFLOW_X]: MgrDomDefine.STYLE_OVERFLOW_X_SCROLL,
                [MgrDomDefine.STYLE_OVERFLOW_Y]: MgrDomDefine.STYLE_OVERFLOW_Y_SCROLL
            }
        }, 
        // 滚动的列表
        ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_WIDTH]: `${WIDTH}px`,
                [MgrDomDefine.STYLE_HEIGHT]: `${HEIGHT}px`,
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
            width: WIDTH,
            height: HEIGHT,
            style: {
                [MgrDomDefine.STYLE_WIDTH]: `${WIDTH}px`,
                [MgrDomDefine.STYLE_HEIGHT]: `${HEIGHT}px`,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_BLOCK
            }
        }))))));
    }
}

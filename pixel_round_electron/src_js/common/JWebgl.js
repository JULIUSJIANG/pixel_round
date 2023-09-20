var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import JWebglEnum from "./JWebglEnum.js";
import JWebglFrameBuffer from "./JWebglFrameBuffer.js";
import JWebglImage from "./JWebglImage.js";
import JWebglMathMatrix4 from "./JWebglMathMatrix4.js";
import JWebglProgramTypeImg from "./JWebglProgramTypeImg.js";
import JWebglProgramTypeLine from "./JWebglProgramTypeLine.js";
import JWebglProgramTypePoint from "./JWebglProgramTypePoint.js";
import JWebglProgramTypeSmooth1 from "./JWebglProgramTypeSmooth1.js";
import JWebglProgramTypeTriangle from "./JWebglProgramTypeTriangle.js";
const SYMBOL_KEY = Symbol(`JWebgl.SYMBOL_KEY`);
/**
 * 获取原型上的缓存
 * @param c
 * @returns
 */
export function getCache(c) {
    if (!c[SYMBOL_KEY]) {
        let cache = {
            mapPropsNameToProgramClass: new Map()
        };
        c[SYMBOL_KEY] = cache;
    }
    ;
    return c[SYMBOL_KEY];
}
/**
 * 着色程序
 * @param t
 */
export function program(t) {
    return function decorator(inst, propsName) {
        let cache = getCache(inst);
        cache.mapPropsNameToProgramClass.set(propsName, t);
    };
}
class JWebgl {
    constructor(canvasWebgl) {
        /**
         * 所有着色程序的集合
         */
        this._listProgram = new Array();
        /**
         * mvp 矩阵
         */
        this.mat4Mvp = new JWebglMathMatrix4;
        /**
         * 资源路径到资源图片的映射
         */
        this._mapStringToImg = new Map();
        this.canvasWebgl = canvasWebgl;
    }
    /**
     * 初始化
     * @returns
     */
    init() {
        this.canvasWebglCtx = this.canvasWebgl.getContext(`webgl`, {
            premultipliedAlpha: false
        });
        this.canvasWebglCtx.enable(JWebglEnum.EnableCap.DEPTH_TEST);
        this.canvasWebglCtx.enable(JWebglEnum.EnableCap.BLEND);
        this.canvasWebglCtx.blendFunc(JWebglEnum.BlendFunc.SRC_ALPHA, JWebglEnum.BlendFunc.ONE_MINUS_SRC_ALPHA);
        this.canvasWebglCtx.clearColor(0, 0, 0, 0);
        this._attributeBuffer = this.canvasWebglCtx.createBuffer();
        if (this._attributeBuffer == null) {
            this.error(`创建 buffer 失败`);
            return;
        }
        ;
        this._elementBuffer = this.canvasWebglCtx.createBuffer();
        if (this._elementBuffer == null) {
            this.error(`创建 buffer 失败`);
            return;
        }
        ;
        let symbolCache = getCache(this);
        symbolCache.mapPropsNameToProgramClass.forEach((programClass, propsName) => {
            let program = new programClass(this, propsName);
            program.init();
            this._listProgram.push(program);
            this[propsName] = program;
        });
    }
    useProgram(program) {
        if (program == this._program) {
            return;
        }
        ;
        this._program = program;
        this.canvasWebglCtx.useProgram(this._program.program);
    }
    useFbo(fbo) {
        let sizeWidth = this.canvasWebgl.width;
        let sizeHeight = this.canvasWebgl.height;
        if (this._currFbo != fbo) {
            this._currFbo = fbo;
            if (this._currFbo != null) {
                sizeWidth = fbo.width;
                sizeHeight = fbo.height;
                this.canvasWebglCtx.bindFramebuffer(JWebglEnum.BindFramebufferTarget.FRAMEBUFFER, this._currFbo.frameBuffer);
            }
            ;
            if (this._currFbo == null) {
                this.canvasWebglCtx.bindFramebuffer(JWebglEnum.BindFramebufferTarget.FRAMEBUFFER, null);
            }
            ;
        }
        ;
        this.canvasWebglCtx.viewport(0, 0, sizeWidth, sizeHeight);
    }
    clear() {
        this.canvasWebglCtx.clear(JWebglEnum.ClearMask.COLOR_BUFFER_BIT | JWebglEnum.ClearMask.DEPTH_BUFFER_BIT);
    }
    getImg(dataUrl) {
        if (!this._mapStringToImg.has(dataUrl)) {
            this._mapStringToImg.set(dataUrl, new JWebglImage(this, dataUrl));
        }
        ;
        return this._mapStringToImg.get(dataUrl);
    }
    getFbo(width, height) {
        return new JWebglFrameBuffer(this, width, height);
    }
    /**
     * 输出日志
     * @param args
     */
    log(...args) {
        console.log(...args);
    }
    /**
     * 输出错误报告
     * @param args
     */
    error(...args) {
        console.error(...args);
    }
}
__decorate([
    program(JWebglProgramTypeLine)
], JWebgl.prototype, "programLine", void 0);
__decorate([
    program(JWebglProgramTypeTriangle)
], JWebgl.prototype, "programTriangle", void 0);
__decorate([
    program(JWebglProgramTypeImg)
], JWebgl.prototype, "programImg", void 0);
__decorate([
    program(JWebglProgramTypeSmooth1)
], JWebgl.prototype, "programSmooth1", void 0);
__decorate([
    program(JWebglProgramTypePoint)
], JWebgl.prototype, "programPoint", void 0);
export default JWebgl;

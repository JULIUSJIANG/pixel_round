var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Eventer from "./Eventer.js";
import JWebglEnum from "./JWebglEnum.js";
import JWebglFrameBuffer from "./JWebglFrameBuffer.js";
import JWebglImage from "./JWebglImage.js";
import JWebglMathMatrix4 from "./JWebglMathMatrix4.js";
import JWebglMathVector4 from "./JWebglMathVector4.js";
import JWebglProgramTypeImg from "./JWebglProgramTypeImg.js";
import JWebglProgramTypeImgDyeing from "./JWebglProgramTypeImgDyeing.js";
import JWebglProgramTypeLine from "./JWebglProgramTypeLine.js";
import JWebglProgramTypePoint from "./JWebglProgramTypePoint.js";
import JWebglProgramTypeSmoothCornerData from "./JWebglProgramTypeSmoothCornerData.js";
import JWebglProgramTypeSmoothTickness from "./JWebglProgramTypeSmoothTickness.js";
import JWebglProgramTypeSmoothCornerRemoveT from "./JWebglProgramTypeSmoothCornerRemoveT.js";
import JWebglProgramTypeSmoothCornerRemoveX from "./JWebglProgramTypeSmoothCornerRemoveX.js";
import JWebglProgramTypeSmoothDisplayOrdinary from "./JWebglProgramTypeSmoothDisplayOrdinary.js";
import JWebglProgramTypeTriangle from "./JWebglProgramTypeTriangle.js";
import JWebglTouch from "./JWebglTouch.js";
import objectPool from "./ObjectPool.js";
import JWebglProgramTypeSmoothFlat from "./JWebglProgramTypeSmoothFlat.js";
import JWebglProgramTypeSmoothCornerRemoveI from "./JWebglProgramTypeSmoothCornerRemoveI.js";
import JWebglProgramTypeSmoothCornerRemoveV from "./JWebglProgramTypeSmoothCornerRemoveV.js";
import JWebglProgramTypeSmoothCornerRemoveA from "./JWebglProgramTypeSmoothCornerRemoveA.js";
import JWebglProgramTypeSmoothEnumRound from "./JWebglProgramTypeSmoothEnumRound.js";
import JWebglProgramTypeSmoothEnumSide from "./JWebglProgramTypeSmoothEnumSide.js";
import JWebglProgramTypeSmoothArea from "./JWebglProgramTypeSmoothArea.js";
import JWebglProgramTypeSmoothDisplayCircle from "./JWebglProgramTypeSmoothDisplayCircle.js";
import JWebglProgramTypeSmoothAngle from "./JWebglProgramTypeSmoothAngle.js";
import MgrGlobal from "../mgr/MgrGlobal.js";
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
         * 事件派发 - 交互起始
         */
        this.evtTouchStart = new Eventer();
        /**
         * 事件派发 - 交互拖拽
         */
        this.evtTouchMove = new Eventer();
        /**
         * 事件派发 - 交互结束
         */
        this.evtTouchEnd = new Eventer();
        /**
         * 事件派发 - 发生交互
         */
        this.evtTouch = new Eventer();
        /**
         * 事件派发 - 进入
         */
        this.evtEnter = new Eventer();
        /**
         * 事件派发 - 离开
         */
        this.evtLeave = new Eventer();
        /**
         * 模型矩阵
         */
        this.mat4M = new JWebglMathMatrix4();
        /**
         * 视图矩阵
         */
        this.mat4V = new JWebglMathMatrix4();
        /**
         * 投影矩阵
         */
        this.mat4P = new JWebglMathMatrix4();
        /**
         * mvp 矩阵
         */
        this.mat4Mvp = new JWebglMathMatrix4;
        /**
         * 资源路径到资源图片的映射
         */
        this._mapStringToImg = new Map();
        this.canvasWebgl = canvasWebgl;
        this.touchStart = new JWebglTouch(this);
        this.touchMove = new JWebglTouch(this);
        this.touchEnd = new JWebglTouch(this);
    }
    /**
     * 初始化
     * @returns
     */
    init() {
        this.listenIdStart = MgrGlobal.inst.evtTouchStart.on(() => {
            this.touchStart.fill(MgrGlobal.inst.evtTouchStartPos);
            this.currentTouch = this.touchStart;
            this.evtTouch.call(null);
            this.evtTouchStart.call(null);
        });
        this.listenIdMove = MgrGlobal.inst.evtTouchMove.on(() => {
            this.touchMove.fill(MgrGlobal.inst.evtTouchMovePos);
            this.currentTouch = this.touchMove;
            this.evtTouch.call(null);
            this.evtTouchMove.call(null);
        });
        this.listenIdEnd = MgrGlobal.inst.evtTouchEnd.on(() => {
            this.touchEnd.fill(MgrGlobal.inst.evtTouchEndPos);
            this.currentTouch = this.touchEnd;
            this.evtTouch.call(null);
            this.evtTouchEnd.call(null);
        });
        this.listenIdEnter = MgrGlobal.inst.evtEnter.on(() => {
            this.evtEnter.call(null);
        });
        this.listenIdExit = MgrGlobal.inst.evtExit.on(() => {
            this.evtLeave.call(null);
        });
        this.mat4M.setIdentity();
        this.mat4V.setIdentity();
        this.mat4P.setIdentity();
        this.refreshMat4Mvp();
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
    /**
     * 释放掉
     */
    release() {
        MgrGlobal.inst.evtTouchStart.off(this.listenIdStart);
        MgrGlobal.inst.evtTouchStart.off(this.listenIdMove);
        MgrGlobal.inst.evtTouchStart.off(this.listenIdEnd);
        MgrGlobal.inst.evtEnter.off(this.listenIdEnter);
        MgrGlobal.inst.evtExit.off(this.listenIdExit);
        let ext = this.canvasWebglCtx.getExtension(`WEBGL_lose_context`);
        if (ext) {
            ext.loseContext();
        }
        ;
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
    /**
     * 刷新模型 - 视图 - 投影矩阵
     */
    refreshMat4Mvp() {
        JWebglMathMatrix4.multiplayMat4List(this.mat4P, this.mat4V, this.mat4M, this.mat4Mvp);
    }
    /**
     * 获取图片资源
     * @param dataUrl
     * @returns
     */
    getImg(dataUrl) {
        if (!this._mapStringToImg.has(dataUrl)) {
            this._mapStringToImg.set(dataUrl, new JWebglImage(this, dataUrl));
        }
        ;
        return this._mapStringToImg.get(dataUrl);
    }
    /**
     * 获取帧缓冲区
     * @param width
     * @param height
     * @returns
     */
    getFbo(width, height) {
        return new JWebglFrameBuffer(this, width, height);
    }
    /**
     * 销毁帧缓冲区
     * @param fbo
     */
    destroyFbo(fbo) {
        if (fbo == null) {
            return;
        }
        ;
        this.canvasWebglCtx.deleteFramebuffer(fbo.frameBuffer);
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
    /**
     * 把 fbo 的内容绘制出来
     * @param fboDisplay
     * @param fboSrc
     */
    fillFbo(fboDisplay, fboSrc) {
        this.useFbo(fboDisplay);
        this.clear();
        let mat4M = objectPool.pop(JWebglMathMatrix4.poolType);
        mat4M.setIdentity();
        let mat4V = objectPool.pop(JWebglMathMatrix4.poolType);
        mat4V.setLookAt(0, 0, 1, 0, 0, 0, 0, 1, 0);
        let mat4P = objectPool.pop(JWebglMathMatrix4.poolType);
        mat4P.setOrtho(-1, 1, -1, 1, 0, 2);
        let mat4Mvp = objectPool.pop(JWebglMathMatrix4.poolType);
        JWebglMathMatrix4.multiplayMat4List(mat4P, mat4V, mat4M, mat4Mvp);
        this.programImg.uMvp.fill(mat4Mvp);
        this.programImg.uTexture.fillByFbo(fboSrc);
        this.programImg.add(JWebglMathVector4.centerO, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, 2, 2);
        this.programImg.draw();
        objectPool.push(mat4M, mat4V, mat4P, mat4Mvp);
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
    program(JWebglProgramTypeImgDyeing)
], JWebgl.prototype, "programImgDyeing", void 0);
__decorate([
    program(JWebglProgramTypePoint)
], JWebgl.prototype, "programPoint", void 0);
__decorate([
    program(JWebglProgramTypeSmoothTickness)
], JWebgl.prototype, "programSmoothTickness", void 0);
__decorate([
    program(JWebglProgramTypeSmoothFlat)
], JWebgl.prototype, "programSmoothFlat", void 0);
__decorate([
    program(JWebglProgramTypeSmoothCornerData)
], JWebgl.prototype, "programSmoothCornerData", void 0);
__decorate([
    program(JWebglProgramTypeSmoothCornerRemoveA)
], JWebgl.prototype, "programSmoothCornerRemoveA", void 0);
__decorate([
    program(JWebglProgramTypeSmoothCornerRemoveX)
], JWebgl.prototype, "programSmoothCornerRemoveX", void 0);
__decorate([
    program(JWebglProgramTypeSmoothCornerRemoveT)
], JWebgl.prototype, "programSmoothCornerRemoveT", void 0);
__decorate([
    program(JWebglProgramTypeSmoothCornerRemoveI)
], JWebgl.prototype, "programSmoothCornerRemoveI", void 0);
__decorate([
    program(JWebglProgramTypeSmoothCornerRemoveV)
], JWebgl.prototype, "programSmoothCornerRemoveV", void 0);
__decorate([
    program(JWebglProgramTypeSmoothEnumRound)
], JWebgl.prototype, "programSmoothEnumRound", void 0);
__decorate([
    program(JWebglProgramTypeSmoothEnumSide)
], JWebgl.prototype, "programSmoothEnumSide", void 0);
__decorate([
    program(JWebglProgramTypeSmoothArea)
], JWebgl.prototype, "programSmoothArea", void 0);
__decorate([
    program(JWebglProgramTypeSmoothAngle)
], JWebgl.prototype, "programSmoothAngle", void 0);
__decorate([
    program(JWebglProgramTypeSmoothDisplayOrdinary)
], JWebgl.prototype, "programSmoothDisplayOrdinary", void 0);
__decorate([
    program(JWebglProgramTypeSmoothDisplayCircle)
], JWebgl.prototype, "programSmoothDisplayCircle", void 0);
export default JWebgl;

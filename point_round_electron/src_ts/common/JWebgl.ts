import Eventer from "./Eventer.js";
import JWebglEnum from "./JWebglEnum.js";
import JWebglFrameBuffer from "./JWebglFrameBuffer.js";
import JWebglImage from "./JWebglImage.js";
import JWebglMathMatrix4 from "./JWebglMathMatrix4.js";
import JWebglMathVector4 from "./JWebglMathVector4.js";
import JWebglProgram from "./JWebglProgram.js";
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

const SYMBOL_KEY = Symbol (`JWebgl.SYMBOL_KEY`);

/**
 * 原型上的记录
 */
export interface SymbolCache {
    /**
     * 属性名到着色程序的映射
     */
    mapPropsNameToProgramClass: Map <string, typeof JWebglProgram>;
}

/**
 * 获取原型上的缓存
 * @param c 
 * @returns 
 */
export function getCache (c: JWebgl): SymbolCache {
    if (!c [SYMBOL_KEY]) {
        let cache: SymbolCache = {
            mapPropsNameToProgramClass: new Map ()
        };
        c [SYMBOL_KEY] = cache;
    };
    return c [SYMBOL_KEY];
}

/**
 * 着色程序
 * @param t 
 */
export function program <T extends typeof JWebglProgram> (t: T) {
    return function decorator (inst: JWebgl, propsName: string) {
        let cache = getCache (inst);
        cache.mapPropsNameToProgramClass.set (propsName, t);
    }
}

class JWebgl {
    /**
     * webgl 的画布
     */
    canvasWebgl: HTMLCanvasElement;
    /**
     * 3d 上下文
     */
    canvasWebglCtx: WebGLRenderingContext;

    constructor (
        canvasWebgl: HTMLCanvasElement
    )
    {
        this.canvasWebgl = canvasWebgl;
        this.touchStart = new JWebglTouch (this);
        this.touchMove = new JWebglTouch (this);
        this.touchEnd = new JWebglTouch (this);
    }

    /**
     * 所有着色程序的集合
     */
    private _listProgram = new Array <JWebglProgram> ();

    /**
     * 交互起始位置
     */
    touchStart: JWebglTouch;
    /**
     * 事件派发 - 交互起始
     */
    evtTouchStart = new Eventer ();

    /**
     * 交互拖拽位置
     */
    touchMove: JWebglTouch;
    /**
     * 事件派发 - 交互拖拽
     */
    evtTouchMove = new Eventer ();

    /**
     * 交互结束位置
     */
    touchEnd: JWebglTouch;
    /**
     * 事件派发 - 交互结束
     */
    evtTouchEnd = new Eventer ();

    /**
     * 当前交互位置
     */
    currentTouch: JWebglTouch;
    /**
     * 事件派发 - 发生交互
     */
    evtTouch = new Eventer ();

    /**
     * 事件派发 - 进入
     */
    evtEnter = new Eventer ();

    /**
     * 事件派发 - 离开
     */
    evtLeave = new Eventer ();

    /**
     * 监听 id - 开始
     */
    listenIdStart: number;
    /**
     * 监听 id - 交互中
     */
    listenIdMove: number;
    /**
     * 监听 id - 结束
     */
    listenIdEnd: number;

    /**
     * 监听 id - 进入
     */
    listenIdEnter: number;
    /**
     * 监听 id - 离开
     */
    listenIdExit: number;

    /**
     * 初始化
     * @returns 
     */
    init () {
        this.listenIdStart = MgrGlobal.inst.evtTouchStart.on (() => {
            this.touchStart.fill (MgrGlobal.inst.evtTouchStartPos);
            this.currentTouch = this.touchStart;
            this.evtTouch.call (null);
            this.evtTouchStart.call (null);
        });
        this.listenIdMove = MgrGlobal.inst.evtTouchMove.on (() => {
            this.touchMove.fill (MgrGlobal.inst.evtTouchMovePos);
            this.currentTouch = this.touchMove;
            this.evtTouch.call (null);
            this.evtTouchMove.call (null);
        });
        this.listenIdEnd = MgrGlobal.inst.evtTouchEnd.on (() => {
            this.touchEnd.fill (MgrGlobal.inst.evtTouchEndPos);
            this.currentTouch = this.touchEnd;
            this.evtTouch.call (null);
            this.evtTouchEnd.call (null);
        });

        this.listenIdEnter = MgrGlobal.inst.evtEnter.on (() => {
            this.evtEnter.call (null);
        });
        this.listenIdExit = MgrGlobal.inst.evtExit.on (() => {
            this.evtLeave.call (null);
        });

        this.mat4M.setIdentity ();
        this.mat4V.setIdentity ();
        this.mat4P.setIdentity ();
        this.refreshMat4Mvp ();

        this.canvasWebglCtx = this.canvasWebgl.getContext (
            `webgl`,
            {
                premultipliedAlpha: false
            }
        );
    
        this.canvasWebglCtx.enable (JWebglEnum.EnableCap.DEPTH_TEST);
        this.canvasWebglCtx.enable (JWebglEnum.EnableCap.BLEND);
        this.canvasWebglCtx.blendFunc (JWebglEnum.BlendFunc.SRC_ALPHA, JWebglEnum.BlendFunc.ONE_MINUS_SRC_ALPHA);
        this.canvasWebglCtx.clearColor (0, 0, 0, 0);

        this._attributeBuffer = this.canvasWebglCtx.createBuffer ();
        if (this._attributeBuffer == null) {
            this.error (`创建 buffer 失败`);
            return;
        };

        this._elementBuffer = this.canvasWebglCtx.createBuffer ();
        if (this._elementBuffer == null) {
            this.error (`创建 buffer 失败`);
            return;
        };

        let symbolCache = getCache (this);
        symbolCache.mapPropsNameToProgramClass.forEach ((programClass, propsName) => {
            let program = new programClass (this, propsName);
            program.init ();
            this._listProgram.push (program);
            this [propsName] = program;
        });
    }

    /**
     * 释放掉
     */
    release () {
        MgrGlobal.inst.evtTouchStart.off (this.listenIdStart);
        MgrGlobal.inst.evtTouchStart.off (this.listenIdMove);
        MgrGlobal.inst.evtTouchStart.off (this.listenIdEnd);

        MgrGlobal.inst.evtEnter.off (this.listenIdEnter);
        MgrGlobal.inst.evtExit.off (this.listenIdExit);

        let ext = this.canvasWebglCtx.getExtension (`WEBGL_lose_context`);
        if (ext) {
            ext.loseContext();
        };
    }

    private _program: JWebglProgram;

    useProgram (program: JWebglProgram) {
        if (program == this._program) {
            return;
        };
        this._program = program;
        this.canvasWebglCtx.useProgram (this._program.program);
    }

    private _currFbo: JWebglFrameBuffer;

    useFbo (fbo: JWebglFrameBuffer) {
        let sizeWidth = this.canvasWebgl.width;
        let sizeHeight = this.canvasWebgl.height;
        if (this._currFbo != fbo) {
            this._currFbo = fbo;
            if (this._currFbo != null) {
                sizeWidth = fbo.width;
                sizeHeight = fbo.height;
                this.canvasWebglCtx.bindFramebuffer (JWebglEnum.BindFramebufferTarget.FRAMEBUFFER, this._currFbo.frameBuffer);
            };
            if (this._currFbo == null) {
                this.canvasWebglCtx.bindFramebuffer (JWebglEnum.BindFramebufferTarget.FRAMEBUFFER, null);
            };
        };
        this.canvasWebglCtx.viewport (0, 0, sizeWidth, sizeHeight);
    }

    clear () {
        this.canvasWebglCtx.clear (JWebglEnum.ClearMask.COLOR_BUFFER_BIT | JWebglEnum.ClearMask.DEPTH_BUFFER_BIT);
    }

    @program (JWebglProgramTypeLine)
    programLine: JWebglProgramTypeLine;

    @program (JWebglProgramTypeTriangle)
    programTriangle: JWebglProgramTypeTriangle;

    @program (JWebglProgramTypeImg)
    programImg: JWebglProgramTypeImg;

    @program (JWebglProgramTypeImgDyeing)
    programImgDyeing: JWebglProgramTypeImgDyeing;

    @program (JWebglProgramTypePoint)
    programPoint: JWebglProgramTypePoint;

    @program (JWebglProgramTypeSmoothTickness)
    programSmoothTickness: JWebglProgramTypeSmoothTickness;

    @program (JWebglProgramTypeSmoothFlat)
    programSmoothFlat: JWebglProgramTypeSmoothFlat;

    @program (JWebglProgramTypeSmoothCornerData)
    programSmoothCornerData: JWebglProgramTypeSmoothCornerData;

    @program (JWebglProgramTypeSmoothCornerRemoveA)
    programSmoothCornerRemoveA: JWebglProgramTypeSmoothCornerRemoveA;

    @program (JWebglProgramTypeSmoothCornerRemoveX)
    programSmoothCornerRemoveX: JWebglProgramTypeSmoothCornerRemoveX;
    
    @program (JWebglProgramTypeSmoothCornerRemoveT)
    programSmoothCornerRemoveT: JWebglProgramTypeSmoothCornerRemoveT;

    @program (JWebglProgramTypeSmoothCornerRemoveI)
    programSmoothCornerRemoveI: JWebglProgramTypeSmoothCornerRemoveI;

    @program (JWebglProgramTypeSmoothCornerRemoveV)
    programSmoothCornerRemoveV: JWebglProgramTypeSmoothCornerRemoveV;

    @program (JWebglProgramTypeSmoothEnumRound)
    programSmoothEnumRound: JWebglProgramTypeSmoothEnumRound;

    @program (JWebglProgramTypeSmoothEnumSide)
    programSmoothEnumSide: JWebglProgramTypeSmoothEnumSide;

    @program (JWebglProgramTypeSmoothArea)
    programSmoothArea: JWebglProgramTypeSmoothArea;

    @program (JWebglProgramTypeSmoothAngle)
    programSmoothAngle: JWebglProgramTypeSmoothAngle;

    @program (JWebglProgramTypeSmoothDisplayOrdinary)
    programSmoothDisplayOrdinary: JWebglProgramTypeSmoothDisplayOrdinary;

    @program (JWebglProgramTypeSmoothDisplayCircle)
    programSmoothDisplayCircle: JWebglProgramTypeSmoothDisplayCircle;

    /**
     * 模型矩阵
     */
    mat4M = new JWebglMathMatrix4();
    /**
     * 视图矩阵
     */
    mat4V = new JWebglMathMatrix4();
    /**
     * 投影矩阵
     */
    mat4P = new JWebglMathMatrix4();

    /**
     * mvp 矩阵
     */
    mat4Mvp = new JWebglMathMatrix4;

    /**
     * 刷新模型 - 视图 - 投影矩阵
     */
    refreshMat4Mvp () {
        JWebglMathMatrix4.multiplayMat4List (
            this.mat4P,
            this.mat4V,
            this.mat4M,
            this.mat4Mvp
        );
    }

    /**
     * 顶点数据的缓冲区
     */
    _attributeBuffer: WebGLBuffer;

    /**
     * 索引数据的缓冲区
     */
    _elementBuffer: WebGLBuffer;

    /**
     * 资源路径到资源图片的映射
     */
    _mapStringToImg = new Map <string, JWebglImage> ();

    /**
     * 获取图片资源
     * @param dataUrl 
     * @returns 
     */
    getImg (dataUrl: string) {
        if (!this._mapStringToImg.has (dataUrl)) {
            this._mapStringToImg.set (dataUrl, new JWebglImage (this, dataUrl));
        };
        return this._mapStringToImg.get (dataUrl);
    }

    /**
     * 获取帧缓冲区
     * @param width 
     * @param height 
     * @returns 
     */
    getFbo (width: number, height: number) {
        return new JWebglFrameBuffer (this, width, height);
    }

    /**
     * 销毁帧缓冲区
     * @param fbo 
     */
    destroyFbo (fbo: JWebglFrameBuffer) {
        if (fbo == null) {
            return;
        };
        this.canvasWebglCtx.deleteFramebuffer (fbo.frameBuffer);
    }

    /**
     * 输出日志
     * @param args 
     */
    log (...args) {
        console.log (...args);
    }
    /**
     * 输出错误报告
     * @param args 
     */
    error (...args) {
        console.error (...args);
    }

    /**
     * 把 fbo 的内容绘制出来
     * @param fboDisplay 
     * @param fboSrc 
     */
    fillFbo (fboDisplay: JWebglFrameBuffer, fboSrc: JWebglFrameBuffer) {
        this.useFbo (fboDisplay);
        this.clear ();

        let mat4M = objectPool.pop (JWebglMathMatrix4.poolType);
        mat4M.setIdentity ();
        let mat4V = objectPool.pop (JWebglMathMatrix4.poolType);
        mat4V.setLookAt(
            0, 0, 1,
            0, 0, 0,
            0, 1, 0
        );
        let mat4P = objectPool.pop (JWebglMathMatrix4.poolType);
        mat4P.setOrtho (
            -1, 1,
            -1, 1,
             0, 2
        );
        let mat4Mvp = objectPool.pop (JWebglMathMatrix4.poolType);
        JWebglMathMatrix4.multiplayMat4List (
            mat4P,
            mat4V,
            mat4M,
            mat4Mvp
        );
        this.programImg.uMvp.fill (mat4Mvp);

        this.programImg.uTexture.fillByFbo (fboSrc);
        this.programImg.add (
            JWebglMathVector4.centerO,
            JWebglMathVector4.axisZStart,
            JWebglMathVector4.axisYEnd,
            2,
            2
        );
        this.programImg.draw ();

        objectPool.push (mat4M, mat4V, mat4P, mat4Mvp);
    }
}

namespace JWebgl {

}

export default JWebgl;
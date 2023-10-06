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
import JWebglProgramTypeSmoothStep1CornerData from "./JWebglProgramTypeSmoothStep1CornerData.js";
import JWebglProgramTypeSmoothStep2Tickness from "./JWebglProgramTypeSmoothStep2Tickness.js";
import JWebglProgramTypeSmoothStep3CornerRemoveT from "./JWebglProgramTypeSmoothStep3CornerRemoveT.js";
import JWebglProgramTypeSmoothStep3CornerRemoveU from "./JWebglProgramTypeSmoothStep3CornerRemoveU.js";
import JWebglProgramTypeSmoothStep3CornerRemoveX from "./JWebglProgramTypeSmoothStep3CornerRemoveX.js";
import JWebglProgramTypeSmoothStep3Smooth from "./JWebglProgramTypeSmoothStep3Smooth.js";
import JWebglProgramTypeTriangle from "./JWebglProgramTypeTriangle.js";
import JWebglTouch from "./JWebglTouch.js";
import objectPool from "./ObjectPool.js";

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
    }

    /**
     * 所有着色程序的集合
     */
    private _listProgram = new Array <JWebglProgram> ();

    /**
     * 交互起始位置
     */
    touchStart = new JWebglTouch ();
    /**
     * 事件派发 - 交互起始
     */
    evtTouchStart = new Eventer ();

    /**
     * 交互拖拽位置
     */
    touchMove = new JWebglTouch ();
    /**
     * 事件派发 - 交互拖拽
     */
    evtTouchMove = new Eventer ();

    /**
     * 交互结束位置
     */
    touchEnd = new JWebglTouch ();
    /**
     * 事件派发 - 交互结束
     */
    evtTouchEnd = new Eventer ();

    /**
     * 当前交互位置
     */
    currentTouch = new JWebglTouch ();
    /**
     * 事件派发 - 发生交互
     */
    evtTouch = new Eventer ();

    /**
     * 初始化
     * @returns 
     */
    init () {
        this.canvasWebgl.onmousedown = (evt: MouseEvent) => {
            this.touchStart.fill (evt);
            this.currentTouch = this.touchStart;
            this.evtTouch.call (null);
            this.evtTouchStart.call (null);
        };
        this.canvasWebgl.onmousemove = (evt: MouseEvent) => {
            this.touchMove.fill (evt);
            this.currentTouch = this.touchMove;
            this.evtTouch.call (null);
            this.evtTouchMove.call (null);
        };
        this.canvasWebgl.onmouseup = (evt: MouseEvent) => {
            this.touchEnd.fill (evt);
            this.currentTouch = this.touchEnd;
            this.evtTouch.call (null);
            this.evtTouchEnd.call (null);
        };

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

    @program (JWebglProgramTypeSmoothStep1CornerData)
    programSmoothStep1CornerData: JWebglProgramTypeSmoothStep1CornerData;

    @program (JWebglProgramTypeSmoothStep2Tickness)
    programSmoothStep2Tickness: JWebglProgramTypeSmoothStep2Tickness;

    @program (JWebglProgramTypeSmoothStep3CornerRemoveX)
    programSmoothStep3CornerRemoveX: JWebglProgramTypeSmoothStep3CornerRemoveX;

    @program (JWebglProgramTypeSmoothStep3CornerRemoveU)
    programSmoothStep3CornerRemoveU: JWebglProgramTypeSmoothStep3CornerRemoveU;
    
    @program (JWebglProgramTypeSmoothStep3CornerRemoveT)
    programSmoothStep3CornerRemoveT: JWebglProgramTypeSmoothStep3CornerRemoveT;

    @program (JWebglProgramTypeSmoothStep3Smooth)
    programSmoothStep3Smooth: JWebglProgramTypeSmoothStep3Smooth;

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
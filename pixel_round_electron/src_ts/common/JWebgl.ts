import JWebglEnum from "./JWebglEnum.js";
import JWebglFrameBuffer from "./JWebglFrameBuffer.js";
import JWebglImage from "./JWebglImage.js";
import JWebglMathMatrix4 from "./JWebglMathMatrix4.js";
import JWebglProgram from "./JWebglProgram.js";
import JWebglProgramTypeImg from "./JWebglProgramTypeImg.js";
import JWebglProgramTypeLine from "./JWebglProgramTypeLine.js";
import JWebglProgramTypeSmooth1 from "./JWebglProgramTypeSmooth1.js";
import JWebglProgramTypeTriangle from "./JWebglProgramTypeTriangle.js";

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
     * 初始化
     * @returns 
     */
    init () {
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

    clear () {
        this.canvasWebglCtx.viewport (0, 0, this.canvasWebgl.width, this.canvasWebgl.height);
        this.canvasWebglCtx.clear (JWebglEnum.ClearMask.COLOR_BUFFER_BIT | JWebglEnum.ClearMask.DEPTH_BUFFER_BIT);
    }

    @program (JWebglProgramTypeLine)
    programLine: JWebglProgramTypeLine;

    @program (JWebglProgramTypeTriangle)
    programTriangle: JWebglProgramTypeTriangle;

    @program (JWebglProgramTypeImg)
    programImg: JWebglProgramTypeImg;

    @program (JWebglProgramTypeSmooth1)
    programSmooth1: JWebglProgramTypeSmooth1;

    /**
     * mvp 矩阵
     */
    mat4Mvp = new JWebglMathMatrix4;

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

    getImg (dataUrl: string) {
        if (!this._mapStringToImg.has (dataUrl)) {
            this._mapStringToImg.set (dataUrl, new JWebglImage (this, dataUrl));
        };
        return this._mapStringToImg.get (dataUrl);
    }

    getFbo () {
        return new JWebglFrameBuffer (this);
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
}

namespace JWebgl {

}

export default JWebgl;
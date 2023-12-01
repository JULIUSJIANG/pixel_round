import JWebglProgram from "./JWebglProgram";

/**
 * 静态数据
 */
export default class JWebglProgramUniform {
    /**
     * 归属的着色程序
     */
    relProgram: JWebglProgram;

    /**
     * 名称
     */
    name: string;

    constructor (
        program: JWebglProgram,
        name: string
    )
    {
        this.relProgram = program;
        this.name = name;
    }

    /**
     * 直接返回名字，方便插入 shader
     * @returns 
     */
    toString () {
        return this.name;
    }

    /**
     * 内存地址
     */
    location: WebGLUniformLocation;

    /**
     * 初始化
     */
    _init () {
        this.location = this.relProgram.relWebgl.canvasWebglCtx.getUniformLocation (this.relProgram.program, this.name);
        if (!this.location) {
            this.relProgram.relWebgl.error (`获取 uniform [${this.name}] 内存地址失败`, this.relProgram._shaderVTxt, this.relProgram._shaderFTxt);
        };
        this.onInit ();
    }
    
    /**
     * 事件派发 - 初始化
     */
    onInit () {

    }

    /**
     * 获取在 shader 中的定义
     * @returns 
     */
    impGetShaderDefine (): string {
        return null;
    }
}
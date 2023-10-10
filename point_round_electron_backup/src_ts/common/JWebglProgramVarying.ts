import JWebglProgram from "./JWebglProgram.js";

/**
 * 插值数据
 */
export default class JWebglProgramVarying {
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
     * 获取在 shader 中的定义
     * @returns 
     */
    impGetShaderDefine (): string {
        return null;
    }

    /**
     * 直接返回名字，方便插入 shader
     * @returns 
     */
    toString () {
        return this.name;
    }
}
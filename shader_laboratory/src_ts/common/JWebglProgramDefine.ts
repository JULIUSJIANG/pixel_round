import JWebglProgram from "./JWebglProgram";

export default class JWEbglProgramDefine {
    /**
     * 归属的着色程序
     */
    relProgram: JWebglProgram;

    /**
     * 名称
     */
    name: string;

    /**
     * 值
     */
    val: string;

    constructor (
        program: JWebglProgram,
        name: string,
        val: string
    )
    {
        this.relProgram = program;
        this.name = name;
        this.val = val;
    }

    /**
     * 直接返回名字，方便插入 shader
     * @returns 
     */
    toString () {
        return this.name;
    }
}
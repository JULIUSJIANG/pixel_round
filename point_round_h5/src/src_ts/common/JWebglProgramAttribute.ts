import JWebglProgram from "./JWebglProgram";

/**
 * 顶点数据
 */
export default class JWebglProgramAttribute {
    /**
     * 归属的着色程序
     */
    relProgram: JWebglProgram;

    /**
     * 名称
     */
    name: string;

    /**
     * 在一个顶点数据中的起始索引
     */
    idx: number;

    constructor (
        program: JWebglProgram,
        name: string,
        idx: number
    )
    {
        this.relProgram = program;
        this.name = name;
        this.idx = idx;
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
    location: number;

    /**
     * 初始化
     */
    _init () {
        this.onInit ();
    }
    /**
     * 事件派发 - 初始化
     */
    onInit () {
        this.location = this.relProgram.relWebgl.canvasWebglCtx.getAttribLocation (this.relProgram.program, this.name);
        if (this.location < 0) {
            this.relProgram.relWebgl.error (`获取 attribute 内存地址失败`);
            return;
        };
    }

    /**
     * 获取在 shader 中的定义
     * @returns 
     */
    impGetShaderDefine (): string {
        return null;
    }
    /**
     * 获取数据尺寸
     * @returns 
     */
    impGetSize (): number {
        return 1;
    }
}
/**
 * 插值数据
 */
export default class JWebglProgramVarying {
    constructor(program, name) {
        this.relProgram = program;
        this.name = name;
    }
    /**
     * 获取在 shader 中的定义
     * @returns
     */
    impGetShaderDefine() {
        return null;
    }
    /**
     * 直接返回名字，方便插入 shader
     * @returns
     */
    toString() {
        return this.name;
    }
}

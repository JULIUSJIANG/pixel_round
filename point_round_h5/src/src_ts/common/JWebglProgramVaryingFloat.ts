import JWebglProgramVarying from "./JWebglProgramVarying";

/**
 * 插值数据 - 浮点数
 */
export default class JWebglProgramVaryingFloat extends JWebglProgramVarying {

    impGetShaderDefine (): string {
        return `float`;
    }
}
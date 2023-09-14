import JWebglProgramVarying from "./JWebglProgramVarying.js";
/**
 * 插值数据 - 浮点数
 */
export default class JWebglProgramVaryingFloat extends JWebglProgramVarying {
    impGetShaderDefine() {
        return `float`;
    }
}

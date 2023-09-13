import JWebglProgramVarying from "./JWebglProgramVarying.js";
/**
 * 插值数据 - 向量
 */
export default class JWebglProgramVaryingVec2 extends JWebglProgramVarying {
    impGetShaderDefine() {
        return `vec2`;
    }
}

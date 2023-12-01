import JWebglProgramVarying from "./JWebglProgramVarying";

/**
 * 插值数据 - 向量
 */
export default class JWebglProgramVaryingVec4 extends JWebglProgramVarying {

    impGetShaderDefine (): string {
        return `vec4`;
    }
}
import JWebglMathVector4 from "./JWebglMathVector4";
import JWebglProgramUniform from "./JWebglProgramUniform";

/**
 * 静态数据 - 向量
 */
export default class JWebglProgramUniformVec4 extends JWebglProgramUniform {

    impGetShaderDefine (): string {
        return `vec4`;
    }

    fill (bin: Float32Array) {
        this.relProgram.relWebgl.useProgram (this.relProgram);
        this.relProgram.relWebgl.canvasWebglCtx.uniform4fv (this.location, bin);
    }
}
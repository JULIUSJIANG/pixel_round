import JWebglProgramUniform from "./JWebglProgramUniform.js";
/**
 * 静态数据 - 向量
 */
export default class JWebglProgramUniformVec4 extends JWebglProgramUniform {
    impGetShaderDefine() {
        return `vec4`;
    }
    fill(bin) {
        this.relProgram.relWebgl.useProgram(this.relProgram);
        this.relProgram.relWebgl.canvasWebglCtx.uniform4fv(this.location, bin);
    }
}

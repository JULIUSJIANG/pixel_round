import JWebglProgramUniform from "./JWebglProgramUniform.js";
/**
 * 静态数据 - 向量
 */
export default class JWebglProgramUniformVec4 extends JWebglProgramUniform {
    impGetShaderDefine() {
        return `vec4`;
    }
    /**
     * 填充数据
     * @param val0
     * @param val1
     * @param val2
     * @param val3
     */
    fill(vec4) {
        this.relProgram.relWebgl.useProgram(this.relProgram);
        this.relProgram.relWebgl.canvasWebglCtx.uniform4fv(this.location, vec4.elements);
    }
}

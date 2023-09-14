import JWebglProgramUniform from "./JWebglProgramUniform.js";
/**
 * 静态数据 - 浮点
 */
export default class JWebglProgramUniformFloat extends JWebglProgramUniform {
    impGetShaderDefine() {
        return `float`;
    }
    /**
     * 填充数据
     * @param val0
     * @param val1
     * @param val2
     * @param val3
     */
    fill(val) {
        this.relProgram.relWebgl.useProgram(this.relProgram);
        this.relProgram.relWebgl.canvasWebglCtx.uniform1f(this.location, val);
    }
}

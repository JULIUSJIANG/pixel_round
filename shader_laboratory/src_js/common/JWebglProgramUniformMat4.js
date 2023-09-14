import JWebglProgramUniform from "./JWebglProgramUniform.js";
const SIZE = 16;
/**
 * 静态数据 - 4 维矩阵
 */
export default class JWebglProgramUniformMat4 extends JWebglProgramUniform {
    impGetShaderDefine() {
        return `mat4`;
    }
    /**
     * 使用 4 维矩阵填充数据
     * @param mat4
     */
    fill(mat4) {
        this.relProgram.relWebgl.useProgram(this.relProgram);
        this.relProgram.relWebgl.canvasWebglCtx.uniformMatrix4fv(this.location, false, mat4.elements);
    }
}

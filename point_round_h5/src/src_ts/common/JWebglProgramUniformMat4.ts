import JWebglMathMatrix4 from "./JWebglMathMatrix4";
import JWebglProgramUniform from "./JWebglProgramUniform";

const SIZE = 16;

/**
 * 静态数据 - 4 维矩阵
 */
export default class JWebglProgramUniformMat4 extends JWebglProgramUniform {

    impGetShaderDefine (): string {
        return `mat4`;
    }

    /**
     * 使用 4 维矩阵填充数据
     * @param mat4 
     */
    fill (mat4: JWebglMathMatrix4) {
        this.relProgram.relWebgl.useProgram (this.relProgram);
        this.relProgram.relWebgl.canvasWebglCtx.uniformMatrix4fv (this.location, false, mat4.elements);
    }
}
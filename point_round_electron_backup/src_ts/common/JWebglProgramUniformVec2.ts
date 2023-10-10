import JWebglProgramUniform from "./JWebglProgramUniform.js";

/**
 * 静态数据 - 向量
 */
export default class JWebglProgramUniformVec2 extends JWebglProgramUniform {

    impGetShaderDefine (): string {
        return `vec2`;
    }

    /**
     * 填充数据
     * @param x 
     * @param y 
     */
    fill (x: number, y: number) {
        this.relProgram.relWebgl.useProgram (this.relProgram);
        this.relProgram.relWebgl.canvasWebglCtx.uniform2f (this.location, x, y);
    }
}
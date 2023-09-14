import JWebglEnum from "./JWebglEnum.js";
import JWebglImage from "./JWebglImage.js";
import JWebglProgramUniform from "./JWebglProgramUniform.js";

/**
 * 静态数据 - 图片
 */
export default class JWebglProgramUniformSampler2D extends JWebglProgramUniform {

    impGetShaderDefine (): string {
        return `sampler2D`;
    }

    idx: number;

    onInit (): void {
        this.idx = this.relProgram.textureIdx++;
    }

    /**
     * 使用 texture 填充
     * @param texture 
     */
    fill (jImg: JWebglImage) {
        this.relProgram.relWebgl.useProgram (this.relProgram);
        this.relProgram.relWebgl.canvasWebglCtx.activeTexture (JWebglEnum.ActiveTexture.TEXTURE0 + this.idx);
        this.relProgram.relWebgl.canvasWebglCtx.bindTexture (JWebglEnum.BindTexture.TEXTURE_2D, jImg.texture);
        this.relProgram.relWebgl.canvasWebglCtx.uniform1i (this.location, this.idx);
    }
}
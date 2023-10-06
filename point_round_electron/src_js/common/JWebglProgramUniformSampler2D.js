import JWebglEnum from "./JWebglEnum.js";
import JWebglProgramUniform from "./JWebglProgramUniform.js";
/**
 * 静态数据 - 图片
 */
export default class JWebglProgramUniformSampler2D extends JWebglProgramUniform {
    impGetShaderDefine() {
        return `sampler2D`;
    }
    onInit() {
        this.idx = this.relProgram.textureIdx++;
    }
    /**
     * 使用图片填充
     * @param texture
     */
    fillByImg(jImg) {
        this.relProgram.relWebgl.useProgram(this.relProgram);
        this.relProgram.relWebgl.canvasWebglCtx.activeTexture(JWebglEnum.ActiveTexture.TEXTURE0 + this.idx);
        this.relProgram.relWebgl.canvasWebglCtx.bindTexture(JWebglEnum.BindTexture.TEXTURE_2D, jImg.texture);
        this.relProgram.relWebgl.canvasWebglCtx.uniform1i(this.location, this.idx);
    }
    /**
     * 使用帧缓冲区填充
     * @param jFbo
     */
    fillByFbo(jFbo) {
        this.relProgram.relWebgl.useProgram(this.relProgram);
        this.relProgram.relWebgl.canvasWebglCtx.activeTexture(JWebglEnum.ActiveTexture.TEXTURE0 + this.idx);
        this.relProgram.relWebgl.canvasWebglCtx.bindTexture(JWebglEnum.BindTexture.TEXTURE_2D, jFbo.renderTexture);
        this.relProgram.relWebgl.canvasWebglCtx.uniform1i(this.location, this.idx);
    }
}
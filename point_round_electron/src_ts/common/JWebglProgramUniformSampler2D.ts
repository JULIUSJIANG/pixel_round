import JWebglEnum from "./JWebglEnum.js";
import JWebglFrameBuffer from "./JWebglFrameBuffer.js";
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
     * 使用图片填充
     * @param texture 
     */
    fillByImg (jImg: JWebglImage) {
        this.fillByTexture (jImg.texture);
    }

    /**
     * 使用帧缓冲区填充
     * @param jFbo 
     */
    fillByFbo (jFbo: JWebglFrameBuffer) {
        this.fillByTexture (jFbo.renderTexture);
    }

    /**
     * 使用帧缓冲区填充
     * @param jFbo 
     */
    fillByTexture (tex: WebGLTexture) {
        this.relProgram.relWebgl.useProgram (this.relProgram);
        this.relProgram.relWebgl.canvasWebglCtx.activeTexture (JWebglEnum.ActiveTexture.TEXTURE0 + this.idx);
        this.relProgram.relWebgl.canvasWebglCtx.bindTexture (JWebglEnum.BindTexture.TEXTURE_2D, tex);
        this.relProgram.relWebgl.canvasWebglCtx.uniform1i (this.location, this.idx);
    }
}
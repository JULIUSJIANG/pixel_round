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
     * 当前纹理
     */
    texture: WebGLTexture;

    /**
     * 使用字节数据填充
     * @param uint8Arr 
     * @param width 
     * @param height 
     */
    fillByUint8Array (uint8Arr: Uint8Array, width: number, height: number) {
        if (!this.texture) {
            this.texture = this.relProgram.relWebgl.canvasWebglCtx.createTexture ();
        };
        this.relProgram.relWebgl.canvasWebglCtx.pixelStorei (JWebglEnum.PixelStoreIPName.UNPACK_FLIP_Y_WEBGL, 1);
        this.relProgram.relWebgl.canvasWebglCtx.activeTexture (JWebglEnum.ActiveTexture.TEXTURE0 + this.idx);
        this.relProgram.relWebgl.canvasWebglCtx.bindTexture (JWebglEnum.BindTexture.TEXTURE_2D, this.texture);
        this.relProgram.relWebgl.canvasWebglCtx.texParameteri (JWebglEnum.TexParameteriParamTarget.TEXTURE_2D, JWebglEnum.TexParameteriPName.TEXTURE_MIN_FILTER, JWebglEnum.TexParameteriParam.NEAREST);
        this.relProgram.relWebgl.canvasWebglCtx.texParameteri (JWebglEnum.TexParameteriParamTarget.TEXTURE_2D, JWebglEnum.TexParameteriPName.TEXTURE_MAG_FILTER, JWebglEnum.TexParameteriParam.NEAREST);
        this.relProgram.relWebgl.canvasWebglCtx.texParameteri (JWebglEnum.TexParameteriParamTarget.TEXTURE_2D, JWebglEnum.TexParameteriPName.TEXTURE_WRAP_S, JWebglEnum.TexParameteriParam.CLAMP_TO_EDGE);
        this.relProgram.relWebgl.canvasWebglCtx.texParameteri (JWebglEnum.TexParameteriParamTarget.TEXTURE_2D, JWebglEnum.TexParameteriPName.TEXTURE_WRAP_T, JWebglEnum.TexParameteriParam.CLAMP_TO_EDGE);
        this.relProgram.relWebgl.canvasWebglCtx.texImage2D (JWebglEnum.TexImage2DTarget.TEXTURE_2D, 0, JWebglEnum.TexImage2DFormat.RGBA, width, height, 0, JWebglEnum.TexImage2DFormat.RGBA, JWebglEnum.TexImage2DType.UNSIGNED_BYTE, uint8Arr);
        this.fillByTexture (this.texture);
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
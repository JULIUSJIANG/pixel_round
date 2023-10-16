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
        this.fillByTexture(jImg.texture);
    }
    /**
     * 使用帧缓冲区填充
     * @param jFbo
     */
    fillByFbo(jFbo) {
        this.fillByTexture(jFbo.renderTexture);
    }
    /**
     * 使用字节数据填充
     * @param uint8Arr
     * @param width
     * @param height
     */
    fillByUint8Array(uint8Arr, width, height) {
        if (!this.texture) {
            this.texture = this.relProgram.relWebgl.canvasWebglCtx.createTexture();
        }
        ;
        this.relProgram.relWebgl.canvasWebglCtx.pixelStorei(JWebglEnum.PixelStoreIPName.UNPACK_FLIP_Y_WEBGL, 1);
        this.relProgram.relWebgl.canvasWebglCtx.activeTexture(JWebglEnum.ActiveTexture.TEXTURE0 + this.idx);
        this.relProgram.relWebgl.canvasWebglCtx.bindTexture(JWebglEnum.BindTexture.TEXTURE_2D, this.texture);
        this.relProgram.relWebgl.canvasWebglCtx.texParameteri(JWebglEnum.TexParameteriParamTarget.TEXTURE_2D, JWebglEnum.TexParameteriPName.TEXTURE_MIN_FILTER, JWebglEnum.TexParameteriParam.NEAREST);
        this.relProgram.relWebgl.canvasWebglCtx.texParameteri(JWebglEnum.TexParameteriParamTarget.TEXTURE_2D, JWebglEnum.TexParameteriPName.TEXTURE_MAG_FILTER, JWebglEnum.TexParameteriParam.NEAREST);
        this.relProgram.relWebgl.canvasWebglCtx.texParameteri(JWebglEnum.TexParameteriParamTarget.TEXTURE_2D, JWebglEnum.TexParameteriPName.TEXTURE_WRAP_S, JWebglEnum.TexParameteriParam.CLAMP_TO_EDGE);
        this.relProgram.relWebgl.canvasWebglCtx.texParameteri(JWebglEnum.TexParameteriParamTarget.TEXTURE_2D, JWebglEnum.TexParameteriPName.TEXTURE_WRAP_T, JWebglEnum.TexParameteriParam.CLAMP_TO_EDGE);
        this.relProgram.relWebgl.canvasWebglCtx.texImage2D(JWebglEnum.TexImage2DTarget.TEXTURE_2D, 0, JWebglEnum.TexImage2DFormat.RGBA, width, height, 0, JWebglEnum.TexImage2DFormat.RGBA, JWebglEnum.TexImage2DType.UNSIGNED_BYTE, uint8Arr);
        this.fillByTexture(this.texture);
    }
    /**
     * 使用帧缓冲区填充
     * @param jFbo
     */
    fillByTexture(tex) {
        this.relProgram.relWebgl.useProgram(this.relProgram);
        this.relProgram.relWebgl.canvasWebglCtx.activeTexture(JWebglEnum.ActiveTexture.TEXTURE0 + this.idx);
        this.relProgram.relWebgl.canvasWebglCtx.bindTexture(JWebglEnum.BindTexture.TEXTURE_2D, tex);
        this.relProgram.relWebgl.canvasWebglCtx.uniform1i(this.location, this.idx);
    }
}

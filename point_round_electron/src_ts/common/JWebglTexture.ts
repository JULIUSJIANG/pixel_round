import JWebgl from "./JWebgl.js";
import JWebglEnum from "./JWebglEnum.js";

/**
 * 纹理
 */
class JWebglTexture {

    relWebgl: JWebgl;

    texture: WebGLTexture;

    constructor (relWebg: JWebgl) {
        this.relWebgl = relWebg;
        this.texture = relWebg.canvasWebglCtx.createTexture ();
    }

    /**
     * 使用字节数据填充
     * @param uint8Arr 
     * @param width 
     * @param height 
     * @param idxActive 
     */
    fillByUint8Array (uint8Arr: Uint8Array, width: number, height: number, idxActive: number) {
        this.relWebgl.canvasWebglCtx.pixelStorei (JWebglEnum.PixelStoreIPName.UNPACK_FLIP_Y_WEBGL, 1);
        this.relWebgl.canvasWebglCtx.activeTexture (JWebglEnum.ActiveTexture.TEXTURE0 + idxActive);
        this.relWebgl.canvasWebglCtx.bindTexture (JWebglEnum.BindTexture.TEXTURE_2D, this.texture);
        this.relWebgl.canvasWebglCtx.texParameteri (JWebglEnum.TexParameteriParamTarget.TEXTURE_2D, JWebglEnum.TexParameteriPName.TEXTURE_MIN_FILTER, JWebglEnum.TexParameteriParam.NEAREST);
        this.relWebgl.canvasWebglCtx.texParameteri (JWebglEnum.TexParameteriParamTarget.TEXTURE_2D, JWebglEnum.TexParameteriPName.TEXTURE_MAG_FILTER, JWebglEnum.TexParameteriParam.NEAREST);
        this.relWebgl.canvasWebglCtx.texParameteri (JWebglEnum.TexParameteriParamTarget.TEXTURE_2D, JWebglEnum.TexParameteriPName.TEXTURE_WRAP_S, JWebglEnum.TexParameteriParam.CLAMP_TO_EDGE);
        this.relWebgl.canvasWebglCtx.texParameteri (JWebglEnum.TexParameteriParamTarget.TEXTURE_2D, JWebglEnum.TexParameteriPName.TEXTURE_WRAP_T, JWebglEnum.TexParameteriParam.CLAMP_TO_EDGE);
        this.relWebgl.canvasWebglCtx.texImage2D (JWebglEnum.TexImage2DTarget.TEXTURE_2D, 0, JWebglEnum.TexImage2DFormat.RGBA, width, height, 0, JWebglEnum.TexImage2DFormat.RGBA, JWebglEnum.TexImage2DType.UNSIGNED_BYTE, uint8Arr);
    }
}

export default JWebglTexture;
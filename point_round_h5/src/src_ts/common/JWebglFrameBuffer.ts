import MgrGlobal from "../mgr/MgrGlobal";
import JWebgl from "./JWebgl";
import JWebglEnum from "./JWebglEnum";

class JWebglFrameBuffer {

    relWebgl: JWebgl;

    type: JWebglEnum.TexParameteriParam;

    width: number;

    height: number;

    renderTexture: WebGLTexture;

    frameBuffer: WebGLFramebuffer;

    arrUint8: Uint8Array;

    constructor (relWebgl: JWebgl, width: number, height: number, type: JWebglEnum.TexParameteriParam) {
        this.relWebgl = relWebgl;
        this.width = width;
        this.height = height;
        this.type = type;
        this.renderTexture = this.relWebgl.canvasWebglCtx.createTexture ();
        this.relWebgl.canvasWebglCtx.bindTexture (JWebglEnum.BindTexture.TEXTURE_2D, this.renderTexture);
        this.relWebgl.canvasWebglCtx.texImage2D (
            JWebglEnum.BindTexture.TEXTURE_2D, 
            0, 
            JWebglEnum.TexImage2DFormat.RGBA, 
            width, 
            height, 
            0,
            JWebglEnum.TexImage2DFormat.RGBA,
            JWebglEnum.VertexAttriPointerType.UNSIGNED_BYTE,
            null
        );
        this.relWebgl.canvasWebglCtx.texParameteri (JWebglEnum.BindTexture.TEXTURE_2D, JWebglEnum.TexParameteriPName.TEXTURE_MIN_FILTER, this.type);
        this.relWebgl.canvasWebglCtx.texParameteri (JWebglEnum.BindTexture.TEXTURE_2D, JWebglEnum.TexParameteriPName.TEXTURE_MAG_FILTER, this.type);
        this.relWebgl.canvasWebglCtx.texParameteri (JWebglEnum.BindTexture.TEXTURE_2D, JWebglEnum.TexParameteriPName.TEXTURE_WRAP_S, JWebglEnum.TexParameteriParam.CLAMP_TO_EDGE);
        this.relWebgl.canvasWebglCtx.texParameteri (JWebglEnum.BindTexture.TEXTURE_2D, JWebglEnum.TexParameteriPName.TEXTURE_WRAP_T, JWebglEnum.TexParameteriParam.CLAMP_TO_EDGE);

        this.frameBuffer = this.relWebgl.canvasWebglCtx.createFramebuffer ();
        this.relWebgl.canvasWebglCtx.bindFramebuffer (JWebglEnum.BindFramebufferTarget.FRAMEBUFFER, this.frameBuffer);
        this.relWebgl.canvasWebglCtx.framebufferTexture2D (JWebglEnum.BindFramebufferTarget.FRAMEBUFFER, JWebglEnum.FramebufferTexture2DAttachment.COLOR_ATTACHMENT0, JWebglEnum.BindTexture.TEXTURE_2D, this.renderTexture, 0);
    }

    private fboRev: JWebglFrameBuffer;

    cacheToUint8 () {
        if (this.fboRev == null) {
            this.fboRev = this.relWebgl.getFbo (this.width, this.height, this.type);
        };
        this.relWebgl.fillFboByTexRev (this.fboRev, this.renderTexture);
        if (!this.arrUint8) {
            this.arrUint8 = new Uint8Array (this.width * this.height * 4);
        };
        this.relWebgl.useFbo (this.fboRev);
        this.relWebgl.canvasWebglCtx.readPixels (0, 0, this.width, this.height, JWebglEnum.ReadPixelsFormat.RGBA, JWebglEnum.ReadPixelType.UNSIGNED_BYTE, this.arrUint8);
    }

    toBase64 () {
        this.cacheToUint8 ();
        return MgrGlobal.inst.arrUint8ToBase64 (this.arrUint8, this.width, this.height);
    }
}

export default JWebglFrameBuffer;
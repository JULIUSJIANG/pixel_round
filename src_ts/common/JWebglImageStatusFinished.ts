import JWebglEnum from "./JWebglEnum.js";
import JWebglImageStatus from "./JWebglImageStatus.js";

class JWebglImageStatusFinished extends JWebglImageStatus {

    onEnter (): void {
        this.relImg.relWebgl.canvasWebglCtx.activeTexture (JWebglEnum.ActiveTexture.TEXTURE0);
        this.relImg.relWebgl.canvasWebglCtx.bindTexture (JWebglEnum.BindTexture.TEXTURE_2D, this.relImg.texture);
        this.relImg.relWebgl.canvasWebglCtx.texParameteri (JWebglEnum.BindTexture.TEXTURE_2D, JWebglEnum.TexParameteriPName.TEXTURE_MIN_FILTER, JWebglEnum.TexParameteriParam.LINEAR);
        this.relImg.relWebgl.canvasWebglCtx.texImage2D (JWebglEnum.BindTexture.TEXTURE_2D, 0, JWebglEnum.TexImage2DFormat.RGBA, JWebglEnum.TexImage2DFormat.RGBA, JWebglEnum.VertexAttriPointerType.UNSIGNED_BYTE, this.relImg.assetsImg.image);
    }
}

export default JWebglImageStatusFinished;
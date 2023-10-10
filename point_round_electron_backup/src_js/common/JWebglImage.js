import MgrRes from "../mgr/MgrRes.js";
import JWebglImageStatusFinished from "./JWebglImageStatusFinished.js";
import JWebglImageStatusLoading from "./JWebglImageStatusLoading.js";
class JWebglImage {
    constructor(relWebgl, dataUrl) {
        this.relWebgl = relWebgl;
        this.dataUrl = dataUrl;
        this.texture = this.relWebgl.canvasWebglCtx.createTexture();
        if (!this.texture) {
            this.relWebgl.error(`创建纹理失败`);
            return;
        }
        ;
        this.statusLoading = new JWebglImageStatusLoading(this);
        this.statusFinished = new JWebglImageStatusFinished(this);
        this.assetsImg = MgrRes.inst.getImg(dataUrl);
        if (this.assetsImg.currStatus == this.assetsImg.statusFinished) {
            this.enter(this.statusFinished);
        }
        else {
            this.enter(this.statusLoading);
        }
        ;
    }
    enter(status) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.onExit();
        }
        ;
        this.currStatus.onEnter();
    }
}
export default JWebglImage;

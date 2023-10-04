import MgrRes from "../mgr/MgrRes.js";
import MgrResAssetsImage from "../mgr/MgrResAssetsImage.js";
import JWebgl from "./JWebgl.js";
import JWebglImageStatus from "./JWebglImageStatus.js";
import JWebglImageStatusFinished from "./JWebglImageStatusFinished.js";
import JWebglImageStatusLoading from "./JWebglImageStatusLoading.js";

class JWebglImage {

    relWebgl: JWebgl;
    
    dataUrl: string;

    assetsImg: MgrResAssetsImage;

    texture: WebGLTexture;

    constructor (relWebgl: JWebgl, dataUrl: string) {
        this.relWebgl = relWebgl;
        this.dataUrl = dataUrl;

        this.texture = this.relWebgl.canvasWebglCtx.createTexture ();
        if (!this.texture) {
            this.relWebgl.error (`创建纹理失败`);
            return;
        };

        this.statusLoading = new JWebglImageStatusLoading (this);
        this.statusFinished = new JWebglImageStatusFinished (this);

        this.assetsImg = MgrRes.inst.getImg (dataUrl);
        if (this.assetsImg.currStatus == this.assetsImg.statusFinished) {
            this.enter (this.statusFinished);
        }
        else {
            this.enter (this.statusLoading);
        };
    }

    statusLoading: JWebglImageStatusLoading;

    statusFinished: JWebglImageStatusFinished;

    currStatus: JWebglImageStatus;

    enter (status: JWebglImageStatus) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.onExit ();
        };
        this.currStatus.onEnter ();
    }
}

export default JWebglImage;
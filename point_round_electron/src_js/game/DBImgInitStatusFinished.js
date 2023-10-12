import DBImgInitStatus from "./DBImgInitStatus.js";
export default class DBImgInitStatusFinished extends DBImgInitStatus {
    onLoaded() {
        let t = this.relImg.imgLoading;
        this.relImg.imgLoading = this.relImg.imgLoaded;
        this.relImg.imgLoaded = t;
        // MgrData.inst.callDataChange ();
    }
}

import MgrData from "../mgr/MgrData.js";
import DBImgInitStatus from "./DBImgInitStatus.js";

export default class DBImgInitStatusFinished extends DBImgInitStatus {

    onLoaded (): void {
        let t = this.relImg.imgLoading;
        this.relImg.imgLoading = this.relImg.imgLoaded;
        this.relImg.imgLoaded = t;
        // MgrData.inst.callDataChange ();
    }
}
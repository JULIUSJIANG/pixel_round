import DBImgInitStatus from "./DBImgInitStatus.js";
export default class DBImgInitStatusIdle extends DBImgInitStatus {
    onLoaded() {
        this.relImg.initEnter(this.relImg.initStatusFinished);
        this.relImg.initCurrStatus.onLoaded();
    }
}

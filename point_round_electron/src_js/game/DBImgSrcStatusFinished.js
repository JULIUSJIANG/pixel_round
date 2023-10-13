import DBImgSrcStatus from "./DBImgSrcStatus.js";
export default class DBImgSrcStatusFinished extends DBImgSrcStatus {
    onEnter() {
        this.relImg.initCurrStatus.onLoaded();
    }
    onSrcChanged() {
        // 重新加载
        this.relImg.srcEnter(this.relImg.srcStatusLoading);
        this.relImg.srcCurrStatus.onSrcChanged();
    }
}

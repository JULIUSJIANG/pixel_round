import DBImgSrcStatus from "./DBImgSrcStatus.js";

export default class DBImgSrcStatusFinished extends DBImgSrcStatus {
    
    onEnter (): void {
        this.relImg.initCurrStatus.onLoaded ();
    }

    onSrcChanged (): void {
        // 重新加载
        this.relImg.srcEnter (this.relImg.srcStatusLoading);
    }
}
import DBImgSrcStatus from "./DBImgSrcStatus.js";
export default class DBImgSrcStatusLoading extends DBImgSrcStatus {
    onEnter() {
        this.relImg.imgLoading.onload = () => {
            this.relImg.srcEnter(this.relImg.srcStatusFinished);
        };
        this.loadUrl(this.relImg.dbImgData.dataOrigin);
    }
    onSrcChanged() {
        this.loadUrl(this.relImg.dbImgData.dataOrigin);
    }
    loadUrl(url) {
        if (url != null) {
            this.relImg.imgLoading.src = url;
        }
        ;
    }
}

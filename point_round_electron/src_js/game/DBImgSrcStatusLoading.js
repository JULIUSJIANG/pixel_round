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
        // 有得加载才进行加载
        if (url != null) {
            this.relImg.imgLoading.src = url;
        }
        // 否则直接认为加载完成
        else {
            this.relImg.srcEnter(this.relImg.srcStatusFinished);
        }
        ;
    }
}

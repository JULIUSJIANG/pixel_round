import DBImgSrcStatus from "./DBImgSrcStatus.js";
export default class DBImgSrcStatusLoading extends DBImgSrcStatus {
    onEnter() {
        this.relImg.imgLoading.onload = () => {
            this.relImg.dbImgData.dataOrigin = this.loadingUrl;
            this.relImg.dbImgData.width = this.loadingWidth;
            this.relImg.dbImgData.height = this.loadingHeight;
            this.relImg.srcEnter(this.relImg.srcStatusFinished);
        };
    }
    onSrcChanged() {
        let status = this.relImg.listStatus[this.relImg.idxStatus];
        this.loadingUrl = status.dataOrigin;
        this.loadingWidth = status.width;
        this.loadingHeight = status.height;
        // 正式开始加载
        this.relImg.imgLoading.src = this.loadingUrl;
    }
}

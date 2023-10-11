import DBImgSrcStatus from "./DBImgSrcStatus.js";
export default class DBImgSrcStatusLoading extends DBImgSrcStatus {
    onEnter() {
        this.relImg.imgLoading.onload = () => {
            this.relImg.srcEnter(this.relImg.srcStatusFinished);
        };
        this.relImg.imgLoading.src = this.relImg.dbImgData.dataOrigin;
    }
    onSrcChanged() {
        this.relImg.imgLoading.src = this.relImg.dbImgData.dataOrigin;
    }
}

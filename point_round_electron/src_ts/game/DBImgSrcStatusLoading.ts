import DBImgSrcStatus from "./DBImgSrcStatus.js";

export default class DBImgSrcStatusLoading extends DBImgSrcStatus {

    onEnter (): void {
        this.relImg.imgLoading.onload = () => {
            this.relImg.srcEnter (this.relImg.srcStatusFinished);           
        };
        this.relImg.imgLoading.src = this.relImg.dbImgData.dataOrigin;
    }

    onSrcChanged (): void {
        this.relImg.imgLoading.src = this.relImg.dbImgData.dataOrigin;
    }
}
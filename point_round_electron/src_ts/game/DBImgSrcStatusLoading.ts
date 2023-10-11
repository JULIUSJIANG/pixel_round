import DBImgSrcStatus from "./DBImgSrcStatus.js";

export default class DBImgSrcStatusLoading extends DBImgSrcStatus {

    onEnter (): void {
        this.relImg.imgLoading.onload = () => {
            this.relImg.srcEnter (this.relImg.srcStatusFinished);           
        };
        this.loadUrl (this.relImg.dbImgData.dataOrigin);
    }

    onSrcChanged (): void {
        this.loadUrl (this.relImg.dbImgData.dataOrigin);
    }

    loadUrl (url: string) {
        if (url != null) {
            this.relImg.imgLoading.src = url;
        };
    }
}
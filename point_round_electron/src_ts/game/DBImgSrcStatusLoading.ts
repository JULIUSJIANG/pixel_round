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
        // 有得加载才进行加载
        this.relImg.imgLoading.src = url;
        // 空路径时候永远无法加载完成
        if (url == ``) {
            this.relImg.srcEnter (this.relImg.srcStatusFinished);
        };
    }
}
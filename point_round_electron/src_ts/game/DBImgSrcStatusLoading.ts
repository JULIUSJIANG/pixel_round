import DBImgSrcStatus from "./DBImgSrcStatus.js";

export default class DBImgSrcStatusLoading extends DBImgSrcStatus {
    /**
     * 加载的内容地址
     */
    loadingUrl: string;
    /**
     * 加载的内容宽度
     */
    loadingWidth: number;
    /**
     * 加载的内容高度
     */
    loadingHeight: number;

    onEnter (): void {
        this.relImg.imgLoading.onload = () => {
            this.relImg.dbImgData.dataOrigin = this.loadingUrl;
            this.relImg.dbImgData.width = this.loadingWidth;
            this.relImg.dbImgData.height = this.loadingHeight;

            this.relImg.srcEnter (this.relImg.srcStatusFinished);           
        };
    }

    onSrcChanged (url: string, width: number, height: number): void {
        this.loadingUrl = url;
        this.loadingWidth = width;
        this.loadingHeight = height;
        // 正式开始加载
        this.relImg.imgLoading.src = url;
    }
}
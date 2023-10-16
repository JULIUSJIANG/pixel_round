import MgrRes from "../mgr/MgrRes.js";
import ExpImgUint8Status from "./ExpImgUint8Status.js";

class ExpImgUint8StatusLoading extends ExpImgUint8Status {

    listenIdFinished: number;

    onEnter (): void {
        this.relImg.uint8Img = MgrRes.inst.getImg (this.relImg.expImgData.dataOrigin);
        this.listenIdFinished = this.relImg.uint8Img.evterFinished.on (() => {
            this.relImg.uint8Enter (this.relImg.uint8StatusLoaded);
        });

        // 本身就加载完成，那么直接切换
        if (this.relImg.uint8Img.currStatus == this.relImg.uint8Img.statusFinished) {
            this.relImg.uint8Enter (this.relImg.uint8StatusLoaded);
        };
    }

    onExit (): void {
        this.relImg.uint8Img.evterFinished.off (this.listenIdFinished);
    }

    onDestory (): void {
        this.relImg.uint8Enter (this.relImg.uint8StatusDestroy);
    }
}

export default ExpImgUint8StatusLoading;
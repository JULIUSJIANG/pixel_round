import MgrRes from "../mgr/MgrRes.js";
import DBImgUint8Status from "./DBImgUint8Status.js";
import ExpImgUint8Status from "./ExpImgUint8Status.js";

class DBImgUint8StatusLoading extends DBImgUint8Status {

    listenIdFinished: number;

    onEnter (): void {
        this.relImg.uint8Img = MgrRes.inst.getImg (this.relImg.dbImgData.dataOrigin);
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

    onDestroy (): void {
        this.relImg.uint8Enter (this.relImg.uint8StatusDestroy);
    }
}

export default DBImgUint8StatusLoading;
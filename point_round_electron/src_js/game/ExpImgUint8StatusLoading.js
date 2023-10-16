import MgrRes from "../mgr/MgrRes.js";
import ExpImgUint8Status from "./ExpImgUint8Status.js";
class ExpImgUint8StatusLoading extends ExpImgUint8Status {
    onEnter() {
        this.relImg.uint8Img = MgrRes.inst.getImg(this.relImg.expImgData.dataOrigin);
        this.listenIdFinished = this.relImg.uint8Img.evterFinished.on(() => {
            this.relImg.uint8Enter(this.relImg.uint8StatusLoaded);
        });
    }
    onExit() {
        this.relImg.uint8Img.evterFinished.off(this.listenIdFinished);
    }
    onDestory() {
        this.relImg.uint8Enter(this.relImg.uint8StatusDestroy);
    }
}
export default ExpImgUint8StatusLoading;

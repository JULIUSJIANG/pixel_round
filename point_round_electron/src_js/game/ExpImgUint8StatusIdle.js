import ExpImgUint8Status from "./ExpImgUint8Status.js";
class ExpImgUint8StatusIdle extends ExpImgUint8Status {
    onSelected() {
        this.relImg.uint8Enter(this.relImg.uint8StatusLoading);
    }
}
export default ExpImgUint8StatusIdle;

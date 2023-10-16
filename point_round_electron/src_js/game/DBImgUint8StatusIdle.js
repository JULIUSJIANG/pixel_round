import DBImgUint8Status from "./DBImgUint8Status.js";
class DBImgUint8StatusIdle extends DBImgUint8Status {
    onSelected() {
        this.relImg.uint8Enter(this.relImg.uint8StatusLoading);
    }
}
export default DBImgUint8StatusIdle;

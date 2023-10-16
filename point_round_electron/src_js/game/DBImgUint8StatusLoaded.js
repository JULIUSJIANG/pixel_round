import MgrGlobal from "../mgr/MgrGlobal.js";
import DBImgUint8Status from "./DBImgUint8Status.js";
class DBImgUint8StatusLoaded extends DBImgUint8Status {
    onEnter() {
        let img = this.relImg.uint8Img.image;
        let data = MgrGlobal.inst.imageToUint8Arr(img, this.relImg.dbImgData.width, this.relImg.dbImgData.height);
        this.relImg.statusPush(data, this.relImg.dbImgData.width, this.relImg.dbImgData.height);
    }
}
export default DBImgUint8StatusLoaded;

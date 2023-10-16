import MgrGlobal from "../mgr/MgrGlobal.js";
import ExpImgUint8Status from "./ExpImgUint8Status.js";
class ExpImgUint8StatusLoaded extends ExpImgUint8Status {
    onEnter() {
        let img = this.relImg.uint8Img.image;
        let data = MgrGlobal.inst.imageToUint8Arr(img, img.width, img.height);
        this.relImg.uint8Bin.loadData(data);
        this.relImg.uint8Width = img.width;
        this.relImg.uint8Height = img.height;
    }
}
export default ExpImgUint8StatusLoaded;

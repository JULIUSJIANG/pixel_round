import MgrGlobal from "../mgr/MgrGlobal.js";
import DBImgUint8Status from "./DBImgUint8Status.js";

class DBImgUint8StatusLoaded extends DBImgUint8Status {

    onEnter (): void {
        let img = this.relImg.uint8Img.image;
        let data = MgrGlobal.inst.imageToUint8Arr (img, img.width, img.height);
        this.relImg.statusPush (data, img.width, img.height);
    }
}

export default DBImgUint8StatusLoaded;
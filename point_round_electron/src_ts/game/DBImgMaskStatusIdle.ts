import DBImg from "./DBImg.js";
import DBImgMaskStatus from "./DBImgMaskStatus.js";

class DBImgMaskStatusIdle extends DBImgMaskStatus {

    onMaskEnable (dbImg: DBImg): void {
        this.relImg.mask = dbImg;
        this.relImg.maskEnter (this.relImg.maskStatusActive);
    }
}

export default DBImgMaskStatusIdle;
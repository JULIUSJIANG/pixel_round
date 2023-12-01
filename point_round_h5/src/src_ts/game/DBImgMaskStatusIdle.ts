import DBImg from "./DBImg";
import DBImgMaskStatus from "./DBImgMaskStatus";

class DBImgMaskStatusIdle extends DBImgMaskStatus {

    onMaskEnable (dbImg: DBImg): void {
        this.relImg.mask = dbImg;
        this.relImg.maskEnter (this.relImg.maskStatusActive);
    }
}

export default DBImgMaskStatusIdle;
import ExpImg from "./ExpImg.js";
import ExpImgMaskStatus from "./ExpImgMaskStatus.js";

class ExpImgMaskStatusIdle extends ExpImgMaskStatus {

    onMaskEnable (expImg: ExpImg): void {
        this.relImg.mask = expImg;
        this.relImg.maskEnter (this.relImg.maskStatusActive);
    }
}

export default ExpImgMaskStatusIdle;
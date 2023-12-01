import ExpImg from "./ExpImg";
import ExpImgMaskStatus from "./ExpImgMaskStatus";

class ExpImgMaskStatusIdle extends ExpImgMaskStatus {

    onMaskEnable (expImg: ExpImg): void {
        this.relImg.mask = expImg;
        this.relImg.maskEnter (this.relImg.maskStatusActive);
    }
}

export default ExpImgMaskStatusIdle;
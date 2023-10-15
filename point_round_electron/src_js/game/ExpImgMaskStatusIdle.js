import ExpImgMaskStatus from "./ExpImgMaskStatus.js";
class ExpImgMaskStatusIdle extends ExpImgMaskStatus {
    onMaskEnable(expImg) {
        this.relImg.mask = expImg;
        this.relImg.maskEnter(this.relImg.maskStatusActive);
    }
}
export default ExpImgMaskStatusIdle;

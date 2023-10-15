import DBImgMaskStatus from "./DBImgMaskStatus.js";
class DBImgMaskStatusIdle extends DBImgMaskStatus {
    onMaskEnable(dbImg) {
        this.relImg.mask = dbImg;
        this.relImg.maskEnter(this.relImg.maskStatusActive);
    }
}
export default DBImgMaskStatusIdle;

import DBImgMaskStatus from "./DBImgMaskStatus.js";

class DBImgMaskStatusActive extends DBImgMaskStatus {

    onMaskDisable (): void {
        this.relImg.mask = null;
        this.relImg.maskEnter (this.relImg.maskStatusIdle);
    }

    /**
     * 用面具的数据替代
     * @returns 
     */
    onGetData () {
        return this.relImg.mask;
    }
}

export default DBImgMaskStatusActive;
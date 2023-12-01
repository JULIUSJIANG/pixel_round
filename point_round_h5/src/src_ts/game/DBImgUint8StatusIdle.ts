import DBImgUint8Status from "./DBImgUint8Status";

class DBImgUint8StatusIdle extends DBImgUint8Status {

    onSelected (): void {
        this.relImg.uint8Enter (this.relImg.uint8StatusLoading);
    }
}

export default DBImgUint8StatusIdle;
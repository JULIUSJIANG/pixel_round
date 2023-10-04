import MgrResAssetsImage from "./MgrResAssetsImage.js";
class MgrRes {
    constructor() {
        this._mapStringToImg = new Map();
    }
    init() {
    }
    getImg(dataUrl) {
        if (!this._mapStringToImg.has(dataUrl)) {
            this._mapStringToImg.set(dataUrl, new MgrResAssetsImage(dataUrl));
        }
        ;
        return this._mapStringToImg.get(dataUrl);
    }
}
(function (MgrRes) {
    /**
     * 全局实例
     */
    MgrRes.inst = new MgrRes();
})(MgrRes || (MgrRes = {}));
export default MgrRes;

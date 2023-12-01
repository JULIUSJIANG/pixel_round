import MgrResAssetsImage from "./MgrResAssetsImage";

class MgrRes {

    init () {
        
    }

    _mapStringToImg = new Map <string, MgrResAssetsImage> ();

    getImg (dataUrl: string) {
        if (!this._mapStringToImg.has (dataUrl)) {
            this._mapStringToImg.set (dataUrl, new MgrResAssetsImage (dataUrl));
        };
        return this._mapStringToImg.get (dataUrl);
    }
}

namespace MgrRes {
    /**
     * 全局实例
     */
    export const inst = new MgrRes ();
}

export default MgrRes;
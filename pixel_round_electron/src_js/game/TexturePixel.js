import objectPool from "../common/ObjectPool.js";
import ObjectPoolType from "../common/ObjectPoolType.js";
import TexturePixelCorner from "./TexturePixelCorner.js";
/**
 * 像素记录
 */
class TexturePixel {
    constructor() {
        this.cornerLT = new TexturePixelCorner();
        this.cornerRT = new TexturePixelCorner();
        this.cornerRB = new TexturePixelCorner();
        this.cornerLB = new TexturePixelCorner();
    }
    static create(dataSrc, posX, posY) {
        let inst = objectPool.pop(this.poolType);
        return inst;
    }
}
TexturePixel.poolType = new ObjectPoolType({
    instantiate: () => {
        return new TexturePixel();
    },
    onPop: (t) => {
    },
    onPush: (t) => {
    }
});
export default TexturePixel;

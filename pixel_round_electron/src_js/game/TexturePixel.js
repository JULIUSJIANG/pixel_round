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
    /**
     * 获取某个角
     * @param texturePixel
     * @param vecX
     * @param vecY
     */
    static getCorner(texturePixel, vecX, vecY) {
        if (vecX == -1 && vecY == 1) {
            return texturePixel.cornerLT;
        }
        ;
        if (vecX == 1 && vecY == 1) {
            return texturePixel.cornerRT;
        }
        ;
        if (vecX == 1 && vecY == -1) {
            return texturePixel.cornerRB;
        }
        ;
        if (vecX == -1 && vecY == -1) {
            return texturePixel.cornerLB;
        }
        ;
        return null;
    }
    static create(dataSrc, posX, posY) {
        let inst = objectPool.pop(this.poolType);
        return inst;
    }
}
/**
 * 角的方位 x 的集合
 */
TexturePixel.listCornerX = [-1, 1];
/**
 * 角的方位 y 的集合
 */
TexturePixel.listCornerY = [-1, 1];
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

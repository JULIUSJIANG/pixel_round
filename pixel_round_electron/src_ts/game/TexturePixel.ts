import objectPool from "../common/ObjectPool.js";
import ObjectPoolType from "../common/ObjectPoolType.js";
import DetailMachineStatusPreview from "./DetailMachineStatusPreview.js";
import TexturePixelCorner from "./TexturePixelCorner.js";

/**
 * 像素记录
 */
class TexturePixel {
    /**
     * 角 - 左上
     */
    cornerLT: TexturePixelCorner;
    /**
     * 角 - 右上
     */
    cornerRT: TexturePixelCorner;
    /**
     * 角 - 右下
     */
    cornerRB: TexturePixelCorner;
    /**
     * 角 - 左下
     */
    cornerLB: TexturePixelCorner;

    private constructor () {
        this.cornerLT = new TexturePixelCorner ();
        this.cornerRT = new TexturePixelCorner ();
        this.cornerRB = new TexturePixelCorner ();
        this.cornerLB = new TexturePixelCorner ();
    }

    /**
     * 角的方位 x 的集合
     */
    static listCornerX = [- 1, 1];
    /**
     * 角的方位 y 的集合
     */
    static listCornerY = [- 1, 1];

    /**
     * 获取某个角
     * @param texturePixel 
     * @param vecX 
     * @param vecY 
     */
    static getCorner (texturePixel: TexturePixel, vecX: number, vecY: number) {
        if (vecX == - 1 && vecY == 1) {
            return texturePixel.cornerLT;
        };
        if (vecX == 1 && vecY == 1) {
            return texturePixel.cornerRT;
        };
        if (vecX == 1 && vecY == - 1) {
            return texturePixel.cornerRB;
        };
        if (vecX == - 1 && vecY == - 1) {
            return texturePixel.cornerLB;
        };
        return null;
    }

    public static create (dataSrc: DetailMachineStatusPreview, posX: number, posY: number) {
        let inst = objectPool.pop (this.poolType);
        return inst;
    }

    private static poolType = new ObjectPoolType ({
        instantiate: () => {
            return new TexturePixel ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        }
    });
}

export default TexturePixel;
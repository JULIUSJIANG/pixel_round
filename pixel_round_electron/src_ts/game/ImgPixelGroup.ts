import objectPool from "../common/ObjectPool.js";
import ObjectPoolType from "../common/ObjectPoolType.js";

/**
 * 像素块的分组
 */
class ImgPixelGroup {

    color: number;

    static create (color: number) {
        let val = objectPool.pop (this.poolType);
        val.color = color;
        return val;
    }

    public static poolType = new ObjectPoolType <ImgPixelGroup> ({
        instantiate: () => new ImgPixelGroup,
        onPop: null,
        onPush: null
    });
}

export default ImgPixelGroup;
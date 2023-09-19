import objectPool from "../common/ObjectPool.js";
import ObjectPoolType from "../common/ObjectPoolType.js";
/**
 * 像素块的分组
 */
class ImgPixelGroup {
    static create(color) {
        let val = objectPool.pop(this.poolType);
        val.color = color;
        return val;
    }
}
ImgPixelGroup.poolType = new ObjectPoolType({
    instantiate: () => new ImgPixelGroup,
    onPop: null,
    onPush: null
});
export default ImgPixelGroup;

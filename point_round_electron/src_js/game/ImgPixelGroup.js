import JWebglColor from "../common/JWebglColor.js";
import objectPool from "../common/ObjectPool.js";
import ObjectPoolType from "../common/ObjectPoolType.js";
/**
 * 像素块的分组
 */
class ImgPixelGroup {
    constructor() {
        /**
         * 颜色对象
         */
        this.colorObj = new JWebglColor();
        /**
         * 点的位置
         */
        this.listPos = new Array();
    }
    /**
     * 记录位置
     * @param x
     * @param y
     */
    addPos(x, y) {
        this.listPos.push(x, y);
        if (this.borderLeft == null || x < this.borderLeft) {
            this.borderLeft = x;
        }
        ;
        if (this.borderRight == null || this.borderRight < x) {
            this.borderRight = x;
        }
        ;
        if (this.borderTop == null || this.borderTop < y) {
            this.borderTop = y;
        }
        ;
        if (this.borderBottom == null || y < this.borderBottom) {
            this.borderBottom = y;
        }
        ;
    }
    /**
     * 进行数据缓存
     */
    cache() {
        this.areaWidth = this.borderRight - this.borderLeft + 1;
        this.areaHeight = this.borderTop - this.borderBottom + 1;
        this.areaVolume = this.areaWidth * this.areaHeight;
        this.areaSize = Math.max(this.areaWidth, this.areaHeight);
    }
    static create(color) {
        let val = objectPool.pop(this.poolType);
        val.colorId = color;
        let colorA = color % 256;
        color >>= 8;
        let colorB = color % 256;
        color >>= 8;
        let colorG = color % 256;
        color >>= 8;
        let colorR = color % 256;
        color >>= 8;
        val.colorObj.init(colorR / 255, colorG / 255, colorB / 255, colorA / 255);
        val.listPos.length = 0;
        val.borderTop = null;
        val.borderRight = null;
        val.borderBottom = null;
        val.borderLeft = null;
        return val;
    }
}
ImgPixelGroup.poolType = new ObjectPoolType({
    instantiate: () => new ImgPixelGroup,
    onPop: null,
    onPush: null
});
export default ImgPixelGroup;

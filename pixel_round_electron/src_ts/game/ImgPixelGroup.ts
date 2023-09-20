import JWebglColor from "../common/JWebglColor.js";
import objectPool from "../common/ObjectPool.js";
import ObjectPoolType from "../common/ObjectPoolType.js";

/**
 * 像素块的分组
 */
class ImgPixelGroup {
    /**
     * 颜色 id
     */
    colorId: number;
    /**
     * 颜色对象
     */
    colorObj = new JWebglColor ();
    /**
     * 点的位置
     */
    listPos = new Array <number> ();

    /**
     * 边界 - 上
     */
    borderTop: number;
    /**
     * 边界 - 右
     */
    borderRight: number;
    /**
     * 边界 - 下
     */
    borderBottom: number;
    /**
     * 边界 - 左
     */
    borderLeft: number;

    /**
     * 记录位置
     * @param x 
     * @param y 
     */
    addPos (x: number, y: number) {
        this.listPos.push (x, y);
        if (this.borderLeft == null || x < this.borderLeft) {
            this.borderLeft = x;
        };
        if (this.borderRight == null || this.borderRight < x) {
            this.borderRight = x;
        };
        if (this.borderTop == null || this.borderTop < y) {
            this.borderTop = y;
        };
        if (this.borderBottom == null || y < this.borderBottom) {
            this.borderBottom = y;
        };
    }

    /**
     * 宽
     */
    areaWidth: number;
    /**
     * 高
     */
    areaHeight: number;
    /**
     * 面积
     */
    areaVolume: number;

    /**
     * 进行数据缓存
     */
    cache () {
        this.areaWidth = this.borderRight - this.borderLeft + 1;
        this.areaHeight = this.borderTop - this.borderBottom + 1;
        this.areaVolume = this.areaWidth * this.areaHeight;
    }

    static create (color: number) {
        let val = objectPool.pop (this.poolType);
        val.colorId = color;
        let colorA = color % 256;
        color >>= 8;
        let colorB = color % 256;
        color >>= 8;
        let colorG = color % 256;
        color >>= 8;
        let colorR = color % 256;
        color >>= 8;
        val.colorObj.init (colorR / 255, colorG / 255, colorB / 255, colorA / 255);
        val.listPos.length = 0;

        val.borderTop = null;
        val.borderRight = null;
        val.borderBottom = null;
        val.borderLeft = null;

        return val;
    }

    public static poolType = new ObjectPoolType <ImgPixelGroup> ({
        instantiate: () => new ImgPixelGroup,
        onPop: null,
        onPush: null
    });
}

export default ImgPixelGroup;
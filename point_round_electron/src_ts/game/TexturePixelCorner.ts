import CornerTypeRSBoth from "./CornerTypeRSBoth.js";

/**
 * 像素的角记录
 */
class TexturePixelCorner {
    /**
     * 取色，0 为左，1 为 右
     */
    color: number;
    /**
     * 该角的平滑类型
     */
    rsBoth: CornerTypeRSBoth;
}

export default TexturePixelCorner;
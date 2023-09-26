import JWebglMathVector4 from "../common/JWebglMathVector4.js";
/**
 * 角的类型 - 考虑 2 侧
 */
class CornerTypeRSBoth {
    constructor(args) {
        this.id = args.id;
        this.isSmooth = args.isSmooth;
        CornerTypeRSBoth.mapCodeToRS.set(args.id, this);
    }
    /**
     * 在该坐标系下的代号
     * @param vecForwardX
     * @param vecForwardY
     * @param vecRightX
     * @param vecRightY
     */
    namedByAxis(vecForwardX, vecForwardY, vecRightX, vecRightY) {
        CornerTypeRSBoth.vecForward.elements[0] = vecForwardX;
        CornerTypeRSBoth.vecForward.elements[1] = vecForwardY;
        CornerTypeRSBoth.vecForward.elements[2] = 0;
        CornerTypeRSBoth.vecRight.elements[0] = vecRightX;
        CornerTypeRSBoth.vecRight.elements[1] = vecRightY;
        CornerTypeRSBoth.vecRight.elements[2] = 0;
        JWebglMathVector4.cross(CornerTypeRSBoth.vecRight, CornerTypeRSBoth.vecForward, CornerTypeRSBoth.vecCross);
        let sign = Math.sign(CornerTypeRSBoth.vecCross.elements[2]);
        // 非标准坐标系，对于非对称平滑要镜像处理
        if (sign == -1) {
            if (this == CornerTypeRSBoth.left) {
                return CornerTypeRSBoth.right;
            }
            ;
            if (this == CornerTypeRSBoth.right) {
                return CornerTypeRSBoth.left;
            }
            ;
        }
        ;
        return this;
    }
}
/**
 * 方向 - 前
 */
CornerTypeRSBoth.vecForward = new JWebglMathVector4();
/**
 * 方向 - 右
 */
CornerTypeRSBoth.vecRight = new JWebglMathVector4();
/**
 * 方向 - 叉乘
 */
CornerTypeRSBoth.vecCross = new JWebglMathVector4();
(function (CornerTypeRSBoth) {
    /**
     * 代号到注册信息的映射
     */
    CornerTypeRSBoth.mapCodeToRS = new Map();
    /**
     * 无需处理
     */
    CornerTypeRSBoth.none = new CornerTypeRSBoth({
        id: 0,
        isSmooth: false,
    });
    /**
     * 正前方一刀
     */
    CornerTypeRSBoth.forward = new CornerTypeRSBoth({
        id: 1,
        isSmooth: true,
    });
    /**
     * 左边一刀
     */
    CornerTypeRSBoth.left = new CornerTypeRSBoth({
        id: 2,
        isSmooth: true,
    });
    /**
     * 右边一刀
     */
    CornerTypeRSBoth.right = new CornerTypeRSBoth({
        id: 3,
        isSmooth: true,
    });
    /**
     * 俩边都来一刀
     */
    CornerTypeRSBoth.bothSide = new CornerTypeRSBoth({
        id: 4,
        isSmooth: true,
    });
    /**
     * 正前方半刀
     */
    CornerTypeRSBoth.forwardHalf = new CornerTypeRSBoth({
        id: 5,
        isSmooth: false,
    });
})(CornerTypeRSBoth || (CornerTypeRSBoth = {}));
export default CornerTypeRSBoth;

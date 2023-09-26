import JWebglMathVector4 from "../common/JWebglMathVector4.js";

/**
 * 角的类型 - 考虑 2 侧
 */
class CornerTypeRSBoth {

    /**
     * 标识
     */
    id: number;

    constructor (args: {
        id: number
    }) 
    {
        this.id = args.id;
        CornerTypeRSBoth.mapCodeToRS.set (args.id, this);
    }

    /**
     * 方向 - 前
     */
    static vecForward = new JWebglMathVector4 ();
    /**
     * 方向 - 右
     */
    static vecRight = new JWebglMathVector4 ();
    /**
     * 方向 - 叉乘
     */
    static vecCross = new JWebglMathVector4 ();

    /**
     * 在该坐标系下的代号
     * @param vecForwardX 
     * @param vecForwardY 
     * @param vecRightX 
     * @param vecRightY 
     */
    namedByAxis (
        vecForwardX: number, 
        vecForwardY: number, 
        
        vecRightX: number, 
        vecRightY: number
    ) 
    {
        CornerTypeRSBoth.vecForward.elements [0] = vecForwardX;
        CornerTypeRSBoth.vecForward.elements [1] = vecForwardY;
        CornerTypeRSBoth.vecForward.elements [2] = 0;

        CornerTypeRSBoth.vecRight.elements [0] = vecRightX;
        CornerTypeRSBoth.vecRight.elements [1] = vecRightY;
        CornerTypeRSBoth.vecRight.elements [2] = 0;

        JWebglMathVector4.cross (CornerTypeRSBoth.vecRight, CornerTypeRSBoth.vecForward, CornerTypeRSBoth.vecCross);
        let sign = Math.sign (CornerTypeRSBoth.vecCross.elements [2]);
        // 非标准坐标系，对于非对称平滑要镜像处理
        if (sign == -1) {
            if (this == CornerTypeRSBoth.left) {
                return CornerTypeRSBoth.right;
            };
            if (this == CornerTypeRSBoth.right) {
                return CornerTypeRSBoth.left;
            };
        };
        return this;
    }
}

namespace CornerTypeRSBoth {
    /**
     * 代号到注册信息的映射
     */
    export const mapCodeToRS = new Map <number, CornerTypeRSBoth> ();

    /**
     * 无需处理
     */
    export const none = new CornerTypeRSBoth ({
        id: 0
    });
    /**
     * 正前方一刀
     */
    export const forward = new CornerTypeRSBoth ({
        id: 1
    });
    /**
     * 左边一刀
     */
    export const left = new CornerTypeRSBoth ({
        id: 2
    });
    /**
     * 右边一刀
     */
    export const right = new CornerTypeRSBoth ({
        id: 3
    });
    /**
     * 俩边都来一刀
     */
    export const bothSide = new CornerTypeRSBoth ({
        id: 4
    });
    /**
     * 正前方半刀
     */
    export const forwardHalf = new CornerTypeRSBoth ({
        id: 5
    });
}

export default CornerTypeRSBoth;
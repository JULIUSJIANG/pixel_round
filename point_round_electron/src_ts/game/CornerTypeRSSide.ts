import CornerTypeRSBoth from "./CornerTypeRSBoth.js";

/**
 * 角的类型 - 考虑单侧
 */
class CornerTypeRSSide {

    /**
     * 标识
     */
    id: number;

    /**
     * 根据右方的类型作出的反应
     */
    onRight: (rsSide: CornerTypeRSSide) => CornerTypeRSBoth;

    constructor (args: {
        id: number,
        onRight: (rsSide: CornerTypeRSSide) => CornerTypeRSBoth
    }) 
    {
        this.id = args.id;
        this.onRight = args.onRight;
        CornerTypeRSSide.mapCodeToRS.set (args.id, this);
    }
}

namespace CornerTypeRSSide {
    /**
     * 代号到注册信息的映射
     */
    export const mapCodeToRS = new Map <number, CornerTypeRSSide> ();

    /**
     * 无需处理
     */
    export const none = new CornerTypeRSSide ({
        id: 0,
        onRight: (type) => {
            switch (type) {
                case none: {
                    return CornerTypeRSBoth.none;
                };
                case forward: {
                    return CornerTypeRSBoth.forward;
                };
                case side: {
                    return CornerTypeRSBoth.right;
                };
            };
        }
    });
    /**
     * 正前方一刀
     */
    export const forward = new CornerTypeRSSide ({
        id: 1,
        onRight: (type) => {
            switch (type) {
                case none: {
                    return CornerTypeRSBoth.forward;
                };
                case forward: {
                    return CornerTypeRSBoth.forward;
                };
                case side: {
                    return CornerTypeRSBoth.right;
                };
            };
        }
    });
    /**
     * 侧边一刀
     */
    export const side = new CornerTypeRSSide ({
        id: 2,
        onRight: (type) => {
            switch (type) {
                case none: {
                    return CornerTypeRSBoth.left;
                };
                case forward: {
                    return CornerTypeRSBoth.left;
                };
                case side: {
                    return CornerTypeRSBoth.bothSide;
                };
            };
        }
    });
}

export default CornerTypeRSSide;
import CornerTypeRSBoth from "./CornerTypeRSBoth.js";
/**
 * 角的类型 - 考虑单侧
 */
class CornerTypeRSSide {
    constructor(args) {
        this.id = args.id;
        this.onRight = args.onRight;
        CornerTypeRSSide.mapCodeToRS.set(args.id, this);
    }
}
(function (CornerTypeRSSide) {
    /**
     * 代号到注册信息的映射
     */
    CornerTypeRSSide.mapCodeToRS = new Map();
    /**
     * 无需处理
     */
    CornerTypeRSSide.none = new CornerTypeRSSide({
        id: 0,
        onRight: (type) => {
            switch (type) {
                case CornerTypeRSSide.none:
                    {
                        return CornerTypeRSBoth.none;
                    }
                    ;
                case CornerTypeRSSide.forward:
                    {
                        return CornerTypeRSBoth.forward;
                    }
                    ;
                case CornerTypeRSSide.side:
                    {
                        return CornerTypeRSBoth.right;
                    }
                    ;
            }
            ;
        }
    });
    /**
     * 正前方一刀
     */
    CornerTypeRSSide.forward = new CornerTypeRSSide({
        id: 1,
        onRight: (type) => {
            switch (type) {
                case CornerTypeRSSide.none:
                    {
                        return CornerTypeRSBoth.forward;
                    }
                    ;
                case CornerTypeRSSide.forward:
                    {
                        return CornerTypeRSBoth.forward;
                    }
                    ;
                case CornerTypeRSSide.side:
                    {
                        return CornerTypeRSBoth.right;
                    }
                    ;
            }
            ;
        }
    });
    /**
     * 侧边一刀
     */
    CornerTypeRSSide.side = new CornerTypeRSSide({
        id: 2,
        onRight: (type) => {
            switch (type) {
                case CornerTypeRSSide.none:
                    {
                        return CornerTypeRSBoth.left;
                    }
                    ;
                case CornerTypeRSSide.forward:
                    {
                        return CornerTypeRSBoth.left;
                    }
                    ;
                case CornerTypeRSSide.side:
                    {
                        return CornerTypeRSBoth.bothSide;
                    }
                    ;
            }
            ;
        }
    });
})(CornerTypeRSSide || (CornerTypeRSSide = {}));
export default CornerTypeRSSide;

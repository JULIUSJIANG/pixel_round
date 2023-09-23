/**
 * 角的类型 - 考虑 2 侧
 */
class CornerTypeRSBoth {
    constructor(args) {
        this.id = args.id;
        CornerTypeRSBoth.mapCodeToRS.set(args.id, this);
    }
}
(function (CornerTypeRSBoth) {
    /**
     * 代号到注册信息的映射
     */
    CornerTypeRSBoth.mapCodeToRS = new Map();
    /**
     * 无需处理
     */
    CornerTypeRSBoth.none = new CornerTypeRSBoth({
        id: 0
    });
    /**
     * 正前方一刀
     */
    CornerTypeRSBoth.forward = new CornerTypeRSBoth({
        id: 1
    });
    /**
     * 左边一刀
     */
    CornerTypeRSBoth.left = new CornerTypeRSBoth({
        id: 2
    });
    /**
     * 右边一刀
     */
    CornerTypeRSBoth.right = new CornerTypeRSBoth({
        id: 3
    });
    /**
     * 俩边都来一刀
     */
    CornerTypeRSBoth.bothSide = new CornerTypeRSBoth({
        id: 4
    });
})(CornerTypeRSBoth || (CornerTypeRSBoth = {}));
export default CornerTypeRSBoth;

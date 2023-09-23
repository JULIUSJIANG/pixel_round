/**
 * 角的类型 - 考虑 2 侧
 */
class CornerTypeRSBoth {

    id: number;

    constructor (args: {
        id: number
    }) 
    {
        this.id = args.id;
        CornerTypeRSBoth.mapCodeToRS.set (args.id, this);
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
}

export default CornerTypeRSBoth;
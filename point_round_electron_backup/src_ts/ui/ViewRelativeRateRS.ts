
class ViewRelativeRateRS {

    /**
     * 标识
     */
    id: number;

    /**
     * 占比 - 左
     */
    rateLeft: number;

    /**
     * 占比 - 右
     */
    rateRight: number;

    /**
     * 昵称
     */
    name: string;

    constructor (args: {
        id: number,
        rateLeft: number,
        rateRight: number
    })
    {
        this.id = args.id;
        this.rateLeft = args.rateLeft;
        this.rateRight = args.rateRight;

        this.name = `${this.rateLeft} : ${this.rateRight}`;

        ViewRelativeRateRS.listInst.push (this);
        ViewRelativeRateRS.mapIdToInst.set (this.id, this);
    }

    /**
     * 左边栏可见
     * @returns 
     */
    isLeftVisiable () {
        return 0 < this.rateLeft;
    }

    /**
     * 右边栏可见
     * @returns 
     */
    isRightVisiable () {
        return 0 < this.rateRight;
    }
}

namespace ViewRelativeRateRS {
    /**
     * 全部实例
     */
    export const listInst = new Array <ViewRelativeRateRS> ();
    /**
     * 标识到实例的映射
     */
    export const mapIdToInst = new Map <number, ViewRelativeRateRS> ();

    export const rate2_0 = new ViewRelativeRateRS ({
        id: 0,
        rateLeft: 2,
        rateRight: 0
    });
    export const rate2_1 = new ViewRelativeRateRS ({
        id: 1,
        rateLeft: 2,
        rateRight: 1
    });
    export const rate1_1 = new ViewRelativeRateRS ({
        id: 2,
        rateLeft: 1,
        rateRight: 1
    });
    export const rate1_2 = new ViewRelativeRateRS ({
        id: 3,
        rateLeft: 1,
        rateRight: 2
    });
    export const rate0_2 = new ViewRelativeRateRS ({
        id: 4,
        rateLeft: 0,
        rateRight: 2
    });
}

export default ViewRelativeRateRS;
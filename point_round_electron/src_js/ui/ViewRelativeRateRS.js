class ViewRelativeRateRS {
    constructor(args) {
        this.id = args.id;
        this.rateLeft = args.rateLeft;
        this.rateRight = args.rateRight;
        this.name = `${this.rateLeft} : ${this.rateRight}`;
        ViewRelativeRateRS.listInst.push(this);
        ViewRelativeRateRS.mapIdToInst.set(this.id, this);
    }
    /**
     * 左边栏可见
     * @returns
     */
    isLeftVisiable() {
        return 0 < this.rateLeft;
    }
    /**
     * 右边栏可见
     * @returns
     */
    isRightVisiable() {
        return 0 < this.rateRight;
    }
}
(function (ViewRelativeRateRS) {
    /**
     * 全部实例
     */
    ViewRelativeRateRS.listInst = new Array();
    /**
     * 标识到实例的映射
     */
    ViewRelativeRateRS.mapIdToInst = new Map();
    ViewRelativeRateRS.rate2_0 = new ViewRelativeRateRS({
        id: 0,
        rateLeft: 2,
        rateRight: 0
    });
    ViewRelativeRateRS.rate2_1 = new ViewRelativeRateRS({
        id: 1,
        rateLeft: 2,
        rateRight: 1
    });
    ViewRelativeRateRS.rate1_1 = new ViewRelativeRateRS({
        id: 2,
        rateLeft: 1,
        rateRight: 1
    });
    ViewRelativeRateRS.rate1_2 = new ViewRelativeRateRS({
        id: 3,
        rateLeft: 1,
        rateRight: 2
    });
    ViewRelativeRateRS.rate0_2 = new ViewRelativeRateRS({
        id: 4,
        rateLeft: 0,
        rateRight: 2
    });
})(ViewRelativeRateRS || (ViewRelativeRateRS = {}));
export default ViewRelativeRateRS;

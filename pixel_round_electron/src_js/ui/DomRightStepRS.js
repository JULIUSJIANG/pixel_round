import DomRightPreviewImgAfter from "./DomRightStep0SmoothOrdinary.js";
import DomRightStep0Mask from "./DomRightStep0Mask.js";
import DomRightStep1Split from "./DomRightStep1Split.js";
import DomRightStep2Reduce from "./DomRightStep2Reduce.js";
class DomRightStepRS {
    constructor(args) {
        this.id = args.id;
        this.name = args.name;
        this.comGetter = args.comGetter;
        DomRightStepRS.mapIdToInst.set(this.id, this);
        DomRightStepRS.listInst.push(this);
    }
}
(function (DomRightStepRS) {
    DomRightStepRS.mapIdToInst = new Map();
    DomRightStepRS.listInst = new Array();
    DomRightStepRS.step1Split = new DomRightStepRS({
        id: 0,
        name: `步骤 1: 分割`,
        comGetter: () => DomRightStep1Split
    });
    DomRightStepRS.step2Reduce = new DomRightStepRS({
        id: 1,
        name: `步骤 2: 迭代`,
        comGetter: () => DomRightStep2Reduce
    });
    DomRightStepRS.step3Smooth = new DomRightStepRS({
        id: 2,
        name: `步骤 3: 平滑`,
        comGetter: () => DomRightStep0Mask
    });
    DomRightStepRS.step4Merge = new DomRightStepRS({
        id: 3,
        name: `步骤 4: 合并`,
        comGetter: () => DomRightPreviewImgAfter
    });
})(DomRightStepRS || (DomRightStepRS = {}));
export default DomRightStepRS;

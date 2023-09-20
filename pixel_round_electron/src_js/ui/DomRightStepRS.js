import DomRightPreviewImgAfter from "./DomRightStep0SmoothOrdinary.js";
import DomRightStep1Split from "./DomRightStep1Split.js";
import DomRightStep2Reduce from "./DomRightStep2Reduce.js";
import DomRightStep3Smooth from "./DomRightStep3Smooth.js";
import DomRightStep4Merge from "./DomRightStep4Merge.js";
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
    DomRightStepRS.step0Smooth0 = new DomRightStepRS({
        id: 2001,
        name: `经典平滑`,
        comGetter: () => DomRightPreviewImgAfter
    });
    DomRightStepRS.step1Split = new DomRightStepRS({
        id: 1001,
        name: `步骤 1: 分割`,
        comGetter: () => DomRightStep1Split
    });
    DomRightStepRS.step2Reduce = new DomRightStepRS({
        id: 1002,
        name: `步骤 2: 迭代`,
        comGetter: () => DomRightStep2Reduce
    });
    DomRightStepRS.step3Smooth = new DomRightStepRS({
        id: 1003,
        name: `步骤 3: 平滑`,
        comGetter: () => DomRightStep3Smooth
    });
    DomRightStepRS.step4Merge = new DomRightStepRS({
        id: 1004,
        name: `步骤 4: 合并`,
        comGetter: () => DomRightStep4Merge
    });
})(DomRightStepRS || (DomRightStepRS = {}));
export default DomRightStepRS;

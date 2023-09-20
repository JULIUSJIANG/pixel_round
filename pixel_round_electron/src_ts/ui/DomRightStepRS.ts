import ReactComponentExtend from "../common/ReactComponentExtend.js";
import DomRightPreviewImgAfter from "./DomRightStep0SmoothOrdinary.js";
import DomRightStep0Mask from "./DomRightStep0Mask.js";
import DomRightStep1Split from "./DomRightStep1Split.js";
import DomRightStep2Reduce from "./DomRightStep2Reduce.js";
import DomRightStep3Smooth from "./DomRightStep3Smooth.js";
import DomRightStep4Merge from "./DomRightStep4Merge.js";

type ReactComponentExtendType <T> = (new (state, t: T) => ReactComponentExtend <T>);

class DomRightStepRS <AT extends ReactComponentExtendType <number>> {

    id: number;

    name: string;

    comGetter: () => AT;

    constructor (args: {
        id: number,
        name: string,
        comGetter: () => AT
    }) 
    {
        this.id = args.id;
        this.name = args.name;
        this.comGetter = args.comGetter;
        DomRightStepRS.mapIdToInst.set (this.id, this);
        DomRightStepRS.listInst.push (this);
    }
}

namespace DomRightStepRS {

    export const mapIdToInst = new Map <number, DomRightStepRS <any>> ();

    export const listInst = new Array <DomRightStepRS <any>> ();

    export const step0Smooth0 = new DomRightStepRS ({
        id: 2001,
        name: `经典平滑`,
        comGetter: () => DomRightPreviewImgAfter
    });

    export const step1Split = new DomRightStepRS ({
        id: 1001,
        name: `步骤 1: 分割`,
        comGetter: () => DomRightStep1Split
    });
    export const step2Reduce = new DomRightStepRS ({
        id: 1002,
        name: `步骤 2: 迭代`,
        comGetter: () => DomRightStep2Reduce
    });
    export const step3Smooth = new DomRightStepRS ({
        id: 1003,
        name: `步骤 3: 平滑`,
        comGetter: () => DomRightStep3Smooth
    });
    export const step4Merge = new DomRightStepRS ({
        id: 1004,
        name: `步骤 4: 合并`,
        comGetter: () => DomRightStep4Merge
    });
}

export default DomRightStepRS;
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import DomRightPreviewImgAfter from "./DomRightStep0SmoothOrdinary.js";
import DomRightStep0Mask from "./DomRightStep0Mask.js";
import DomRightStep1Split from "./DomRightStep1Split.js";
import DomRightStep2Reduce from "./DomRightStep2Reduce.js";
import DomRightStep3Smooth from "./DomRightStep3Smooth.js";

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

    export const step1Split = new DomRightStepRS ({
        id: 0,
        name: `步骤 1: 分割`,
        comGetter: () => DomRightStep1Split
    });
    export const step2Reduce = new DomRightStepRS ({
        id: 1,
        name: `步骤 2: 迭代`,
        comGetter: () => DomRightStep2Reduce
    });
    export const step3Smooth = new DomRightStepRS ({
        id: 2,
        name: `步骤 3: 平滑`,
        comGetter: () => DomRightStep3Smooth
    });
    export const step4Merge = new DomRightStepRS ({
        id: 3,
        name: `步骤 4: 合并`,
        comGetter: () => DomRightPreviewImgAfter
    });
}

export default DomRightStepRS;
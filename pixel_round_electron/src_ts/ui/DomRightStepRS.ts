import ReactComponentExtend from "../common/ReactComponentExtend.js";
import DomRightSmooth1Ordinary from "./DomRightSmooth1Ordinary.js";
import DomRightSmooth2Block from "./DomRightSmooth2Block.js";
import DomRightSmooth3Mark from "./DomRightSmooth3Mark.js";

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

    export const smooth0 = new DomRightStepRS ({
        id: 1,
        name: `经典平滑`,
        comGetter: () => DomRightSmooth1Ordinary
    });
    export const smooth1 = new DomRightStepRS ({
        id: 2,
        name: `分块平滑`,
        comGetter: () => DomRightSmooth2Block
    });
    export const smooth2 = new DomRightStepRS ({
        id: 3,
        name: `定制平滑`,
        comGetter: () => DomRightSmooth3Mark
    });
}

export default DomRightStepRS;
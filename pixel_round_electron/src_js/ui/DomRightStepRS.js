import DomRightSmooth1Ordinary from "./DomRightSmooth1Ordinary.js";
import DomRightSmooth2Block from "./DomRightSmooth2Block.js";
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
        id: 1,
        name: `经典平滑`,
        comGetter: () => DomRightSmooth1Ordinary
    });
    DomRightStepRS.step4Merge = new DomRightStepRS({
        id: 2,
        name: `分块平滑`,
        comGetter: () => DomRightSmooth2Block
    });
})(DomRightStepRS || (DomRightStepRS = {}));
export default DomRightStepRS;

import DomRightSmooth1Ordinary from "./DomRightSmooth1Ordinary.js";
import DomRightSmooth2Block from "./DomRightSmooth2Block.js";
import DomRightSmooth3Mark from "./DomRightSmooth3Mark.js";
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
    DomRightStepRS.smooth0 = new DomRightStepRS({
        id: 1,
        name: `经典平滑`,
        comGetter: () => DomRightSmooth1Ordinary
    });
    DomRightStepRS.smooth1 = new DomRightStepRS({
        id: 2,
        name: `分块平滑`,
        comGetter: () => DomRightSmooth2Block
    });
    DomRightStepRS.smooth2 = new DomRightStepRS({
        id: 3,
        name: `定制平滑`,
        comGetter: () => DomRightSmooth3Mark
    });
})(DomRightStepRS || (DomRightStepRS = {}));
export default DomRightStepRS;

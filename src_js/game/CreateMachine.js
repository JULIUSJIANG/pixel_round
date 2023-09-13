import MgrData from "../mgr/MgrData.js";
import CreateMachineStatusIdle from "./CreateMachineStatusIdle.js";
import CreateMachineStatusLoading from "./CreateMachineStatusLoading.js";
import CreateMachineStatusUploading from "./CreateMachineStatusUploading.js";
export default class CreateMachine {
    constructor(indexGlobal) {
        this.canvasWidth = 400;
        this.canvasHeight = 400;
        this.relGlobal = indexGlobal;
        this.statusIdle = new CreateMachineStatusIdle(this);
        this.statusUploading = new CreateMachineStatusUploading(this);
        this.statusLoading = new CreateMachineStatusLoading(this);
        this.enter(this.statusIdle);
    }
    enter(status) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.onExit();
        }
        ;
        this.currStatus.onEnter();
        MgrData.inst.callDataChange();
    }
}

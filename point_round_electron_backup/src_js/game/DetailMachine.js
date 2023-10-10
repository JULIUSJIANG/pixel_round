import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import DetailMachineStatusCreate from "./DetailMachineStatusCreate.js";
import DetailMachineStatusPreview from "./DetailMachineStatusPreview.js";
export default class DetailMachine {
    constructor(indexGlobal) {
        this.mapIdToStatus = new Map();
        this.relGlobal = indexGlobal;
        this.statusCreate = new DetailMachineStatusCreate(this, 0);
        this.mapIdToStatus.set(this.statusCreate.id, this.statusCreate);
        this.statusPreview = new DetailMachineStatusPreview(this, 1);
        this.mapIdToStatus.set(this.statusPreview.id, this.statusPreview);
    }
    enter(status) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.onExit();
        }
        ;
        this.currStatus.onEnter();
        MgrData.inst.set(MgrDataItem.DETAIL_MACHINE_STATUS, this.currStatus.id);
    }
}

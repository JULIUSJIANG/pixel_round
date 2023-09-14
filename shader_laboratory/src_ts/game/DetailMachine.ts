import IndexGlobal from "../IndexGlobal.js";
import DetailMachineStatus from "./DetailMachineStatus.js";
import DetailMachineStatusCreate from "./DetailMachineStatusCreate.js";
import DetailMachineStatusPreview from "./DetailMachineStatusPreview.js";

export default class DetailMachine {

    relGlobal: IndexGlobal;

    mapIdToStatus = new Map <number, DetailMachineStatus> ();

    constructor (indexGlobal: IndexGlobal) {
        this.relGlobal = indexGlobal;

        this.statusCreate = new DetailMachineStatusCreate (this, 0);
        this.mapIdToStatus.set (this.statusCreate.id, this.statusCreate);
        this.statusPreview = new DetailMachineStatusPreview (this, 1);
        this.mapIdToStatus.set (this.statusPreview.id, this.statusPreview);
    }

    currStatus: DetailMachineStatus;

    statusCreate: DetailMachineStatusCreate;

    statusPreview: DetailMachineStatusPreview;

    enter (status: DetailMachineStatus) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.onExit ();
        };
        this.currStatus.onEnter ();
    }
}
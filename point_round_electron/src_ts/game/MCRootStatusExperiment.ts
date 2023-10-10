import IndexGlobal from "../IndexGlobal.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MCRootStatusExperimentStatus from "./MCRootStatusExperimentStatus.js";
import MCRootStatusExperimentStatusSmooth from "./MCRootStatusExperimentStatusSmooth.js";
import MCRootStatus from "./MCRootStatus.js";
import MCRoot from "./MCRoot.js";
import MCRootStatusExperimentStatusCreate from "./MCRootStatusExperimentStatusCreate.js";

export default class MCRootStatusExperiment extends MCRootStatus {

    relGlobal: IndexGlobal;

    listStatus = new Array <MCRootStatusExperimentStatus> ();

    mapIdToStatus = new Map <number, MCRootStatusExperimentStatus> ();

    constructor (mcRoot: MCRoot, id: number) {
        super (mcRoot, id);

        this.statusCreate = new MCRootStatusExperimentStatusCreate (this, 0);
        this.statusPreview = new MCRootStatusExperimentStatusSmooth (this, 1);
    }

    currStatus: MCRootStatusExperimentStatus;

    statusCreate: MCRootStatusExperimentStatusCreate;

    statusPreview: MCRootStatusExperimentStatusSmooth;

    enter (status: MCRootStatusExperimentStatus) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.onExit ();
        };
        this.currStatus.onEnter ();
        MgrData.inst.set (MgrDataItem.DETAIL_MACHINE_STATUS, this.currStatus.id);
    }

    onInit (): void {
        for (let i = 0; i < this.listStatus.length; i++) {
            let listStatusI = this.listStatus [i];
            listStatusI.onInit ();
        };
        this.enter (this.mapIdToStatus.get (MgrData.inst.get (MgrDataItem.DETAIL_MACHINE_STATUS)));
    }
}
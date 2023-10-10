import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MCRootStatusExperimentStatusSmooth from "./MCRootStatusExperimentStatusSmooth.js";
import MCRootStatus from "./MCRootStatus.js";
import MCRootStatusExperimentStatusCreate from "./MCRootStatusExperimentStatusCreate.js";
export default class MCRootStatusExperiment extends MCRootStatus {
    constructor(mcRoot, id) {
        super(mcRoot, id);
        this.listStatus = new Array();
        this.mapIdToStatus = new Map();
        this.statusCreate = new MCRootStatusExperimentStatusCreate(this, 0);
        this.statusPreview = new MCRootStatusExperimentStatusSmooth(this, 1);
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
    onInit() {
        for (let i = 0; i < this.listStatus.length; i++) {
            let listStatusI = this.listStatus[i];
            listStatusI.onInit();
        }
        ;
        this.enter(this.mapIdToStatus.get(MgrData.inst.get(MgrDataItem.DETAIL_MACHINE_STATUS)));
    }
}

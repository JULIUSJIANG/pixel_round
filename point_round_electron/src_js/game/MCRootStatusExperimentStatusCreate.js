import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import DomExperimentRightCreate from "../ui/DomExperimentRightCreate.js";
import MCRootStatusExperimentStatusCreateStatusIdle from "./MCRootStatusExperimentStatusCreateStatusIdle.js";
import MCRootStatusExperimentStatusCreateStatusLoading from "./MCRootStatusExperimentStatusCreateStatusLoading.js";
import MCRootStatusExperimentStatusCreateStatusUploading from "./MCRootStatusExperimentStatusCreateStatusUploading.js";
import MCRootStatusExperimentStatus from "./MCRootStatusExperimentStatus.js";
export default class MCRootStatusExperimentStatusCreate extends MCRootStatusExperimentStatus {
    constructor(machine, id) {
        super(machine, id);
        this.statusIdle = new MCRootStatusExperimentStatusCreateStatusIdle(this);
        this.statusUploading = new MCRootStatusExperimentStatusCreateStatusUploading(this);
        this.statusLoading = new MCRootStatusExperimentStatusCreateStatusLoading(this);
        this.enter(this.statusIdle);
    }
    onImg(id) {
        MgrData.inst.set(MgrDataItem.CURRENT_IMG, id);
        this.relMachine.enter(this.relMachine.statusPreview);
    }
    onRender() {
        return ReactComponentExtend.instantiateComponent(DomExperimentRightCreate, null);
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

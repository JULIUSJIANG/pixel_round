import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrData from "../mgr/MgrData.js";
import DomExperimentRightCreate from "../ui/DomExperimentRightCreate.js";
import MCRootStatusExperimentDetailStatusCreateStatusIdle from "./MCRootStatusExperimentDetailStatusCreateStatusIdle.js";
import MCRootStatusExperimentDetailStatusCreateStatusLoading from "./MCRootStatusExperimentDetailStatusCreateStatusLoading.js";
import MCRootStatusExperimentDetailStatusCreateStatusUploading from "./MCRootStatusExperimentDetailStatusCreateStatusUploading.js";
import MCRootStatusExperimentDetailStatus from "./MCRootStatusExperimentDetailStatus.js";
export default class MCRootStatusExperimentDetailStatusCreate extends MCRootStatusExperimentDetailStatus {
    constructor(machine, id) {
        super(machine, id);
        this.statusIdle = new MCRootStatusExperimentDetailStatusCreateStatusIdle(this);
        this.statusUploading = new MCRootStatusExperimentDetailStatusCreateStatusUploading(this);
        this.statusLoading = new MCRootStatusExperimentDetailStatusCreateStatusLoading(this);
        this.enter(this.statusIdle);
    }
    onImg() {
        this.relMachine.detailEnter(this.relMachine.detailStatusPreview);
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

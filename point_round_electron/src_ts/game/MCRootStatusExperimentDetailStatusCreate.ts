import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrResAssetsImage from "../mgr/MgrResAssetsImage.js";
import DomExperimentRightCreate from "../ui/DomExperimentRightCreate.js";
import MCRootStatusExperimentDetailStatusCreateStatus from "./MCRootStatusExperimentDetailStatusCreateStatus.js";
import MCRootStatusExperimentDetailStatusCreateStatusIdle from "./MCRootStatusExperimentDetailStatusCreateStatusIdle.js";
import MCRootStatusExperimentDetailStatusCreateStatusLoading from "./MCRootStatusExperimentDetailStatusCreateStatusLoading.js";
import MCRootStatusExperimentDetailStatusCreateStatusUploading from "./MCRootStatusExperimentDetailStatusCreateStatusUploading.js";
import MCRootStatusExperiment from "./MCRootStatusExperiment.js";
import MCRootStatusExperimentDetailStatus from "./MCRootStatusExperimentDetailStatus.js";

export default class MCRootStatusExperimentDetailStatusCreate extends MCRootStatusExperimentDetailStatus {

    onImg (id: number): void {
        MgrData.inst.set (MgrDataItem.EXP_CURRENT_IMG, id);
        this.relMachine.detailEnter (this.relMachine.detailStatusPreview);
    }

    onRender(): ReactComponentExtendInstance {
        return ReactComponentExtend.instantiateComponent (DomExperimentRightCreate, null);
    }

    img: MgrResAssetsImage;

    constructor (machine: MCRootStatusExperiment, id: number) {
        super (machine, id);

        this.statusIdle = new MCRootStatusExperimentDetailStatusCreateStatusIdle (this);
        this.statusUploading = new MCRootStatusExperimentDetailStatusCreateStatusUploading (this);
        this.statusLoading = new MCRootStatusExperimentDetailStatusCreateStatusLoading (this);

        this.enter (this.statusIdle);
    }

    statusIdle: MCRootStatusExperimentDetailStatusCreateStatusIdle;

    statusUploading: MCRootStatusExperimentDetailStatusCreateStatusUploading;

    statusLoading: MCRootStatusExperimentDetailStatusCreateStatusLoading;

    currStatus: MCRootStatusExperimentDetailStatusCreateStatus;

    enter (status: MCRootStatusExperimentDetailStatusCreateStatus) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.onExit ();
        };
        this.currStatus.onEnter ();
        MgrData.inst.callDataChange ();
    }
}
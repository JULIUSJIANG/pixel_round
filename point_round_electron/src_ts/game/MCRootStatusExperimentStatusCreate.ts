import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrResAssetsImage from "../mgr/MgrResAssetsImage.js";
import DomExperimentRightCreate from "../ui/DomExperimentRightCreate.js";
import MCRootStatusExperimentStatusCreateStatus from "./MCRootStatusExperimentStatusCreateStatus.js";
import MCRootStatusExperimentStatusCreateStatusIdle from "./MCRootStatusExperimentStatusCreateStatusIdle.js";
import MCRootStatusExperimentStatusCreateStatusLoading from "./MCRootStatusExperimentStatusCreateStatusLoading.js";
import MCRootStatusExperimentStatusCreateStatusUploading from "./MCRootStatusExperimentStatusCreateStatusUploading.js";
import MCRootStatusExperiment from "./MCRootStatusExperiment.js";
import MCRootStatusExperimentStatus from "./MCRootStatusExperimentStatus.js";

export default class MCRootStatusExperimentStatusCreate extends MCRootStatusExperimentStatus{

    onImg (id: number): void {
        MgrData.inst.set (MgrDataItem.EXP_CURRENT_IMG, id);
        this.relMachine.enter (this.relMachine.statusPreview);
    }

    onRender(): ReactComponentExtendInstance {
        return ReactComponentExtend.instantiateComponent (DomExperimentRightCreate, null);
    }

    img: MgrResAssetsImage;

    constructor (machine: MCRootStatusExperiment, id: number) {
        super (machine, id);

        this.statusIdle = new MCRootStatusExperimentStatusCreateStatusIdle (this);
        this.statusUploading = new MCRootStatusExperimentStatusCreateStatusUploading (this);
        this.statusLoading = new MCRootStatusExperimentStatusCreateStatusLoading (this);

        this.enter (this.statusIdle);
    }

    statusIdle: MCRootStatusExperimentStatusCreateStatusIdle;

    statusUploading: MCRootStatusExperimentStatusCreateStatusUploading;

    statusLoading: MCRootStatusExperimentStatusCreateStatusLoading;

    currStatus: MCRootStatusExperimentStatusCreateStatus;

    enter (status: MCRootStatusExperimentStatusCreateStatus) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.onExit ();
        };
        this.currStatus.onEnter ();
        MgrData.inst.callDataChange ();
    }
}
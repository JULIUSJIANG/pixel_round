import ReactComponentExtend from "../common/ReactComponentExtend";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance";
import MgrData from "../mgr/MgrData";
import MgrResAssetsImage from "../mgr/MgrResAssetsImage";
import DomExperimentRightCreate from "../ui/DomExperimentRightCreate";
import MCRootStatusExperimentDetailStatusCreateStatus from "./MCRootStatusExperimentDetailStatusCreateStatus";
import MCRootStatusExperimentDetailStatusCreateStatusIdle from "./MCRootStatusExperimentDetailStatusCreateStatusIdle";
import MCRootStatusExperimentDetailStatusCreateStatusLoading from "./MCRootStatusExperimentDetailStatusCreateStatusLoading";
import MCRootStatusExperimentDetailStatusCreateStatusUploading from "./MCRootStatusExperimentDetailStatusCreateStatusUploading";
import MCRootStatusExperiment from "./MCRootStatusExperiment";
import MCRootStatusExperimentDetailStatus from "./MCRootStatusExperimentDetailStatus";

export default class MCRootStatusExperimentDetailStatusCreate extends MCRootStatusExperimentDetailStatus {

    onImg (): void {
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
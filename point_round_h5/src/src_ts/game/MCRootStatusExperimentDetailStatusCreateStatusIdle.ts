import IndexGlobal from "../IndexGlobal";
import MCRootStatusExperimentDetailStatusCreateStatus from "./MCRootStatusExperimentDetailStatusCreateStatus";

export default class MCRootStatusExperimentDetailStatusCreateStatusIdle extends MCRootStatusExperimentDetailStatusCreateStatus {

    onUploading (uid: string): void {
        this.relMachine.statusUploading.targetUid = uid;
        this.relMachine.enter (this.relMachine.statusUploading);
    }
}
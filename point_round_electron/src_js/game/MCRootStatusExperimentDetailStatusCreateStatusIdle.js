import MCRootStatusExperimentDetailStatusCreateStatus from "./MCRootStatusExperimentDetailStatusCreateStatus.js";
export default class MCRootStatusExperimentDetailStatusCreateStatusIdle extends MCRootStatusExperimentDetailStatusCreateStatus {
    onUploading(uid) {
        this.relMachine.statusUploading.targetUid = uid;
        this.relMachine.enter(this.relMachine.statusUploading);
    }
    onEnter() {
        if (this.relMachine.img != null) {
        }
        ;
    }
}

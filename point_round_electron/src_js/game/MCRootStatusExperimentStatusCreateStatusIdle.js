import MCRootStatusExperimentStatusCreateStatus from "./MCRootStatusExperimentStatusCreateStatus.js";
export default class MCRootStatusExperimentStatusCreateStatusIdle extends MCRootStatusExperimentStatusCreateStatus {
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

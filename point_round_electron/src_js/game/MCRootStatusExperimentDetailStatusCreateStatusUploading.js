import MCRootStatusExperimentDetailStatusCreateStatus from "./MCRootStatusExperimentDetailStatusCreateStatus.js";
export default class MCRootStatusExperimentDetailStatusCreateStatusUploading extends MCRootStatusExperimentDetailStatusCreateStatus {
    onUploading(uid) {
        this.targetUid = uid;
    }
    onDone(uid, dataUrl) {
        if (uid != this.targetUid) {
            return;
        }
        ;
        this.relMachine.statusLoading.dataUrl = dataUrl;
        this.relMachine.enter(this.relMachine.statusLoading);
    }
    onDraggerTxt() {
        return `加载中...`;
    }
}

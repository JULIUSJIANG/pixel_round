import MCRootStatusExperimentStatusCreateStatus from "./MCRootStatusExperimentStatusCreateStatus.js";
export default class MCRootStatusExperimentStatusCreateStatusUploading extends MCRootStatusExperimentStatusCreateStatus {
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

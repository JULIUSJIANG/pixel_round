import MCRootStatusExperimentStatusCreateStatus from "./MCRootStatusExperimentStatusCreateStatus.js";

export default class MCRootStatusExperimentStatusCreateStatusUploading extends MCRootStatusExperimentStatusCreateStatus {
    
    targetUid: string;

    onUploading (uid: string): void {
       this.targetUid = uid;
    }

    onDone (uid: string, dataUrl: string): void {
        if (uid != this.targetUid) {
            return;
        };
        this.relMachine.statusLoading.dataUrl = dataUrl;
        this.relMachine.enter (this.relMachine.statusLoading);
    }

    onDraggerTxt () {
        return `加载中...`;
    }
}
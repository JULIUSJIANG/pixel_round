import MCRootStatusExperimentDetailStatusCreateStatus from "./MCRootStatusExperimentDetailStatusCreateStatus.js";

export default class MCRootStatusExperimentDetailStatusCreateStatusIdle extends MCRootStatusExperimentDetailStatusCreateStatus {
    
    onUploading (uid: string): void {
        this.relMachine.statusUploading.targetUid = uid;
        this.relMachine.enter (this.relMachine.statusUploading);
    }

    onEnter (): void {
        if (this.relMachine.img != null) {
            
        };
    }
}
import MCRootStatusExperimentStatusCreateStatus from "./MCRootStatusExperimentStatusCreateStatus.js";

export default class MCRootStatusExperimentStatusCreateStatusIdle extends MCRootStatusExperimentStatusCreateStatus {
    
    onUploading (uid: string): void {
        this.relMachine.statusUploading.targetUid = uid;
        this.relMachine.enter (this.relMachine.statusUploading);
    }

    onEnter (): void {
        if (this.relMachine.img != null) {
            
        };
    }
}
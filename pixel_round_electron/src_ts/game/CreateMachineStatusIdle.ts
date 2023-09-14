import CreateMachineStatus from "./CreateMachineStatus.js";

export default class CreateMachineStatusIdle extends CreateMachineStatus {
    
    onUploading (uid: string): void {
        this.relMachine.statusUploading.targetUid = uid;
        this.relMachine.enter (this.relMachine.statusUploading);
    }

    onEnter (): void {
        if (this.relMachine.img != null) {
            
        };
    }
}
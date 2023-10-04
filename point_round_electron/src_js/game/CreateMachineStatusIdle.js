import CreateMachineStatus from "./CreateMachineStatus.js";
export default class CreateMachineStatusIdle extends CreateMachineStatus {
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

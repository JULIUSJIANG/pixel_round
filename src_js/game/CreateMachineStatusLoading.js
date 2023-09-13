import MgrRes from "../mgr/MgrRes.js";
import CreateMachineStatus from "./CreateMachineStatus.js";
export default class CreateMachineStatusLoading extends CreateMachineStatus {
    onEnter() {
        this.img = MgrRes.inst.getImg(this.dataUrl);
        if (this.img.currStatus == this.img.statusFinished) {
            this.transfer();
        }
        else {
            this.listenIdLoadFinished = this.img.evterFinished.on(() => {
                this.transfer();
            });
        }
        ;
    }
    transfer() {
        this.relMachine.img = this.img;
        this.relMachine.canvasWidth = 400;
        this.relMachine.canvasHeight = 400;
        // this.relMachine.canvasWidth = this.relMachine.img.image.width;
        // this.relMachine.canvasHeight = this.relMachine.img.image.height;
        this.relMachine.enter(this.relMachine.statusIdle);
    }
    onExit() {
        this.img.evterFinished.off(this.listenIdLoadFinished);
    }
    onUploading(uid) {
        this.relMachine.statusUploading.targetUid = uid;
        this.relMachine.enter(this.relMachine.statusUploading);
    }
    onDraggerTxt() {
        return `加载中...`;
    }
}

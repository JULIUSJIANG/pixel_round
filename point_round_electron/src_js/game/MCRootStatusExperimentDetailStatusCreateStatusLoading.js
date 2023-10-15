import MgrRes from "../mgr/MgrRes.js";
import MCRootStatusExperimentDetailStatusCreateStatus from "./MCRootStatusExperimentDetailStatusCreateStatus.js";
export default class MCRootStatusExperimentDetailStatusCreateStatusLoading extends MCRootStatusExperimentDetailStatusCreateStatus {
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

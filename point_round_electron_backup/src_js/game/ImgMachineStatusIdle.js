import ImgMachineStatus from "./ImgMachineStatus.js";
/**
 * 状态 - 初始化时候
 */
class ImgMachineStatusIdle extends ImgMachineStatus {
    onEnter() {
        if (this.relMachine.assetsImg.currStatus == this.relMachine.assetsImg.statusFinished) {
            this.relMachine.enter(this.relMachine.statusLoaded);
        }
        else {
            this._listenId = this.relMachine.assetsImg.evterFinished.on(() => {
                this.relMachine.enter(this.relMachine.statusLoaded);
            });
        }
        ;
    }
    onExit() {
        this.relMachine.assetsImg.evterFinished.off(this._listenId);
    }
}
export default ImgMachineStatusIdle;

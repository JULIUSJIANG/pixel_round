import SmoothMachineStatus from "./SmoothMachineStatus.js";
/**
 * 状态 - 初始化时候
 */
class SmoothMachineStatusIdle extends SmoothMachineStatus {
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
export default SmoothMachineStatusIdle;

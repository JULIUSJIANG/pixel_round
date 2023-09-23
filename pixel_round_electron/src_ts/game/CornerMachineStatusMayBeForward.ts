import CornerMachineStatus from "./CornerMachineStatus.js";

/**
 * 角状态机 - 状态 - 有平滑的可能
 */
class CornerMachineStatusMayBeForward extends CornerMachineStatus {

    onEnter (): void {
        // 左前以及右前颜色一致，前方平滑，但是也有侧方平滑的可能
        if (this.relMachine.colorLF == this.relMachine.colorRF) {
            this.relMachine.enter (this.relMachine.statusMayBeSide)
        }
        // 否则不用平滑
        else {
            this.relMachine.enter (this.relMachine.statusResultNone);
        };
    }
}

export default CornerMachineStatusMayBeForward;
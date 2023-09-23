import CornerMachineStatus from "./CornerMachineStatus.js";

/**
 * 角状态机 - 状态 - 有平滑的可能
 */
class CornerMachineStatusMayBeSide extends CornerMachineStatus {

    onEnter (): void {
        // 左方以及右前颜色一致，侧方平滑
        if (this.relMachine.colorLeft == this.relMachine.colorRF) {
            this.relMachine.enter (this.relMachine.statusResultSide);
        }
        // 否则只是前方平滑
        else {
            this.relMachine.enter (this.relMachine.statusResultForward);
        };
    }
}

export default CornerMachineStatusMayBeSide;
import CornerMachineStatus from "./CornerMachineStatus.js";

/**
 * 角状态机 - 状态 - 待机
 */
class CornerMachineStatusIdle extends CornerMachineStatus {

    onEnter (): void {
        // 左前颜色与中心颜色一致，不用平滑
        if (this.relMachine.colorLF == this.relMachine.colorCurrent) {
            this.relMachine.enter (this.relMachine.statusResultNone);
        }
        // 颜色不一致，保留可能
        else {
            this.relMachine.enter (this.relMachine.statusMayBeForward);
        };
    }
}

export default CornerMachineStatusIdle;
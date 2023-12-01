import ExpImg from "./ExpImg";
import MCRootStatusExperimentDragStatus from "./MCRootStatusExperimentDragStatus";

class MCRootStatusExperimentDragStatusHover extends MCRootStatusExperimentDragStatus {

    onEnd (): void {
        this.relMachine.dragEnter (this.relMachine.dragStatusIdle);
    }

    onTargetEnter (expImg: ExpImg): void {
        // 忽略多余操作
        if (expImg == this.relMachine.dragTargetStart) {
            return;
        };
        this.relMachine.dragTargetHover = expImg;
        this.relMachine.dragEnter (this.relMachine.dragStatusTargeted);
    }
}

export default MCRootStatusExperimentDragStatusHover;
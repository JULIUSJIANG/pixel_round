import MCRootStatusExperimentDragStatus from "./MCRootStatusExperimentDragStatus.js";
class MCRootStatusExperimentDragStatusHover extends MCRootStatusExperimentDragStatus {
    onEnd() {
        this.relMachine.dragEnter(this.relMachine.dragStatusIdle);
    }
    onTargetEnter(expImg) {
        // 忽略多余操作
        if (expImg == this.relMachine.dragTargetStart) {
            return;
        }
        ;
        this.relMachine.dragTargetHover = expImg;
        this.relMachine.dragEnter(this.relMachine.dragStatusTargeted);
    }
}
export default MCRootStatusExperimentDragStatusHover;

import MCRootStatusExperimentDragStatus from "./MCRootStatusExperimentDragStatus.js";
class MCRootStatusExperimentDragStatusIdle extends MCRootStatusExperimentDragStatus {
    onStart(expImg) {
        this.relMachine.dragTargetStart = expImg;
        this.relMachine.dragEnter(this.relMachine.dargStatusHover);
    }
}
export default MCRootStatusExperimentDragStatusIdle;

import ExpImg from "./ExpImg";
import MCRootStatusExperimentDragStatus from "./MCRootStatusExperimentDragStatus";

class MCRootStatusExperimentDragStatusIdle extends MCRootStatusExperimentDragStatus {

    onStart (expImg: ExpImg): void {
        this.relMachine.dragTargetStart = expImg;
        this.relMachine.dragEnter (this.relMachine.dargStatusHover);
    }
}

export default MCRootStatusExperimentDragStatusIdle;
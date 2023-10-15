import DBImg from "./DBImg.js";
import ExpImg from "./ExpImg.js";
import MCRootStatusDrawingBoardDragStatus from "./MCRootStatusDrawingBoardDragStatus.js";
import MCRootStatusExperimentDragStatus from "./MCRootStatusExperimentDragStatus.js";

class MCRootStatusExperimentDragStatusIdle extends MCRootStatusExperimentDragStatus {

    onStart (expImg: ExpImg): void {
        this.relMachine.dragTargetStart = expImg;
        this.relMachine.dragEnter (this.relMachine.dargStatusHover);
    }
}

export default MCRootStatusExperimentDragStatusIdle;
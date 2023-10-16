import DBImg from "./DBImg.js";
import MCRootStatusDrawingBoardDragStatus from "./MCRootStatusDrawingBoardDragStatus.js";

class MCRootStatusDrawingBoardDragStatusIdle extends MCRootStatusDrawingBoardDragStatus {

    onStart (dbImg: DBImg): void {
        this.relMachine.dragTargetStart = dbImg;
        this.relMachine.dragEnter (this.relMachine.dargStatusHover);
    }
}

export default MCRootStatusDrawingBoardDragStatusIdle;
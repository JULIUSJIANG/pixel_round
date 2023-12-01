import DBImg from "./DBImg";
import MCRootStatusDrawingBoardDragStatus from "./MCRootStatusDrawingBoardDragStatus";

class MCRootStatusDrawingBoardDragStatusIdle extends MCRootStatusDrawingBoardDragStatus {

    onStart (dbImg: DBImg): void {
        this.relMachine.dragTargetStart = dbImg;
        this.relMachine.dragEnter (this.relMachine.dargStatusHover);
    }
}

export default MCRootStatusDrawingBoardDragStatusIdle;
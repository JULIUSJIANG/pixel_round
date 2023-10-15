import MCRootStatusDrawingBoardDragStatus from "./MCRootStatusDrawingBoardDragStatus.js";
class MCRootStatusDrawingBoardDragStatusIdle extends MCRootStatusDrawingBoardDragStatus {
    onStart(dbImg) {
        this.relMachine.dragTargetStart = dbImg;
        this.relMachine.dragEnter(this.relMachine.dargStatusHover);
    }
}
export default MCRootStatusDrawingBoardDragStatusIdle;

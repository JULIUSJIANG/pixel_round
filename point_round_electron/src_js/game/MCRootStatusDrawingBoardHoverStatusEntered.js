import MCRootStatusDrawingBoardHoverStatus from "./MCRootStatusDrawingBoardHoverStatus.js";
class MCRootStatusDrawingBoardHoverStatusEntered extends MCRootStatusDrawingBoardHoverStatus {
    onHoverExit() {
        this.relMachine.hoverEnter(this.relMachine.hoverStatusLeaved);
    }
}
export default MCRootStatusDrawingBoardHoverStatusEntered;

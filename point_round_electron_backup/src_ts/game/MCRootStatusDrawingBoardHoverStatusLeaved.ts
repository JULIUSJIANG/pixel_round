import MCRootStatusDrawingBoardHoverStatus from "./MCRootStatusDrawingBoardHoverStatus.js";

class MCRootStatusDrawingBoardHoverStatusLeaved extends MCRootStatusDrawingBoardHoverStatus {

    onHoverEnter (): void {
        this.relMachine.hoverEnter (this.relMachine.hoverStatusEntered);
    }
}

export default MCRootStatusDrawingBoardHoverStatusLeaved;
import MCRootStatusDrawingBoardHoverStatus from "./MCRootStatusDrawingBoardHoverStatus.js";

class MCRootStatusDrawingBoardHoverStatusEntered extends MCRootStatusDrawingBoardHoverStatus {

    onHoverExit (): void {
        this.relMachine.hoverEnter (this.relMachine.hoverStatusLeaved);
    }
}

export default MCRootStatusDrawingBoardHoverStatusEntered;
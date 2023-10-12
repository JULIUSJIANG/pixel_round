import MCRootStatusDrawingBoardHoverStatus from "./MCRootStatusDrawingBoardHoverStatus.js";
class MCRootStatusDrawingBoardHoverStatusEntered extends MCRootStatusDrawingBoardHoverStatus {
    onHoverExit() {
        this.relMachine.hoverEnter(this.relMachine.hoverStatusLeaved);
    }
    onFocusDraw(jWebgl, color) {
        this.relMachine.touchCurrStatus.onFocusDraw(jWebgl, color);
    }
}
export default MCRootStatusDrawingBoardHoverStatusEntered;

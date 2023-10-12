import MCRootStatusDrawingBoardHoverStatus from "./MCRootStatusDrawingBoardHoverStatus.js";
class MCRootStatusDrawingBoardHoverStatusEntered extends MCRootStatusDrawingBoardHoverStatus {
    onHoverExit() {
        this.relMachine.hoverEnter(this.relMachine.hoverStatusLeaved);
    }
    onOpUpdate(dataSrc) {
        this.relMachine.touchCurrStatus.onOpUpdate(dataSrc);
    }
    onFocusDraw(dataSrc) {
        this.relMachine.touchCurrStatus.onFocusDraw(dataSrc);
    }
}
export default MCRootStatusDrawingBoardHoverStatusEntered;

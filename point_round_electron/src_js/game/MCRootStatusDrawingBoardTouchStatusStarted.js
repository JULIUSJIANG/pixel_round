import MCRootStatusDrawingBoardTouchStatus from "./MCRootStatusDrawingBoardTouchStatus.js";
class MCRootStatusDrawingBoardTouchStatusStarted extends MCRootStatusDrawingBoardTouchStatus {
    onMove(canvasX, canvasY) {
        this.relMachine.touchPosMove.fill(canvasX, canvasY);
        this.relMachine.touchCurrentPos = this.relMachine.touchPosMove;
        this.relMachine.touchEnter(this.relMachine.touchStatusMoved);
    }
}
export default MCRootStatusDrawingBoardTouchStatusStarted;

import MCRootStatusDrawingBoardTouchStatus from "./MCRootStatusDrawingBoardTouchStatus.js";
class MCRootStatusDrawingBoardTouchStatusEnded extends MCRootStatusDrawingBoardTouchStatus {
    onStart(canvasX, canvasY) {
        this.relMachine.touchPosStart.fill(canvasX, canvasY);
        this.relMachine.touchCurrentPos = this.relMachine.touchPosStart;
        this.relMachine.touchEnter(this.relMachine.touchStatusStarted);
    }
    onMove(canvasX, canvasY) {
        this.relMachine.touchPosMove.fill(canvasX, canvasY);
        this.relMachine.touchCurrentPos = this.relMachine.touchPosMove;
    }
}
export default MCRootStatusDrawingBoardTouchStatusEnded;

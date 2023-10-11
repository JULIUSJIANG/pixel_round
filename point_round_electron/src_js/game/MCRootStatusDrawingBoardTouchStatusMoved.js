import MCRootStatusDrawingBoardTouchStatus from "./MCRootStatusDrawingBoardTouchStatus.js";
class MCRootStatusDrawingBoardTouchStatusMoved extends MCRootStatusDrawingBoardTouchStatus {
    onMove(canvasX, canvasY) {
        this.relMachine.touchPosMove.fill(canvasX, canvasY);
        this.relMachine.touchCurrentPos = this.relMachine.touchPosMove;
    }
    onEnd(canvasX, canvasY) {
        this.relMachine.touchPosEnd.fill(canvasX, canvasY);
        this.relMachine.touchCurrentPos = this.relMachine.touchPosEnd;
        this.relMachine.touchEnter(this.relMachine.touchStatusEnded);
    }
}
export default MCRootStatusDrawingBoardTouchStatusMoved;

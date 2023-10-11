import MCRootStatusDrawingBoardTouchStatus from "./MCRootStatusDrawingBoardTouchStatus.js";

class MCRootStatusDrawingBoardTouchStatusEnded extends MCRootStatusDrawingBoardTouchStatus {

    onStart (canvasX: number, canvasY: number): void {
        this.relMachine.touchPosStart.fill (canvasX, canvasY);
        this.relMachine.touchCurrentPos = this.relMachine.touchPosStart;
        this.relMachine.touchEnter (this.relMachine.touchStatusStarted);
    }

    onMove (canvasX: number, canvasY: number): void {
        this.relMachine.touchPosMove.fill (canvasX, canvasY);
        this.relMachine.touchCurrentPos = this.relMachine.touchPosMove;
    }
}

export default MCRootStatusDrawingBoardTouchStatusEnded;
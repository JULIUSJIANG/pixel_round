import DomDrawingBoardRightPaintCanvasSource from "../ui/DomDrawingBoardRightPaintCanvasSource.js";
import MCRootStatusDrawingBoardTouchStatus from "./MCRootStatusDrawingBoardTouchStatus.js";
class MCRootStatusDrawingBoardTouchStatusStarted extends MCRootStatusDrawingBoardTouchStatus {
    onMove(canvasX, canvasY) {
        this.relMachine.touchPosMove.fill(canvasX, canvasY);
        this.relMachine.touchCurrentPos = this.relMachine.touchPosMove;
        this.relMachine.touchEnter(this.relMachine.touchStatusMoved);
    }
    onEnd(canvasX, canvasY) {
        this.relMachine.touchPosEnd.fill(canvasX, canvasY);
        this.relMachine.touchCurrentPos = this.relMachine.touchPosEnd;
        this.relMachine.touchEnter(this.relMachine.touchStatusEnded);
    }
    onFocusDraw(jWebgl, color) {
        DomDrawingBoardRightPaintCanvasSource.drawMark(jWebgl, color, -1);
        DomDrawingBoardRightPaintCanvasSource.drawMark(jWebgl, color, 0);
        DomDrawingBoardRightPaintCanvasSource.drawMark(jWebgl, color, 1);
    }
}
export default MCRootStatusDrawingBoardTouchStatusStarted;

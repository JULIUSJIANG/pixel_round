import DomDrawingBoardRightPaintCanvasSource from "../ui/DomDrawingBoardRightPaintCanvasSource.js";
import MCRootStatusDrawingBoardTouchStatus from "./MCRootStatusDrawingBoardTouchStatus.js";
class MCRootStatusDrawingBoardTouchStatusMoved extends MCRootStatusDrawingBoardTouchStatus {
    onEnd() {
        this.relMachine.touchEnter(this.relMachine.touchStatusEnded);
    }
    onFocusDraw(jWebgl, color) {
        let x, y, w, h;
        x = Math.min(this.relMachine.touchPosStart.gridXInt, this.relMachine.touchPosMove.gridXInt);
        y = Math.min(this.relMachine.touchPosStart.gridYInt, this.relMachine.touchPosMove.gridYInt);
        w = Math.abs(this.relMachine.touchPosStart.gridXInt - this.relMachine.touchPosMove.gridXInt) + 1;
        h = Math.abs(this.relMachine.touchPosStart.gridYInt - this.relMachine.touchPosMove.gridYInt) + 1;
        // DomDrawingBoardRightPaintCanvasSource.drawCross (jWebgl, x, y, w, h, color);
        DomDrawingBoardRightPaintCanvasSource.drawMark(jWebgl, x, y, w, h, color);
    }
}
export default MCRootStatusDrawingBoardTouchStatusMoved;

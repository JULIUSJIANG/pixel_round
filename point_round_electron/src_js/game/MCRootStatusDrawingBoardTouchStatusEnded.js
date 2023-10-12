import DomDrawingBoardRightPaintCanvasSource from "../ui/DomDrawingBoardRightPaintCanvasSource.js";
import MCRootStatusDrawingBoardTouchStatus from "./MCRootStatusDrawingBoardTouchStatus.js";
class MCRootStatusDrawingBoardTouchStatusEnded extends MCRootStatusDrawingBoardTouchStatus {
    onStart() {
        this.relMachine.touchEnter(this.relMachine.touchStatusStarted);
    }
    onFocusDraw(jWebgl, color) {
        DomDrawingBoardRightPaintCanvasSource.drawCross(jWebgl, this.relMachine.touchCurrentPos.gridXInt, this.relMachine.touchCurrentPos.gridYInt, 1, 1, color);
        DomDrawingBoardRightPaintCanvasSource.drawMark(jWebgl, this.relMachine.touchCurrentPos.gridXInt, this.relMachine.touchCurrentPos.gridYInt, 1, 1, color);
    }
}
export default MCRootStatusDrawingBoardTouchStatusEnded;

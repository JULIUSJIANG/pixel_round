import DomDrawingBoardRightPaintCanvasSource from "../ui/DomDrawingBoardRightPaintCanvasSource.js";
import MCRootStatusDrawingBoardTouchStatus from "./MCRootStatusDrawingBoardTouchStatus.js";
class MCRootStatusDrawingBoardTouchStatusStarted extends MCRootStatusDrawingBoardTouchStatus {
    onMove(dataSrc) {
        this.relMachine.touchEnter(this.relMachine.touchStatusMoved);
    }
    onEnd(dataSrc) {
        this.relMachine.touchEnter(this.relMachine.touchStatusEnded);
        this.relMachine.opCurrStatus.onDo(dataSrc, this.relMachine.touchCurrentPos.gridXInt, this.relMachine.touchCurrentPos.gridYInt, 1, 1);
    }
    onOpUpdate(dataSrc) {
        this.relMachine.opCurrStatus.onUpdate(dataSrc, this.relMachine.touchCurrentPos.gridXInt, this.relMachine.touchCurrentPos.gridYInt, 1, 1);
    }
    onFocusDraw(dataSrc) {
        let jWebgl = dataSrc.jWebgl;
        let color = dataSrc.colorMark;
        DomDrawingBoardRightPaintCanvasSource.drawMark(jWebgl, this.relMachine.touchCurrentPos.gridXInt, this.relMachine.touchCurrentPos.gridYInt, 1, 1, color);
    }
}
export default MCRootStatusDrawingBoardTouchStatusStarted;
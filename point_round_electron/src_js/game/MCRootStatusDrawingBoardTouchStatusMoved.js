import DomDrawingBoardRightPaintCanvasSource from "../ui/DomDrawingBoardRightPaintCanvasSource.js";
import MCRootStatusDrawingBoardTouchStatus from "./MCRootStatusDrawingBoardTouchStatus.js";
class MCRootStatusDrawingBoardTouchStatusMoved extends MCRootStatusDrawingBoardTouchStatus {
    onEnd() {
        this.relMachine.touchEnter(this.relMachine.touchStatusEnded);
    }
    onOpUpdate(dataSrc) {
        let x, y, w, h;
        x = Math.min(this.relMachine.touchPosStart.gridXInt, this.relMachine.touchPosMove.gridXInt);
        y = Math.min(this.relMachine.touchPosStart.gridYInt, this.relMachine.touchPosMove.gridYInt);
        w = Math.abs(this.relMachine.touchPosStart.gridXInt - this.relMachine.touchPosMove.gridXInt) + 1;
        h = Math.abs(this.relMachine.touchPosStart.gridYInt - this.relMachine.touchPosMove.gridYInt) + 1;
        this.relMachine.opCurrStatus.onUpdate(dataSrc, x, y, w, h);
    }
    onFocusDraw(dataSrc) {
        let jWebgl = dataSrc.jWebgl;
        let color = dataSrc.colorMark;
        let x, y, w, h;
        x = Math.min(this.relMachine.touchPosStart.gridXInt, this.relMachine.touchPosMove.gridXInt);
        y = Math.min(this.relMachine.touchPosStart.gridYInt, this.relMachine.touchPosMove.gridYInt);
        w = Math.abs(this.relMachine.touchPosStart.gridXInt - this.relMachine.touchPosMove.gridXInt) + 1;
        h = Math.abs(this.relMachine.touchPosStart.gridYInt - this.relMachine.touchPosMove.gridYInt) + 1;
        DomDrawingBoardRightPaintCanvasSource.drawMark(jWebgl, x, y, w, h, color);
    }
}
export default MCRootStatusDrawingBoardTouchStatusMoved;

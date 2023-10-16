import DomDrawingBoardRightPaintCanvas from "../ui/DomDrawingBoardRightPaintCanvas.js";
import MCRootStatusDrawingBoardTouchStatus from "./MCRootStatusDrawingBoardTouchStatus.js";

class MCRootStatusDrawingBoardTouchStatusEnded extends MCRootStatusDrawingBoardTouchStatus {

    onStart (dataSrc: DomDrawingBoardRightPaintCanvas): void {
        this.relMachine.touchEnter (this.relMachine.touchStatusStarted);
    }

    onFocusDraw (dataSrc: DomDrawingBoardRightPaintCanvas): void {
        let jWebgl = dataSrc.jWebgl;
        let color = dataSrc.colorMark;
        DomDrawingBoardRightPaintCanvas.drawCross (jWebgl, this.relMachine.touchCurrentPos.gridXInt, this.relMachine.touchCurrentPos.gridYInt, 1, 1, color);
        DomDrawingBoardRightPaintCanvas.drawMark (jWebgl, this.relMachine.touchCurrentPos.gridXInt, this.relMachine.touchCurrentPos.gridYInt, 1, 1, color);
    }
}

export default MCRootStatusDrawingBoardTouchStatusEnded;
import DomDrawingBoardRightPaintCanvas from "../ui/DomDrawingBoardRightPaintCanvas.js";
import MCRootStatusDrawingBoardTouchStatus from "./MCRootStatusDrawingBoardTouchStatus.js";

class MCRootStatusDrawingBoardTouchStatusStarted extends MCRootStatusDrawingBoardTouchStatus {

    onMove (dataSrc: DomDrawingBoardRightPaintCanvas): void {
        this.relMachine.touchEnter (this.relMachine.touchStatusMoved);
    }

    onEnd (dataSrc: DomDrawingBoardRightPaintCanvas): void {
        this.relMachine.touchEnter (this.relMachine.touchStatusEnded);
        this.relMachine.opCurrStatus.onDo (dataSrc, this.relMachine.touchCurrentPos.gridXInt, this.relMachine.touchCurrentPos.gridYInt, 1, 1);
    }

    onOpUpdate (dataSrc: DomDrawingBoardRightPaintCanvas): void {
        this.relMachine.opCurrStatus.onUpdate (dataSrc, this.relMachine.touchCurrentPos.gridXInt, this.relMachine.touchCurrentPos.gridYInt, 1, 1);
    }

    onFocusDraw (dataSrc: DomDrawingBoardRightPaintCanvas): void {
        let jWebgl = dataSrc.jWebgl;
        let color = dataSrc.colorMark;
        DomDrawingBoardRightPaintCanvas.drawMark (jWebgl, this.relMachine.touchCurrentPos.gridXInt, this.relMachine.touchCurrentPos.gridYInt, 1, 1, color);
    }
}

export default MCRootStatusDrawingBoardTouchStatusStarted;
import JWebgl from "../common/JWebgl.js";
import JWebglColor from "../common/JWebglColor.js";
import DomDrawingBoardRightPaintCanvasSource from "../ui/DomDrawingBoardRightPaintCanvasSource.js";
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

    onFocusDraw (jWebgl: JWebgl, color: JWebglColor): void {
        DomDrawingBoardRightPaintCanvasSource.drawCross (jWebgl, color, -1);
        DomDrawingBoardRightPaintCanvasSource.drawCross (jWebgl, color, 0);
        DomDrawingBoardRightPaintCanvasSource.drawCross (jWebgl, color, 1);
        DomDrawingBoardRightPaintCanvasSource.drawMark (jWebgl, color, -1);
        DomDrawingBoardRightPaintCanvasSource.drawMark (jWebgl, color, 0);
        DomDrawingBoardRightPaintCanvasSource.drawMark (jWebgl, color, 1);
    }
}

export default MCRootStatusDrawingBoardTouchStatusEnded;
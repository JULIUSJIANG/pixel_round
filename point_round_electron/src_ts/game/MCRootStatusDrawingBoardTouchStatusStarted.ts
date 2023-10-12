import JWebgl from "../common/JWebgl.js";
import JWebglColor from "../common/JWebglColor.js";
import DomDrawingBoardRightPaintCanvasSource from "../ui/DomDrawingBoardRightPaintCanvasSource.js";
import MCRootStatusDrawingBoardTouchStatus from "./MCRootStatusDrawingBoardTouchStatus.js";

class MCRootStatusDrawingBoardTouchStatusStarted extends MCRootStatusDrawingBoardTouchStatus {

    onMove (canvasX: number, canvasY: number): void {
        this.relMachine.touchPosMove.fill (canvasX, canvasY);
        this.relMachine.touchCurrentPos = this.relMachine.touchPosMove;
        this.relMachine.touchEnter (this.relMachine.touchStatusMoved);
    }

    onEnd (canvasX: number, canvasY: number): void {
        this.relMachine.touchPosEnd.fill (canvasX, canvasY);
        this.relMachine.touchCurrentPos = this.relMachine.touchPosEnd;
        this.relMachine.touchEnter (this.relMachine.touchStatusEnded);
    }

    onFocusDraw (jWebgl: JWebgl, color: JWebglColor): void {
        DomDrawingBoardRightPaintCanvasSource.drawMark (jWebgl, color, -1);
        DomDrawingBoardRightPaintCanvasSource.drawMark (jWebgl, color, 0);
        DomDrawingBoardRightPaintCanvasSource.drawMark (jWebgl, color, 1);
    }
}

export default MCRootStatusDrawingBoardTouchStatusStarted;
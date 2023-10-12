import JWebgl from "../common/JWebgl.js";
import JWebglColor from "../common/JWebglColor.js";
import DomDrawingBoardRightPaintCanvasSource from "../ui/DomDrawingBoardRightPaintCanvasSource.js";
import MCRootStatusDrawingBoardTouchStatus from "./MCRootStatusDrawingBoardTouchStatus.js";

class MCRootStatusDrawingBoardTouchStatusMoved extends MCRootStatusDrawingBoardTouchStatus {

    onMove (canvasX: number, canvasY: number): void {
        this.relMachine.touchPosMove.fill (canvasX, canvasY);
        this.relMachine.touchCurrentPos = this.relMachine.touchPosMove;
    }

    onEnd (canvasX: number, canvasY: number): void {
        this.relMachine.touchPosEnd.fill (canvasX, canvasY);
        this.relMachine.touchCurrentPos = this.relMachine.touchPosEnd;
        this.relMachine.touchEnter (this.relMachine.touchStatusEnded);
    }

    onFocusDraw (jWebgl: JWebgl, color: JWebglColor): void {
        let x: number, y: number, w: number, h: number;
        x = Math.min (this.relMachine.touchPosStart.gridXInt, this.relMachine.touchPosMove.gridXInt);
        y = Math.min (this.relMachine.touchPosStart.gridYInt, this.relMachine.touchPosMove.gridYInt);
        w = Math.abs (this.relMachine.touchPosStart.gridXInt - this.relMachine.touchPosMove.gridXInt) + 1;
        h = Math.abs (this.relMachine.touchPosStart.gridYInt - this.relMachine.touchPosMove.gridYInt) + 1;

        DomDrawingBoardRightPaintCanvasSource.drawMark2 (
            jWebgl, 
            
            x,
            y,

            w,
            h,

            color, 
            
            -1
        );
        DomDrawingBoardRightPaintCanvasSource.drawMark2 (
            jWebgl, 
            
            x,
            y,

            w,
            h,

            color, 
            
            0
        );
        DomDrawingBoardRightPaintCanvasSource.drawMark2 (
            jWebgl, 
            
            x,
            y,

            w,
            h,

            color,
            
            1
        );
    }
}

export default MCRootStatusDrawingBoardTouchStatusMoved;
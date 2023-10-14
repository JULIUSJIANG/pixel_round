import MCRootStatusDrawingBoardTouchStatus from "./MCRootStatusDrawingBoardTouchStatus.js";
class MCRootStatusDrawingBoardTouchStatusMoved extends MCRootStatusDrawingBoardTouchStatus {
    onEnd(dataSrc) {
        this.relMachine.touchEnter(this.relMachine.touchStatusEnded);
        let x, y, w, h;
        x = Math.min(this.relMachine.touchPosStart.gridXInt, this.relMachine.touchPosMove.gridXInt);
        y = Math.min(this.relMachine.touchPosStart.gridYInt, this.relMachine.touchPosMove.gridYInt);
        w = Math.abs(this.relMachine.touchPosStart.gridXInt - this.relMachine.touchPosMove.gridXInt) + 1;
        h = Math.abs(this.relMachine.touchPosStart.gridYInt - this.relMachine.touchPosMove.gridYInt) + 1;
        this.relMachine.opCurrStatus.onDo(dataSrc, x, y, w, h);
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
        this.relMachine.opCurrStatus.onFocusDraw(dataSrc);
    }
}
export default MCRootStatusDrawingBoardTouchStatusMoved;

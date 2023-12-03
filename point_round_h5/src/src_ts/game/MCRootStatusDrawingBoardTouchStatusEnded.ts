import IndexGlobal from "../IndexGlobal";
import MgrData from "../mgr/MgrData";
import DomDrawingBoardRightPaintCanvas from "../ui/DomDrawingBoardRightPaintCanvas";
import MCRootStatusDrawingBoardTouchStatus from "./MCRootStatusDrawingBoardTouchStatus";

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

    onCode (code: string): void {
        if (code == IndexGlobal.TIPS_CANCEL_KEY) {
            IndexGlobal.inst.dbCurrent ().statusCancel ();
            MgrData.inst.callDataChange ();
        };
        if (code == IndexGlobal.TIPS_RECOVERY_KEY) {
            IndexGlobal.inst.dbCurrent ().statusRecovery ();
            MgrData.inst.callDataChange ();
        };
        let opStatus = this.relMachine.opMapCodeToStatus.get (code);
        if (opStatus == null) {
            return;
        };
        if (opStatus == this.relMachine.opCurrStatus) {
            return;
        };
        this.relMachine.opEnter (opStatus);
        MgrData.inst.callDataChange ();
    }
}

export default MCRootStatusDrawingBoardTouchStatusEnded;
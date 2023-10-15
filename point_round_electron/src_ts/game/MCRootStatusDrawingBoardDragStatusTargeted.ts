import MgrData from "../mgr/MgrData.js";
import MCRootStatusDrawingBoardDragStatus from "./MCRootStatusDrawingBoardDragStatus.js";

class MCRootStatusDrawingBoardDragStatusTargeted extends MCRootStatusDrawingBoardDragStatus {

    onEnter (): void {
        this.relMachine.dragTargetStart.maskCurrStatus.onMaskEnable (this.relMachine.dragTargetHover);
        this.relMachine.dragTargetHover.maskCurrStatus.onMaskEnable (this.relMachine.dragTargetStart);
        MgrData.inst.callDataChange ();
    }

    onTargetEnterLeave (): void {
        this.relMachine.dragTargetStart.maskCurrStatus.onMaskDisable ();
        this.relMachine.dragTargetHover.maskCurrStatus.onMaskDisable ();
        this.relMachine.dragEnter (this.relMachine.dargStatusHover);
        MgrData.inst.callDataChange ();
    }

    onEnd (): void {
        this.relMachine.dragTargetStart.maskCurrStatus.onMaskDisable ();
        this.relMachine.dragTargetHover.maskCurrStatus.onMaskDisable ();
        this.relMachine.dragEnter (this.relMachine.dragStatusIdle);
        MgrData.inst.callDataChange ();
    }
}

export default MCRootStatusDrawingBoardDragStatusTargeted;
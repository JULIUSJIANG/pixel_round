import MCRootStatusDrawingBoardDragStatus from "./MCRootStatusDrawingBoardDragStatus.js";
class MCRootStatusDrawingBoardDragStatusHover extends MCRootStatusDrawingBoardDragStatus {
    onEnd() {
        this.relMachine.dragEnter(this.relMachine.dragStatusIdle);
    }
    onTargetEnter(dbImg) {
        // 忽略多余操作
        if (dbImg == this.relMachine.dragTargetStart) {
            return;
        }
        ;
        this.relMachine.dragTargetHover = dbImg;
        this.relMachine.dragEnter(this.relMachine.dragStatusTargeted);
    }
}
export default MCRootStatusDrawingBoardDragStatusHover;

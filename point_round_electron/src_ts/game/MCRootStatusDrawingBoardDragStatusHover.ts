import DBImg from "./DBImg.js";
import MCRootStatusDrawingBoardDragStatus from "./MCRootStatusDrawingBoardDragStatus.js";

class MCRootStatusDrawingBoardDragStatusHover extends MCRootStatusDrawingBoardDragStatus {

    onEnd (): void {
        this.relMachine.dragEnter (this.relMachine.dragStatusIdle);
    }

    onTargetEnter (dbImg: DBImg): void {
        // 忽略多余操作
        if (dbImg == this.relMachine.dragTargetStart) {
            return;
        };
        this.relMachine.dragTargetHover = dbImg;
        this.relMachine.dragEnter (this.relMachine.dragStatusTargeted);
    }
}

export default MCRootStatusDrawingBoardDragStatusHover;
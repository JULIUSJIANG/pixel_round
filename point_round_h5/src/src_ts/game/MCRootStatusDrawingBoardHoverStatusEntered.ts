import DomDrawingBoardRightPaintCanvas from "../ui/DomDrawingBoardRightPaintCanvas";
import MCRootStatusDrawingBoardHoverStatus from "./MCRootStatusDrawingBoardHoverStatus";

class MCRootStatusDrawingBoardHoverStatusEntered extends MCRootStatusDrawingBoardHoverStatus {

    onHoverExit (): void {
        this.relMachine.hoverEnter (this.relMachine.hoverStatusLeaved);
    }

    onOpUpdate (dataSrc: DomDrawingBoardRightPaintCanvas): void {
        this.relMachine.touchCurrStatus.onOpUpdate (dataSrc);
    }

    onFocusDraw (dataSrc: DomDrawingBoardRightPaintCanvas): void {
        this.relMachine.touchCurrStatus.onFocusDraw (dataSrc);
    }
}

export default MCRootStatusDrawingBoardHoverStatusEntered;
import JWebgl from "../common/JWebgl.js";
import JWebglColor from "../common/JWebglColor.js";
import DomDrawingBoardRightPaintCanvasSource from "../ui/DomDrawingBoardRightPaintCanvasSource.js";
import MCRootStatusDrawingBoardHoverStatus from "./MCRootStatusDrawingBoardHoverStatus.js";

class MCRootStatusDrawingBoardHoverStatusEntered extends MCRootStatusDrawingBoardHoverStatus {

    onHoverExit (): void {
        this.relMachine.hoverEnter (this.relMachine.hoverStatusLeaved);
    }

    onOpUpdate (dataSrc: DomDrawingBoardRightPaintCanvasSource): void {
        this.relMachine.touchCurrStatus.onOpUpdate (dataSrc);
    }

    onFocusDraw (dataSrc: DomDrawingBoardRightPaintCanvasSource): void {
        this.relMachine.touchCurrStatus.onFocusDraw (dataSrc);
    }
}

export default MCRootStatusDrawingBoardHoverStatusEntered;
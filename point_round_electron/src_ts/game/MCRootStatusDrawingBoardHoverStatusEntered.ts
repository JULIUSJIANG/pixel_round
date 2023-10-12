import JWebgl from "../common/JWebgl.js";
import JWebglColor from "../common/JWebglColor.js";
import MCRootStatusDrawingBoardHoverStatus from "./MCRootStatusDrawingBoardHoverStatus.js";

class MCRootStatusDrawingBoardHoverStatusEntered extends MCRootStatusDrawingBoardHoverStatus {

    onHoverExit (): void {
        this.relMachine.hoverEnter (this.relMachine.hoverStatusLeaved);
    }

    onFocusDraw (jWebgl: JWebgl, color: JWebglColor): void {
        this.relMachine.touchCurrStatus.onFocusDraw (jWebgl, color);
    }
}

export default MCRootStatusDrawingBoardHoverStatusEntered;
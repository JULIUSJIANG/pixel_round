import IndexGlobal from "../IndexGlobal.js";
class MCRootStatusDrawingBoardTouchPos {
    constructor(dataSrc) {
        this.dataSrc = dataSrc;
    }
    /**
     * 填充数据
     * @param canvasX
     * @param canvasY
     */
    fill(canvasX, canvasY) {
        this.canvasX = canvasX;
        this.canvasY = canvasY;
        this.gridXFloat = canvasX / IndexGlobal.PIXEL_TEX_TO_SCREEN;
        this.gridYFloat = canvasY / IndexGlobal.PIXEL_TEX_TO_SCREEN;
    }
}
export default MCRootStatusDrawingBoardTouchPos;

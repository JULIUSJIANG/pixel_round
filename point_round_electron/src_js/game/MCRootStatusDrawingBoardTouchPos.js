import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
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
        this.gridXFloat = canvasX / MgrData.inst.get(MgrDataItem.DB_PIXEL_TO_SCREEN_APPLICATION);
        this.gridYFloat = canvasY / MgrData.inst.get(MgrDataItem.DB_PIXEL_TO_SCREEN_APPLICATION);
        this.gridXInt = Math.floor(this.gridXFloat);
        this.gridYInt = Math.floor(this.gridYFloat);
    }
}
export default MCRootStatusDrawingBoardTouchPos;

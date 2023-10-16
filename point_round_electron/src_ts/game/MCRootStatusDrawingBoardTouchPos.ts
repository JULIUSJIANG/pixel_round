import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MCRootStatusDrawingBoard from "./MCRootStatusDrawingBoard.js";

class MCRootStatusDrawingBoardTouchPos {

    dataSrc: MCRootStatusDrawingBoard;

    constructor (dataSrc: MCRootStatusDrawingBoard) {
        this.dataSrc = dataSrc;
    }

    /**
     * 在画布中的位置 x
     */
    canvasX: number;
    /**
     * 在画布中的位置 y
     */
    canvasY: number;

    /**
     * 格子位置 x - 浮点
     */
    gridXFloat: number;
    /**
     * 格子位置 y - 浮点
     */
    gridYFloat: number;

    /**
     * 格子位置 x - 整型
     */
    gridXInt: number;
    /**
     * 格子位置 y - 整型
     */
    gridYInt: number;

    /**
     * 填充数据
     * @param canvasX 
     * @param canvasY 
     */
    fill (canvasX: number, canvasY: number) {
        this.canvasX = canvasX;
        this.canvasY = canvasY;

        this.gridXFloat = canvasX / MgrData.inst.get (MgrDataItem.DB_PIXEL_TO_SCREEN_APPLICATION);
        this.gridYFloat = canvasY / MgrData.inst.get (MgrDataItem.DB_PIXEL_TO_SCREEN_APPLICATION);

        this.gridXInt = Math.floor (this.gridXFloat);
        this.gridYInt = Math.floor (this.gridYFloat);
    }
}

export default MCRootStatusDrawingBoardTouchPos;
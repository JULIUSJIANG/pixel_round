import JWebglEnum from "../common/JWebglEnum";
import MgrData from "../mgr/MgrData";
import MgrDataItem from "../mgr/MgrDataItem";
import DomDrawingBoardRightPaintCanvas from "../ui/DomDrawingBoardRightPaintCanvas";
import MCRootStatusDrawingBoardOpStatus from "./MCRootStatusDrawingBoardOpStatus";

class MCRootStatusDrawingBoardOpStatusStraw extends MCRootStatusDrawingBoardOpStatus {

    arrUint8 = new Uint8Array (4);

    onUpdate (dataSrc: DomDrawingBoardRightPaintCanvas, x: number, y: number, w: number, h: number): void {
        dataSrc.jWebgl.useFbo (dataSrc.fboCache);
        dataSrc.jWebgl.canvasWebglCtx.readPixels (
            this.relMachine.touchPosMove.gridXInt,
            this.relMachine.touchPosMove.gridYInt,

            1,
            1,

            JWebglEnum.TexImage2DFormat.RGBA, 
            JWebglEnum.VertexAttriPointerType.UNSIGNED_BYTE,

            this.arrUint8
        );
        let colorHex = `${this.parseNumberToHex (this.arrUint8 [0])}${this.parseNumberToHex (this.arrUint8 [1])}${this.parseNumberToHex (this.arrUint8 [2])}${this.parseNumberToHex (this.arrUint8 [3])}`;
        MgrData.inst.set (MgrDataItem.DB_COLOR, colorHex);
    }

    parseNumberToHex (num: number) {
        let str = num.toString (16);
        if (str.length == 1) {
            return `0${str}`;
        };
        return str;
    }

    onFocusDraw (dataSrc: DomDrawingBoardRightPaintCanvas): void {
        let jWebgl = dataSrc.jWebgl;
        let color = dataSrc.colorMark;
        DomDrawingBoardRightPaintCanvas.drawCross (jWebgl, this.relMachine.touchCurrentPos.gridXInt, this.relMachine.touchCurrentPos.gridYInt, 1, 1, color);
        DomDrawingBoardRightPaintCanvas.drawMark (jWebgl, this.relMachine.touchCurrentPos.gridXInt, this.relMachine.touchCurrentPos.gridYInt, 1, 1, color);
    }
}

export default MCRootStatusDrawingBoardOpStatusStraw;
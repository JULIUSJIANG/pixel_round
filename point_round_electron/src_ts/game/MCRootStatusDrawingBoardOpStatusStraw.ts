import JWebglEnum from "../common/JWebglEnum.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import DomDrawingBoardRightPaintCanvas from "../ui/DomDrawingBoardRightPaintCanvas.js";
import MCRootStatusDrawingBoardOpStatus from "./MCRootStatusDrawingBoardOpStatus.js";

class MCRootStatusDrawingBoardOpStatusStraw extends MCRootStatusDrawingBoardOpStatus {

    arruint8 = new Uint8Array (4);

    onUpdate (dataSrc: DomDrawingBoardRightPaintCanvas, x: number, y: number, w: number, h: number): void {
        dataSrc.jWebgl.useFbo (dataSrc.fboCache);
        dataSrc.jWebgl.canvasWebglCtx.readPixels (
            this.relMachine.touchPosMove.gridXInt,
            this.relMachine.touchPosMove.gridYInt,

            1,
            1,

            JWebglEnum.TexImage2DFormat.RGBA, 
            JWebglEnum.VertexAttriPointerType.UNSIGNED_BYTE,

            this.arruint8
        );
        let colorHex = `${this.parseNumberToHex (this.arruint8 [0])}${this.parseNumberToHex (this.arruint8 [1])}${this.parseNumberToHex (this.arruint8 [2])}${this.parseNumberToHex (this.arruint8 [3])}`;
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
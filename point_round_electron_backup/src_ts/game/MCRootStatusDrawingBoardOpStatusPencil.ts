import JWebglMathVector4 from "../common/JWebglMathVector4.js";
import objectPool from "../common/ObjectPool.js";
import DomDrawingBoardRightPaintCanvas from "../ui/DomDrawingBoardRightPaintCanvas.js";
import MCRootStatusDrawingBoardOpStatus from "./MCRootStatusDrawingBoardOpStatus.js";

class MCRootStatusDrawingBoardOpStatusPencil extends MCRootStatusDrawingBoardOpStatus {

    onDo (dataSrc: DomDrawingBoardRightPaintCanvas, x: number, y: number, w: number, h: number): void {
        let currImg = this.relMachine.getCurrentCache ();
        let cameraWidth = currImg.dbImgData.width;
        let cameraHeight = currImg.dbImgData.height;
        dataSrc.jWebgl.useFbo (dataSrc.fboCache);
        dataSrc.jWebgl.mat4V.setLookAt (
            cameraWidth / 2, cameraHeight / 2, 1,
            cameraWidth / 2, cameraHeight / 2, 0,
            0, 1, 0
        );
        dataSrc.jWebgl.mat4P.setOrtho (
            - cameraWidth / 2, cameraWidth / 2,
            - cameraHeight / 2, cameraHeight / 2,
            0, 2
        );
        dataSrc.jWebgl.refreshMat4Mvp ();
        dataSrc.jWebgl.programImg.uMvp.fill (dataSrc.jWebgl.mat4Mvp);
        dataSrc.jWebgl.programImg.uTexture.fillByFbo (dataSrc.fboPure);
        let posImg = objectPool.pop (JWebglMathVector4.poolType);
        posImg.elements [0] = x + w / 2;
        posImg.elements [1] = y + h / 2;
        dataSrc.jWebgl.programImg.add (
            posImg,
            JWebglMathVector4.axisZStart,
            JWebglMathVector4.axisYEnd,
            w,
            h
        );
        dataSrc.jWebgl.programImg.draw ();
        objectPool.push (posImg);
        currImg.loadUrl (dataSrc.fboCache.toBase64 (), currImg.dbImgData.width, currImg.dbImgData.height);
    }

    onUpdate (dataSrc: DomDrawingBoardRightPaintCanvas, x: number, y: number, w: number, h: number): void {
        let currImg = this.relMachine.getCurrentCache ();
        let cameraWidth = currImg.dbImgData.width;
        let cameraHeight = currImg.dbImgData.height;
        dataSrc.jWebgl.useFbo (null);
        dataSrc.jWebgl.mat4V.setLookAt (
            cameraWidth / 2, cameraHeight / 2, 1,
            cameraWidth / 2, cameraHeight / 2, 0,
            0, 1, 0
        );
        dataSrc.jWebgl.mat4P.setOrtho (
            - cameraWidth / 2, cameraWidth / 2,
            - cameraHeight / 2, cameraHeight / 2,
            0, 2
        );
        dataSrc.jWebgl.refreshMat4Mvp ();
        dataSrc.jWebgl.programImg.uMvp.fill (dataSrc.jWebgl.mat4Mvp);
        dataSrc.jWebgl.programImg.uTexture.fillByFbo (dataSrc.fboPure);
        let posImg = objectPool.pop (JWebglMathVector4.poolType);
        posImg.elements [0] = x + w / 2;
        posImg.elements [1] = y + h / 2;
        dataSrc.jWebgl.programImg.add (
            posImg,
            JWebglMathVector4.axisZStart,
            JWebglMathVector4.axisYEnd,
            w,
            h
        );
        dataSrc.jWebgl.programImg.draw ();
        objectPool.push (posImg);
    }

    onFocusDraw (dataSrc: DomDrawingBoardRightPaintCanvas): void {
        let jWebgl = dataSrc.jWebgl;
        let color = dataSrc.colorMark;
        let x: number, y: number, w: number, h: number;
        x = Math.min (this.relMachine.touchPosStart.gridXInt, this.relMachine.touchPosMove.gridXInt);
        y = Math.min (this.relMachine.touchPosStart.gridYInt, this.relMachine.touchPosMove.gridYInt);
        w = Math.abs (this.relMachine.touchPosStart.gridXInt - this.relMachine.touchPosMove.gridXInt) + 1;
        h = Math.abs (this.relMachine.touchPosStart.gridYInt - this.relMachine.touchPosMove.gridYInt) + 1;
        DomDrawingBoardRightPaintCanvas.drawMark (jWebgl, x, y, w, h, color);
    }
}

export default MCRootStatusDrawingBoardOpStatusPencil;
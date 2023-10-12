import JWebglEnum from "../common/JWebglEnum.js";
import JWebglMathVector4 from "../common/JWebglMathVector4.js";
import objectPool from "../common/ObjectPool.js";
import MgrGlobal from "../mgr/MgrGlobal.js";
import DomDrawingBoardRightPaintCanvasSource from "../ui/DomDrawingBoardRightPaintCanvasSource.js";
import MCRootStatusDrawingBoardOpStatus from "./MCRootStatusDrawingBoardOpStatus.js";

class MCRootStatusDrawingBoardOpStatusPencil extends MCRootStatusDrawingBoardOpStatus {

    onDo (dataSrc: DomDrawingBoardRightPaintCanvasSource, x: number, y: number, w: number, h: number): void {
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

        dataSrc.jWebgl.fillFboByTexRev (dataSrc.fboCacheRevY, dataSrc.fboCache.renderTexture);
        dataSrc.fboCacheRevY.cacheToArrUint8 ();
        currImg.loadUrl (MgrGlobal.inst.arrUint8ToBase64 (dataSrc.fboCacheRevY.arrUint8, dataSrc.fboCacheRevY.width, dataSrc.fboCacheRevY.height));
    }

    onUpdate (dataSrc: DomDrawingBoardRightPaintCanvasSource, x: number, y: number, w: number, h: number): void {
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
}

export default MCRootStatusDrawingBoardOpStatusPencil;
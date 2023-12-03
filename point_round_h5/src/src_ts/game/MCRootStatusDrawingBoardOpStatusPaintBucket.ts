import IndexGlobal from "../IndexGlobal";
import JWebglColor from "../common/JWebglColor";
import JWebglEnum from "../common/JWebglEnum";
import JWebglMathVector4 from "../common/JWebglMathVector4";
import objectPool from "../common/ObjectPool";
import DomDrawingBoardRightPaintCanvas from "../ui/DomDrawingBoardRightPaintCanvas";
import MCRootStatusDrawingBoardOpStatus from "./MCRootStatusDrawingBoardOpStatus";

class MCRootStatusDrawingBoardOpStatusPaintBucket extends MCRootStatusDrawingBoardOpStatus {

    arrUint8: Uint8Array;

    setInFected = new Set <number> ();

    onUpdate (dataSrc: DomDrawingBoardRightPaintCanvas, x: number, y: number, w: number, h: number): void {
        let currImg = IndexGlobal.inst.dbCurrent();
        let locX = this.relMachine.touchCurrentPos.gridXInt;
        let locY = this.relMachine.touchCurrentPos.gridYInt;

        // 提取数据
        dataSrc.jWebgl.useFbo (dataSrc.fboCache);
        let arrUint8Len = currImg.dbImgData.width * currImg.dbImgData.height * 4;
        if (this.arrUint8 == null || this.arrUint8.length != arrUint8Len) {
            this.arrUint8 = new Uint8Array (arrUint8Len);
        };
        dataSrc.jWebgl.canvasWebglCtx.readPixels (
            0, 0,

            currImg.dbImgData.width, 
            currImg.dbImgData.height,

            JWebglEnum.TexImage2DFormat.RGBA, 
            JWebglEnum.VertexAttriPointerType.UNSIGNED_BYTE,

            this.arrUint8
        );

        // 对数据进行污染
        this.setInFected.clear ();
        let inFectIdx = (locY * currImg.dbImgData.width + locX) * 4;
        let colorR = this.arrUint8 [inFectIdx + 0];
        let colorG = this.arrUint8 [inFectIdx + 1];
        let colorB = this.arrUint8 [inFectIdx + 2];
        let colorA = this.arrUint8 [inFectIdx + 3];
        this.inFect (locX, locY, colorR, colorG, colorB, colorA, dataSrc.colorMark);

        // 把数据绘制到画布
        dataSrc.jWebgl.fillFboByUint8Arr (null, this.arrUint8, currImg.dbImgData.width, currImg.dbImgData.height);
    }

    onDo (dataSrc: DomDrawingBoardRightPaintCanvas, x: number, y: number, w: number, h: number): void {
        let currImg = IndexGlobal.inst.dbCurrent();
        let locX = this.relMachine.touchCurrentPos.gridXInt;
        let locY = this.relMachine.touchCurrentPos.gridYInt;

        // 提取数据
        dataSrc.jWebgl.useFbo (dataSrc.fboCache);
        let arrUint8Len = currImg.dbImgData.width * currImg.dbImgData.height * 4;
        if (this.arrUint8 == null || this.arrUint8.length != arrUint8Len) {
            this.arrUint8 = new Uint8Array (arrUint8Len);
        };
        dataSrc.jWebgl.canvasWebglCtx.readPixels (
            0, 0,

            currImg.dbImgData.width, 
            currImg.dbImgData.height,

            JWebglEnum.TexImage2DFormat.RGBA, 
            JWebglEnum.VertexAttriPointerType.UNSIGNED_BYTE,

            this.arrUint8
        );

        // 对数据进行污染
        this.setInFected.clear ();
        let inFectIdx = (locY * currImg.dbImgData.width + locX) * 4;
        let colorR = this.arrUint8 [inFectIdx + 0];
        let colorG = this.arrUint8 [inFectIdx + 1];
        let colorB = this.arrUint8 [inFectIdx + 2];
        let colorA = this.arrUint8 [inFectIdx + 3];
        this.inFect (locX, locY, colorR, colorG, colorB, colorA, dataSrc.colorMark);

        // 把数据绘制到缓冲区
        dataSrc.jWebgl.fillFboByUint8Arr (dataSrc.fboCache, this.arrUint8, currImg.dbImgData.width, currImg.dbImgData.height);
        dataSrc.fboCache.cacheToUint8 ();
        currImg.statusPush (dataSrc.fboCache.arrUint8, currImg.statusCurrent ().width, currImg.statusCurrent ().height);
    }

    inFect (x: number, y: number, matchR: number, matchG: number, matchB: number, matchA: number, color: JWebglColor) {
        let dataSrc = IndexGlobal.inst.dbCurrent();

        // 忽略越界位置
        if (
               x < 0
            || y < 0
            || dataSrc.dbImgData.width <= x
            || dataSrc.dbImgData.height <= y
        ) 
        {
            return;
        };

        let idx = y * dataSrc.dbImgData.width + x;
        // 该位置已被处理过，那么忽略
        if (this.setInFected.has (idx)) {
            return;
        };
        // 标记为已处理
        this.setInFected.add (idx);

        let colorR = this.arrUint8 [idx * 4 + 0];
        let colorG = this.arrUint8 [idx * 4 + 1];
        let colorB = this.arrUint8 [idx * 4 + 2];
        let colorA = this.arrUint8 [idx * 4 + 3];

        // 颜色不一致，不进行传染
        if (
               colorR != matchR
            || colorG != matchG
            || colorB != matchB
            || colorA != matchA
        ) 
        {
            return;
        };

        // 更改颜色
        this.arrUint8 [idx * 4 + 0] = color.data255 [0];
        this.arrUint8 [idx * 4 + 1] = color.data255 [1];
        this.arrUint8 [idx * 4 + 2] = color.data255 [2];
        this.arrUint8 [idx * 4 + 3] = color.data255 [3];

        // 向四面相邻位置传染
        this.inFect (x + 1, y, matchR, matchG, matchB, matchA, color);
        this.inFect (x - 1, y, matchR, matchG, matchB, matchA, color);
        this.inFect (x, y + 1, matchR, matchG, matchB, matchA, color);
        this.inFect (x, y - 1, matchR, matchG, matchB, matchA, color);
    }

    onFocusDraw (dataSrc: DomDrawingBoardRightPaintCanvas): void {
        let jWebgl = dataSrc.jWebgl;
        let color = dataSrc.colorMark;
        DomDrawingBoardRightPaintCanvas.drawCross (jWebgl, this.relMachine.touchCurrentPos.gridXInt, this.relMachine.touchCurrentPos.gridYInt, 1, 1, color);
        DomDrawingBoardRightPaintCanvas.drawMark (jWebgl, this.relMachine.touchCurrentPos.gridXInt, this.relMachine.touchCurrentPos.gridYInt, 1, 1, color);
    }
}

export default MCRootStatusDrawingBoardOpStatusPaintBucket;
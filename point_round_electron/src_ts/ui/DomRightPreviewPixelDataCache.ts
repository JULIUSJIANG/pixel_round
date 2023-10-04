import IndexGlobal from "../IndexGlobal.js";
import NodeModules from "../NodeModules.js";
import JWebgl from "../common/JWebgl.js";
import JWebglEnum from "../common/JWebglEnum.js";
import JWebglFrameBuffer from "../common/JWebglFrameBuffer.js";
import objectPool from "../common/ObjectPool.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import CornerTypeRSBoth from "../game/CornerTypeRSBoth.js";
import TextureColor from "../game/TextureColor.js";
import TextureGroup from "../game/TextureGroup.js";
import TexturePixel from "../game/TexturePixel.js";
import MgrData from "../mgr/MgrData.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";

class DomRightPreviewPixelDataCache extends ReactComponentExtend <number> {
    /**
     * 3d canvas 引用器
     */
    canvasWebglRef = NodeModules.react.createRef();

    /**
     * 用于绘图的上下文
     */
    jWebgl: JWebgl;

    reactComponentExtendOnInit(): void {
        this.jWebgl = new JWebgl(this.canvasWebglRef.current);
        this.jWebgl.init();
    }

    /**
     * 帧缓冲区
     */
    fbo: JWebglFrameBuffer;

    /**
     * 用于颜色去重
     */
    private _setColor = new Set <number> ();
    /**
     * 用于处理颜色的键
     */
    private _listKey = new Array <string> ();

    reactComponentExtendOnDraw(): void {
        let dataSrc = IndexGlobal.inst.detailMachine.statusPreview;
        let imgMachine = dataSrc.imgMachine;
        // 只有加载完毕等待缓存的时候才进行下述的缓存内容
        if (imgMachine.currStatus != imgMachine.statusLoaded) {
            return;
        };
        
        // 绘制 fbo
        if (this.fbo == null || this.fbo.width != dataSrc.imgWidthPaddingScaled || this.fbo.height != dataSrc.imgHeightPaddingScaled) {
            this.fbo = this.jWebgl.getFbo (dataSrc.imgWidthPaddingScaled, dataSrc.imgHeightPaddingScaled);
        };
        
        // 得到简略图
        dataSrc.drawImgPadding (this.jWebgl, this.fbo);
        // 把 fbo 绘制到屏幕
        this.jWebgl.fillFbo (null, this.fbo);

        // 回收颜色对象
        for (let i = 0; i < dataSrc.listColor.length; i++) {
            let listColorI = dataSrc.listColor [i];
            objectPool.push (listColorI);
        };
        dataSrc.listColor.length = 0;

        // 回收分块记录
        for (let i = 0; i < dataSrc.listTextureGroup.length; i++) {
            let listImgPixelGroupAllI = dataSrc.listTextureGroup [i];
            objectPool.push (listImgPixelGroupAllI);
        };
        dataSrc.listTextureGroup.length = 0;

        // 回收像素对象
        for (let i = 0; i < dataSrc.listXYToTexturePixel.length; i++) {
            let listXYToTexturePixelI = dataSrc.listXYToTexturePixel [i];
            objectPool.push (listXYToTexturePixelI);
        };
        dataSrc.listXYToTexturePixel.length = 0;

        dataSrc.binXYToRgbaSize = dataSrc.imgWidthPaddingScaled * dataSrc.imgHeightPaddingScaled * 4;
        let binRgbaLength = dataSrc.binXYToRgba.length;
        // 尺寸不够，扩容
        if (binRgbaLength < dataSrc.binXYToRgbaSize) {
            while (binRgbaLength < dataSrc.binXYToRgbaSize) {
                binRgbaLength *= 2;
            };
            dataSrc.binXYToRgba = new Uint8Array (binRgbaLength);
        };
        this.jWebgl.canvasWebglCtx.readPixels (0, 0, dataSrc.imgWidthPaddingScaled, dataSrc.imgHeightPaddingScaled, JWebglEnum.TexImage2DFormat.RGBA, JWebglEnum.VertexAttriPointerType.UNSIGNED_BYTE, dataSrc.binXYToRgba);

        dataSrc.binXYToColorSize = dataSrc.imgWidthPaddingScaled * dataSrc.imgHeightPaddingScaled;
        let binColorLength = dataSrc.binXYToColor.length;
        // 尺寸不够，扩容
        if (binColorLength < dataSrc.binXYToColorSize) {
            while (binColorLength < dataSrc.binXYToColorSize) {
                binColorLength *= 2;
            };
            dataSrc.binXYToColor = new Uint32Array (binColorLength);
        };

        // 合并颜色值到一个数上面去
        for (let i = 0; i < dataSrc.binXYToColorSize; i++) {
            dataSrc.binXYToColor [i] = 0;
            for (let j = 0; j < 4; j++) {
                dataSrc.binXYToColor [i] <<= 8;
                dataSrc.binXYToColor [i] += dataSrc.binXYToRgba [i * 4 + j];
            };
        };

        // 颜色去重，保留下来的颜色都各不一样
        this._setColor.clear ();
        for (let i = 0; i < dataSrc.binXYToColorSize; i++) {
            let binColorI = dataSrc.binXYToColor [i];
            this._setColor.add (binColorI);
        };

        // 初始化颜色表对象
        if (!this._setColor.has (0)) {
            this._setColor.add (0);
        };
        this._setColor.forEach ((color) => {
            let colorBackup = color;
            let colorA = color % 256;
            color >>= 8;
            let colorB = color % 256;
            color >>= 8;
            let colorG = color % 256;
            color >>= 8;
            let colorR = color % 256;
            color >>= 8;

            let colorInst = objectPool.pop (TextureColor.poolType);
            colorInst.init (colorBackup, 0, colorR / 255, colorG / 255, colorB / 255, colorA / 255);
            dataSrc.listColor.push (colorInst);
        });

        // 更新序号
        dataSrc.listColor.sort ((a, b) => {
            return a.id - b.id;
        });
        for (let i = 0; i < dataSrc.listColor.length; i++) {
            let listColorI = dataSrc.listColor [i];
            listColorI.idx = i;
        };

        // 还没有颜色表的话，创建一个
        if (dataSrc.imgMachine.dataInst.colorTable == null) {
            dataSrc.imgMachine.dataInst.colorTable = {};
        };

        // 剔除所有不存在的颜色记录
        this.deleteUnExistColorKey (dataSrc.imgMachine.dataInst.colorTable);
        for (let key in dataSrc.imgMachine.dataInst.colorTable) {
            this.deleteUnExistColorKey (dataSrc.imgMachine.dataInst.colorTable [key]);
        };

        // 确保所有颜色记录存在
        for (let i = 0; i < dataSrc.listColor.length - 1; i++) {
            let listColorI = dataSrc.listColor [i];
            if (dataSrc.imgMachine.dataInst.colorTable [`${listColorI.id}`] == null) {
                dataSrc.imgMachine.dataInst.colorTable [`${listColorI.id}`] = {};
            };
            for (let j = i + 1; j < dataSrc.listColor.length; j++) {
                let listColorJ = dataSrc.listColor [j];
                if (dataSrc.imgMachine.dataInst.colorTable [`${listColorI.id}`] [`${listColorJ.id}`] == null) {
                    dataSrc.imgMachine.dataInst.colorTable [`${listColorI.id}`] [`${listColorJ.id}`] = true;
                };
            };
        };

        // 更新索引
        dataSrc.mapIdToColor.clear ();
        for (let i = 0; i < dataSrc.listColor.length; i++) {
            let listColorI = dataSrc.listColor [i];
            dataSrc.mapIdToColor.set (listColorI.id, listColorI);
        };

        // 更新分块
        dataSrc.listXYToTextureGroup.length = dataSrc.binXYToColorSize;
        dataSrc.listXYToTextureGroup.fill (null);
        for (let x = 0; x < dataSrc.imgWidthPaddingScaled; x++) {
            for (let y = 0; y < dataSrc.imgHeightPaddingScaled; y++) {
                // 索引
                let idx = y * dataSrc.imgWidthPaddingScaled + x;
                // 当前组
                let currentGroup = dataSrc.listXYToTextureGroup [idx];
                // 已有当前组，忽略
                if (currentGroup != null) {
                    continue;
                };
                // 为该块创建颜色组，并且开始蔓延
                let color = dataSrc.binXYToColor [idx];
                currentGroup = TextureGroup.create (color);
                dataSrc.listTextureGroup.push (currentGroup);
                this.paintBucket (x, y, currentGroup);
            };
        };

        // 分块数据的缓存
        for (let x = 0; x < dataSrc.imgWidthPaddingScaled; x++) {
            for (let y = 0; y < dataSrc.imgHeightPaddingScaled; y++) {
                // 索引
                let idx = y * dataSrc.imgWidthPaddingScaled + x;
                // 当前组
                let currentGroup = dataSrc.listXYToTextureGroup [idx];
                currentGroup.addPos (x, y);
            };
        };
        for (let i = 0; i < dataSrc.listTextureGroup.length; i++) {
            let listImgPixelGroupAllI = dataSrc.listTextureGroup [i];
            listImgPixelGroupAllI.cache ();
        };
        dataSrc.listTextureGroup.sort ((a, b) => {
            return a.areaVolume - b.areaVolume;
        });
        dataSrc.listTextureGroupNotEmpty.length = 0;
        for (let i = 0; i < dataSrc.listTextureGroup.length; i++) {
            let listImgPixelGroupAllI = dataSrc.listTextureGroup [i];
            if (listImgPixelGroupAllI.colorObj.data255 [3] == 0) {
                continue;
            };
            dataSrc.listTextureGroupNotEmpty.push (listImgPixelGroupAllI);
        };

        // 填充像素记录
        dataSrc.listXYToTexturePixel.length = dataSrc.binXYToColorSize;
        dataSrc.listXYToTexturePixel.fill (null);
        for (let x = 0; x < dataSrc.imgWidthPaddingScaled; x++) {
            for (let y = 0; y < dataSrc.imgHeightPaddingScaled; y++) {
                // 索引
                let idx = y * dataSrc.imgWidthPaddingScaled + x;
                // 像素记录
                let texturePixel = TexturePixel.create (dataSrc, x, y);
                dataSrc.listXYToTexturePixel [idx] = texturePixel;
            };
        };
        // 告知简略图已经绘制完毕
        dataSrc.imgMachine.currStatus.onCached ();
    }

    private _analyseListOffset = [-1, 0, 1];

    /**
     * 进行油漆桶解析
     * @param x 油漆桶位置 x
     * @param y 油漆桶位置 y
     * @param colorTarget 油漆桶蔓延的目标颜色
     * @returns 
     */
    paintBucket (x: number, y: number, colorGroup: TextureGroup) {
        let dataSrc = IndexGlobal.inst.detailMachine.statusPreview;
        // x 越界，忽略
        if (x < 0 || dataSrc.imgWidthPaddingScaled <= x) {
            return;
        };
        // y 越界，忽略
        if (y < 0 || dataSrc.imgHeightPaddingScaled <= y) {
            return;
        };
        // 内存索引
        let idx = y * dataSrc.imgWidthPaddingScaled + x;
        // 已被其他油漆桶蔓延
        if (dataSrc.listXYToTextureGroup [idx] != null) {
            return;
        };
        // 该位置的颜色不对的话，忽略
        let color = dataSrc.binXYToColor [y * dataSrc.imgWidthPaddingScaled + x];
        if (color != colorGroup.colorId) {
            return;
        };
        // 否则进行组标记
        dataSrc.listXYToTextureGroup [idx] = colorGroup;
        // 尝试对临近的 9 格进行蔓延
        for (let i = 0; i < this._analyseListOffset.length; i++) {
            let analyseListOffsetI = this._analyseListOffset [i];
            for (let j = 0; j < this._analyseListOffset.length; j++) {
                let analyseListOffsetJ = this._analyseListOffset [j];
                this.paintBucket (x + analyseListOffsetI, y + analyseListOffsetJ, colorGroup);
            };
        };
    }

    /**
     * 删除已不存在的颜色记录
     * @param obj 
     */
    deleteUnExistColorKey (obj: Object) {
        // 归纳键
        this._listKey.length = 0;
        for (let key in obj) {
            this._listKey.push (key);
        };
        // 删除所有已经不存在的颜色记录
        for (let i = 0; i < this._listKey.length; i++) {
            let listKeyI = this._listKey [i];
            let listKeyIInt = Number.parseInt (listKeyI);
            if (!this._setColor.has (listKeyIInt)) {
                delete obj [listKeyI];
            };
        };
    }

    render (): ReactComponentExtendInstance {
        let dataSrc = IndexGlobal.inst.detailMachine.statusPreview;
        return ReactComponentExtend.instantiateTag (
            MgrDomDefine.TAG_DIV,
            {
                style: {
                    [MgrDomDefine.STYLE_HEIGHT]: MgrDomDefine.STYLE_WIDTH_PERCENTAGE_0,
                    [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                    [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                    [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                    [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.CONFIG_TXT_BG_COLOR,

                    [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN,
                    [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_NONE,
                }
            },

            // 滚动视图的遮罩
            ReactComponentExtend.instantiateTag (
                MgrDomDefine.TAG_DIV,
                {
                    style: {
                        [MgrDomDefine.STYLE_HEIGHT]: MgrDomDefine.STYLE_HEIGHT_PERCENTAGE_0,
                        [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                        [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                        [MgrDomDefine.STYLE_PADDING_RIGHT]: MgrDomDefine.CONFIG_TXT_SPACING,
                        [MgrDomDefine.STYLE_PADDING_BOTTOM]: MgrDomDefine.CONFIG_TXT_SPACING,

                        [MgrDomDefine.STYLE_OVERFLOW_X]: MgrDomDefine.STYLE_OVERFLOW_X_SCROLL,
                        [MgrDomDefine.STYLE_OVERFLOW_Y]: MgrDomDefine.STYLE_OVERFLOW_Y_SCROLL
                    }
                },

                // 滚动的列表
                ReactComponentExtend.instantiateTag (
                    MgrDomDefine.TAG_DIV,
                    {
                        style: {
                            [MgrDomDefine.STYLE_WIDTH]: `${dataSrc.imgWidthPaddingScaled}px`,
                            [MgrDomDefine.STYLE_HEIGHT]: `${dataSrc.imgHeightPaddingScaled}px`,
                            [MgrDomDefine.STYLE_FLEX_GROW]: 0,
                        }
                    },
                
                    ReactComponentExtend.instantiateTag (
                        MgrDomDefine.TAG_DIV,
                        {
                            style: {
                                [MgrDomDefine.STYLE_WIDTH]: 0,
                                [MgrDomDefine.STYLE_HEIGHT]: 0,
                                [MgrDomDefine.STYLE_POSITION]: MgrDomDefine.STYLE_POSITION_RELATIVE,
                                [MgrDomDefine.STYLE_LEFT]: 0,
                                [MgrDomDefine.STYLE_TOP]: 0,
                            }
                        },
                    
                        ReactComponentExtend.instantiateTag (
                            MgrDomDefine.TAG_CANVAS,
                            {
                                ref: this.canvasWebglRef,
                                width: dataSrc.imgWidthPaddingScaled,
                                height: dataSrc.imgHeightPaddingScaled,
                                style: {
                                    [MgrDomDefine.STYLE_WIDTH]: `${dataSrc.imgWidthPaddingScaled}px`,
                                    [MgrDomDefine.STYLE_HEIGHT]: `${dataSrc.imgHeightPaddingScaled}px`,
                                    [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_BLOCK
                                }
                            }
                        )
                    )
                )
            ),
        );
    }
}

export default DomRightPreviewPixelDataCache;
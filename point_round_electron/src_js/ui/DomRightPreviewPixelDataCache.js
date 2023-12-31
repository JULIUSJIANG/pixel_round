import IndexGlobal from "../IndexGlobal.js";
import NodeModules from "../NodeModules.js";
import JWebgl from "../common/JWebgl.js";
import JWebglEnum from "../common/JWebglEnum.js";
import objectPool from "../common/ObjectPool.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import TextureColor from "../game/TextureColor.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
class DomRightPreviewPixelDataCache extends ReactComponentExtend {
    constructor() {
        super(...arguments);
        /**
         * 3d canvas 引用器
         */
        this.canvasWebglRef = NodeModules.react.createRef();
        /**
         * 用于颜色去重
         */
        this._setColor = new Set();
        /**
         * 用于处理颜色的键
         */
        this._listKey = new Array();
    }
    reactComponentExtendOnInit() {
        this.jWebgl = new JWebgl(this.canvasWebglRef.current);
        this.jWebgl.init();
    }
    reactComponentExtendOnDraw() {
        let dataSrc = IndexGlobal.inst.detailMachine.statusPreview;
        let imgMachine = dataSrc.imgMachine;
        // 只有加载完毕等待缓存的时候才进行下述的缓存内容
        if (imgMachine.currStatus != imgMachine.statusLoaded) {
            return;
        }
        ;
        // 绘制 fbo
        if (this.fbo == null || this.fbo.width != dataSrc.textureWidth || this.fbo.height != dataSrc.textureHeight) {
            this.fbo = this.jWebgl.getFbo(dataSrc.textureWidth, dataSrc.textureHeight);
        }
        ;
        // 得到简略图
        dataSrc.drawImgPadding(this.jWebgl, this.fbo);
        // 把 fbo 绘制到屏幕
        this.jWebgl.fillFbo(null, this.fbo);
        // 回收颜色对象
        for (let i = 0; i < dataSrc.listColor.length; i++) {
            let listColorI = dataSrc.listColor[i];
            objectPool.push(listColorI);
        }
        ;
        dataSrc.listColor.length = 0;
        dataSrc.binXYToRgbaUintSize = dataSrc.textureWidth * dataSrc.textureHeight * 4;
        let binRgbaLength = dataSrc.binXYToRgbaUint.length;
        // 尺寸不够，扩容
        if (binRgbaLength < dataSrc.binXYToRgbaUintSize) {
            while (binRgbaLength < dataSrc.binXYToRgbaUintSize) {
                binRgbaLength *= 2;
            }
            ;
            dataSrc.binXYToRgbaUint = new Uint8Array(binRgbaLength);
        }
        ;
        this.jWebgl.canvasWebglCtx.readPixels(0, 0, dataSrc.textureWidth, dataSrc.textureHeight, JWebglEnum.TexImage2DFormat.RGBA, JWebglEnum.VertexAttriPointerType.UNSIGNED_BYTE, dataSrc.binXYToRgbaUint);
        dataSrc.binXYToColorUintSize = dataSrc.textureWidth * dataSrc.textureHeight;
        let binColorLength = dataSrc.binXYToColorUint.length;
        // 尺寸不够，扩容
        if (binColorLength < dataSrc.binXYToColorUintSize) {
            while (binColorLength < dataSrc.binXYToColorUintSize) {
                binColorLength *= 2;
            }
            ;
            dataSrc.binXYToColorUint = new Uint32Array(binColorLength);
        }
        ;
        // 合并颜色值到一个数上面去
        for (let i = 0; i < dataSrc.binXYToColorUintSize; i++) {
            dataSrc.binXYToColorUint[i] = 0;
            for (let j = 0; j < 4; j++) {
                dataSrc.binXYToColorUint[i] <<= 8;
                dataSrc.binXYToColorUint[i] += dataSrc.binXYToRgbaUint[i * 4 + j];
            }
            ;
        }
        ;
        // 颜色去重，保留下来的颜色都各不一样
        this._setColor.clear();
        for (let i = 0; i < dataSrc.binXYToColorUintSize; i++) {
            let binColorI = dataSrc.binXYToColorUint[i];
            this._setColor.add(binColorI);
        }
        ;
        // 初始化颜色表对象
        if (!this._setColor.has(0)) {
            this._setColor.add(0);
        }
        ;
        this._setColor.forEach((color) => {
            let colorBackup = color;
            let colorA = color % 256;
            color >>= 8;
            let colorB = color % 256;
            color >>= 8;
            let colorG = color % 256;
            color >>= 8;
            let colorR = color % 256;
            color >>= 8;
            let colorInst = objectPool.pop(TextureColor.poolType);
            colorInst.init(colorBackup, 0, colorR / 255, colorG / 255, colorB / 255, colorA / 255);
            dataSrc.listColor.push(colorInst);
        });
        // 更新序号
        dataSrc.listColor.sort((a, b) => {
            return a.id - b.id;
        });
        for (let i = 0; i < dataSrc.listColor.length; i++) {
            let listColorI = dataSrc.listColor[i];
            listColorI.idx = i;
        }
        ;
        // 更新索引
        dataSrc.mapIdToColor.clear();
        for (let i = 0; i < dataSrc.listColor.length; i++) {
            let listColorI = dataSrc.listColor[i];
            dataSrc.mapIdToColor.set(listColorI.id, listColorI);
        }
        ;
        // 告知简略图已经绘制完毕
        dataSrc.imgMachine.currStatus.onCached();
    }
    render() {
        let dataSrc = IndexGlobal.inst.detailMachine.statusPreview;
        return ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
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
        ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
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
        ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_WIDTH]: `${dataSrc.textureWidth}px`,
                [MgrDomDefine.STYLE_HEIGHT]: `${dataSrc.textureHeight}px`,
                [MgrDomDefine.STYLE_FLEX_GROW]: 0,
            }
        }, ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_WIDTH]: 0,
                [MgrDomDefine.STYLE_HEIGHT]: 0,
                [MgrDomDefine.STYLE_POSITION]: MgrDomDefine.STYLE_POSITION_RELATIVE,
                [MgrDomDefine.STYLE_LEFT]: 0,
                [MgrDomDefine.STYLE_TOP]: 0,
            }
        }, ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_CANVAS, {
            ref: this.canvasWebglRef,
            width: dataSrc.textureWidth,
            height: dataSrc.textureHeight,
            style: {
                [MgrDomDefine.STYLE_WIDTH]: `${dataSrc.textureWidth}px`,
                [MgrDomDefine.STYLE_HEIGHT]: `${dataSrc.textureHeight}px`,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_BLOCK
            }
        })))));
    }
}
export default DomRightPreviewPixelDataCache;

import DataUint32Array from "../common/DataUint32Array";
import DataUint8Array from "../common/DataUint8Array";
import objectPool from "../common/ObjectPool";
import MgrDataItem from "../mgr/MgrDataItem";
import MgrGlobal from "../mgr/MgrGlobal";
import MgrResAssetsImage from "../mgr/MgrResAssetsImage";
import DomImageSmooth from "../ui/DomImageSmooth";
import ColorRecord from "./ColorRecord";
import ExpImgMaskStatus from "./ExpImgMaskStatus";
import ExpImgMaskStatusActive from "./ExpImgMaskStatusActive";
import ExpImgMaskStatusIdle from "./ExpImgMaskStatusIdle";
import ExpImgUint8Status from "./ExpImgUint8Status";
import ExpImgUint8StatusDestroy from "./ExpImgUint8StatusDestroy";
import ExpImgUint8StatusIdle from "./ExpImgUint8StatusIdle";
import ExpImgUint8StatusLoaded from "./ExpImgUint8StatusLoaded";
import ExpImgUint8StatusLoading from "./ExpImgUint8StatusLoading";

/**
 * 实验数据的缓存
 */
class ExpImg {

    /**
     * 标识
     */
    expImgData: MgrDataItem.ExpImgData;

    constructor (expImgData: MgrDataItem.ExpImgData) {
        this.expImgData = expImgData;

        this.maskStatusIdle = new ExpImgMaskStatusIdle (this);
        this.maskStatusActive = new ExpImgMaskStatusActive (this);
        this.maskEnter (this.maskStatusIdle);

        this.uint8StatusIdle = new ExpImgUint8StatusIdle (this);
        this.uint8StatusLoading = new ExpImgUint8StatusLoading (this);
        this.uint8StatusLoaded = new ExpImgUint8StatusLoaded (this);
        this.uint8StatusDestroy = new ExpImgUint8StatusDestroy (this);
        this.uint8Enter (this.uint8StatusIdle);
    }

    /**
     * 面具
     */
    mask: ExpImg;

    /**
     * 状态 - 待机
     */
    maskStatusIdle: ExpImgMaskStatusIdle;
    /**
     * 状态 - 面具已激活
     */
    maskStatusActive: ExpImgMaskStatusActive;

    /**
     * 面具 - 当前状态
     */
    maskCurrStatus: ExpImgMaskStatus;

    /**
     * 切换状态
     * @param status 
     */
    maskEnter (status: ExpImgMaskStatus) {
        let rec = this.maskCurrStatus;
        this.maskCurrStatus = status;
        if (rec) {
            rec.onExit ();
        };
        this.maskCurrStatus.onEnter ();
    }

    /**
     * 字节数据
     */
    uint8Bin = new DataUint8Array ();

    /**
     * 平滑所需要的参数
     */
    uint8ArgsSmooth = new DomImageSmooth.Args ();

    /**
     * 用于加载的 image
     */
    uint8Img: MgrResAssetsImage;

    /**
     * 流 - 待机
     */
    uint8StatusIdle: ExpImgUint8StatusIdle;
    /**
     * 流 - 加载中
     */
    uint8StatusLoading: ExpImgUint8StatusLoading;
    /**
     * 流 - 加载完毕
     */
    uint8StatusLoaded: ExpImgUint8StatusLoaded;
    /**
     * 流 - 销毁
     */
    uint8StatusDestroy: ExpImgUint8StatusDestroy;

    /**
     * 流 - 当前状态
     */
    uint8CurrStatus: ExpImgUint8Status;

    /**
     * 流 - 切换状态
     * @param status 
     */
    uint8Enter (status: ExpImgUint8Status) {
        let rec = this.uint8CurrStatus;
        this.uint8CurrStatus = status;
        if (rec) {
            rec.onExit ();
        };
        this.uint8CurrStatus.onEnter ();
    }

    /**
     * 销毁
     */
    destroy () {
        this.uint8CurrStatus.onDestroy ();
    }

    /**
     * 缩略图的二进制数据，按照 r、g、b、a 排列
     */
    cMiniBinRGBA = new DataUint8Array ();
    /**
     * 缩略图的二进制数据，每个数字代表 rgba
     */
    cMiniBinColor = new DataUint32Array ();

    /**
     * 用于去重
     */
    cSetColor = new Set <number> ();
    /**
     * 颜色记录
     */
    cListColorRecord = new Array <ColorRecord> ();
    /**
     * 标识到颜色记录的映射
     */
    cMapIdToColorRecord = new Map <number, ColorRecord> ();

    /**
     * 宽度
     */
    cWidthShowAll: number;
    /**
     * 高度
     */
    cHeightShowAll: number;

    /**
     * 缓存数据
     */
    cCache () {
        // 清除旧的缓存
        this.cSetColor.clear ();
        for (let i = 0; i < this.cListColorRecord.length; i++) {
            let listColorRecordI = this.cListColorRecord [i];
            objectPool.push (listColorRecordI);
        };
        this.cListColorRecord.length = 0;
        this.cMapIdToColorRecord.clear ();

        this.uint8ArgsSmooth.init (
            this.uint8Bin.bin,

            this.expImgData.width,
            this.expImgData.height,

            this.expImgData.paddingTop,
            this.expImgData.paddingRight,
            this.expImgData.paddingBottom,
            this.expImgData.paddingLeft,

            this.expImgData.pixelWidth,
            this.expImgData.pixelHeight
        );

        this.cWidthShowAll = (this.expImgData.width + Math.max (this.expImgData.paddingLeft, 0) + Math.max (this.expImgData.paddingRight, 0));
        this.cHeightShowAll = (this.expImgData.height + Math.max (this.expImgData.paddingBottom, 0) + Math.max (this.expImgData.paddingTop, 0));

        // 采集缩略图的数据
        let fbo = MgrGlobal.inst.canvas3dCtx.getFbo (this.uint8ArgsSmooth.cacheTexWidth, this.uint8ArgsSmooth.cacheTexHeight);
        let tex = MgrGlobal.inst.canvas3dCtx.createTexture ();
        DomImageSmooth.Args.drawImgPadding (
            this.uint8ArgsSmooth,
            MgrGlobal.inst.canvas3dCtx,
            fbo,
            tex
        );
        fbo.cacheToUint8 ();
        this.cMiniBinRGBA.loadData (fbo.arrUint8);
        MgrGlobal.inst.canvas3dCtx.destroyFbo (fbo);
        MgrGlobal.inst.canvas3dCtx.destroyTex (tex);

        // 记录各个位置对应的颜色 id
        let length = this.uint8ArgsSmooth.cacheTexWidth * this.uint8ArgsSmooth.cacheTexHeight;
        this.cMiniBinColor.initLength (length);
        for (let i = 0; i < length; i++) {
            this.cMiniBinColor.bin [i] = 0;
            for (let j = 0; j < 4; j++) {
                this.cMiniBinColor.bin [i] <<= 8;
                this.cMiniBinColor.bin [i] += this.cMiniBinRGBA.bin [i * 4 + j];
            };
            this.cSetColor.add (this.cMiniBinColor.bin [i]);
        };
        
        // 为各个颜色 id 生成记录
        this.cSetColor.forEach ((color) => {
            let colorBackup = color;
            let colorA = color % 256;
            color >>= 8;
            let colorB = color % 256;
            color >>= 8;
            let colorG = color % 256;
            color >>= 8;
            let colorR = color % 256;
            color >>= 8;

            let colorInst = objectPool.pop (ColorRecord.poolType);
            colorInst.init (colorBackup, 0, colorR / 255, colorG / 255, colorB / 255, colorA / 255);
            this.cListColorRecord.push (colorInst);
        });

        // 更新序号
        this.cListColorRecord.sort ((a, b) => {
            return a.id - b.id;
        });
        for (let i = 0; i < this.cListColorRecord.length; i++) {
            let listColorI = this.cListColorRecord [i];
            listColorI.idx = i;
        };

        // 更新索引
        this.cMapIdToColorRecord.clear ();
        for (let i = 0; i < this.cListColorRecord.length; i++) {
            let listColorI = this.cListColorRecord [i];
            this.cMapIdToColorRecord.set (listColorI.id, listColorI);
        };
    }
}

export default ExpImg;
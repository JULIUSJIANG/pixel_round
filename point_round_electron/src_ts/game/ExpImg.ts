import DataUint32Array from "../common/DataUint32Array.js";
import DataUint8Array from "../common/DataUint8Array.js";
import objectPool from "../common/ObjectPool.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrGlobal from "../mgr/MgrGlobal.js";
import MgrResAssetsImage from "../mgr/MgrResAssetsImage.js";
import DomImageSmooth from "../ui/DomImageSmooth.js";
import ColorRecord from "./ColorRecord.js";
import ExpImgMaskStatus from "./ExpImgMaskStatus.js";
import ExpImgMaskStatusActive from "./ExpImgMaskStatusActive.js";
import ExpImgMaskStatusIdle from "./ExpImgMaskStatusIdle.js";
import ExpImgUint8Status from "./ExpImgUint8Status.js";
import ExpImgUint8StatusDestroy from "./ExpImgUint8StatusDestroy.js";
import ExpImgUint8StatusIdle from "./ExpImgUint8StatusIdle.js";
import ExpImgUint8StatusLoaded from "./ExpImgUint8StatusLoaded.js";
import ExpImgUint8StatusLoading from "./ExpImgUint8StatusLoading.js";

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
    miniBinRGBA = new DataUint8Array ();
    /**
     * 缩略图的二进制数据，每个数字代表 rgba
     */
    miniBinColor = new DataUint32Array ();

    /**
     * 用于去重
     */
    setColor = new Set <number> ();
    /**
     * 颜色记录
     */
    listColorRecord = new Array <ColorRecord> ();
    /**
     * 标识到颜色记录的映射
     */
    mapIdToColorRecord = new Map <number, ColorRecord> ();

    /**
     * 缓存数据
     */
    cache () {
        // 清除旧的缓存
        this.setColor.clear ();
        for (let i = 0; i < this.listColorRecord.length; i++) {
            let listColorRecordI = this.listColorRecord [i];
            objectPool.push (listColorRecordI);
        };
        this.listColorRecord.length = 0;
        this.mapIdToColorRecord.clear ();

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
        this.miniBinRGBA.loadData (fbo.arrUint8);
        MgrGlobal.inst.canvas3dCtx.destroyFbo (fbo);
        MgrGlobal.inst.canvas3dCtx.destroyTex (tex);

        // 记录各个位置对应的颜色 id
        let length = this.uint8ArgsSmooth.cacheTexWidth * this.uint8ArgsSmooth.cacheTexHeight;
        this.miniBinColor.initLength (length);
        for (let i = 0; i < length; i++) {
            this.miniBinColor.bin [i] = 0;
            for (let j = 0; j < 4; j++) {
                this.miniBinColor.bin [i] << 8;
                this.miniBinColor.bin [i] += this.miniBinRGBA [i * 4 + j];
            };
            this.setColor.add (this.miniBinColor.bin [i]);
        };
        
        // 为各个颜色 id 生成记录
        this.setColor.forEach ((color) => {
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
            this.listColorRecord.push (colorInst);
        });

        // 更新序号
        this.listColorRecord.sort ((a, b) => {
            return a.id - b.id;
        });
        for (let i = 0; i < this.listColorRecord.length; i++) {
            let listColorI = this.listColorRecord [i];
            listColorI.idx = i;
        };

        // 更新索引
        this.mapIdToColorRecord.clear ();
        for (let i = 0; i < this.listColorRecord.length; i++) {
            let listColorI = this.listColorRecord [i];
            this.mapIdToColorRecord.set (listColorI.id, listColorI);
        };
    }
}

export default ExpImg;
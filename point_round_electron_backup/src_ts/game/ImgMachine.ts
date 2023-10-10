import DetailMachineStatusPreview from "./DetailMachineStatusPreview.js";
import ImgMachineStatus from "./ImgMachineStatus.js";
import ImgMachineStatusIdle from "./ImgMachineStatusIdle.js";
import ImgMachineStatusCached from "./ImgMachineStatusCached.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrData from "../mgr/MgrData.js";
import ImgMachineStatusLoaded from "./ImgMachineStatusLoaded.js";
import MgrResAssetsImage from "../mgr/MgrResAssetsImage.js";
import MgrRes from "../mgr/MgrRes.js";

/**
 * 图片存档的状态机
 */
class ImgMachine {
    /**
     * 归属的界面状态
     */
    rel: DetailMachineStatusPreview;
    /**
     * 存档id
     */
    dataId: number;
    /**
     * 存档的对象实例
     */
    dataInst: MgrDataItem.ImgData;
    /**
     * 存档对应的图片资源
     */
    assetsImg: MgrResAssetsImage;

    constructor (rel: DetailMachineStatusPreview, relId: number) {
        this.rel = rel;
        this.dataId = relId;

        let listData = MgrData.inst.get (MgrDataItem.LIST_IMG_DATA);
        for (let i = 0; i < listData.length; i++) {
            let listDataI = listData [i];
            if (listDataI.id == this.dataId) {
                this.dataInst = listDataI;
                break;
            };
        };

        this.assetsImg = MgrRes.inst.getImg (this.dataInst.dataOrigin);

        this.statusIdle = new ImgMachineStatusIdle (this);
        this.statusLoaded = new ImgMachineStatusLoaded (this);
        this.statusCached = new ImgMachineStatusCached (this);
        this.enter (this.statusIdle);
    }

    /**
     * 状态 - 初始
     */
    statusIdle: ImgMachineStatusIdle;
    /**
     * 状态 - 图片加载完毕
     */
    statusLoaded: ImgMachineStatusLoaded;
    /**
     * 状态 - 缓存完毕
     */
    statusCached: ImgMachineStatusCached;

    /**
     * 当前状态
     */
    currStatus: ImgMachineStatus;

    /**
     * 切换状态
     * @param status 
     */
    enter (status: ImgMachineStatus) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.onExit ();
        };
        this.currStatus.onEnter ();
        MgrData.inst.callDataChange ();
    }

    /**
     * 事件派发 - 创建
     */
    onCreate () {

    }

    /**
     * 事件派发 - 销毁
     */
    onDestroy () {

    }

    /**
     * 获取平滑优先
     * @param colorIdA 
     * @param colorIdB 
     */
    getColorFirst (colorIdA: number, colorIdB: number) {
        // 小的排前面
        let colorSmall = colorIdA;
        let colorLarge = colorIdB;
        if (colorLarge < colorSmall) {
            [colorSmall, colorLarge] = [colorLarge, colorSmall];
        };
        // 读取记录
        let value = false;
        if (
            this.dataInst.colorTable
            && this.dataInst.colorTable [colorSmall]
            && this.dataInst.colorTable [colorSmall] [colorLarge]
        ) 
        {
            value = true;
        };
        if (colorIdB < colorIdA) {
            return !value;
        };
        return value;
    }
}

export default ImgMachine;
import MCRootStatusExperimentDetailStatusSmooth from "./MCRootStatusExperimentDetailStatusSmooth.js";
import SmoothMachineStatus from "./SmoothMachineStatus.js";
import SmoothMachineStatusIdle from "./SmoothMachineStatusIdle.js";
import SmoothMachineStatusCached from "./SmoothMachineStatusCached.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrData from "../mgr/MgrData.js";
import SmoothMachineStatusLoaded from "./SmoothMachineStatusLoaded.js";
import MgrResAssetsImage from "../mgr/MgrResAssetsImage.js";
import MgrRes from "../mgr/MgrRes.js";
import IndexGlobal from "../IndexGlobal.js";
import ExpImg from "./ExpImg.js";

/**
 * 图片存档的状态机
 */
class SmoothMachine {
    /**
     * 归属的界面状态
     */
    rel: MCRootStatusExperimentDetailStatusSmooth;
    /**
     * 存档id
     */
    dataId: number;
    /**
     * 存档的对象实例
     */
    dataInst: ExpImg;
    /**
     * 存档对应的图片资源
     */
    assetsImg: MgrResAssetsImage;

    constructor (rel: MCRootStatusExperimentDetailStatusSmooth, relId: number) {
        this.rel = rel;
        this.dataId = relId;

        for (let i = 0; i < IndexGlobal.inst.expListImg.length; i++) {
            let expListImgI = IndexGlobal.inst.expListImg [i];
            if (expListImgI.expImgData.id == this.dataId) {
                this.dataInst = expListImgI;
                break;
            };
        };

        this.assetsImg = MgrRes.inst.getImg (this.dataInst.expImgData.dataOrigin);

        this.statusIdle = new SmoothMachineStatusIdle (this);
        this.statusLoaded = new SmoothMachineStatusLoaded (this);
        this.statusCached = new SmoothMachineStatusCached (this);
        this.enter (this.statusIdle);
    }

    /**
     * 状态 - 初始
     */
    statusIdle: SmoothMachineStatusIdle;
    /**
     * 状态 - 图片加载完毕
     */
    statusLoaded: SmoothMachineStatusLoaded;
    /**
     * 状态 - 缓存完毕
     */
    statusCached: SmoothMachineStatusCached;

    /**
     * 当前状态
     */
    currStatus: SmoothMachineStatus;

    /**
     * 切换状态
     * @param status 
     */
    enter (status: SmoothMachineStatus) {
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
}

export default SmoothMachine;
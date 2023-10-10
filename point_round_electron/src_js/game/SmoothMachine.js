import SmoothMachineStatusIdle from "./SmoothMachineStatusIdle.js";
import SmoothMachineStatusCached from "./SmoothMachineStatusCached.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrData from "../mgr/MgrData.js";
import SmoothMachineStatusLoaded from "./SmoothMachineStatusLoaded.js";
import MgrRes from "../mgr/MgrRes.js";
/**
 * 图片存档的状态机
 */
class SmoothMachine {
    constructor(rel, relId) {
        this.rel = rel;
        this.dataId = relId;
        let listData = MgrData.inst.get(MgrDataItem.LIST_IMG_DATA);
        for (let i = 0; i < listData.length; i++) {
            let listDataI = listData[i];
            if (listDataI.id == this.dataId) {
                this.dataInst = listDataI;
                break;
            }
            ;
        }
        ;
        this.assetsImg = MgrRes.inst.getImg(this.dataInst.dataOrigin);
        this.statusIdle = new SmoothMachineStatusIdle(this);
        this.statusLoaded = new SmoothMachineStatusLoaded(this);
        this.statusCached = new SmoothMachineStatusCached(this);
        this.enter(this.statusIdle);
    }
    /**
     * 切换状态
     * @param status
     */
    enter(status) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.onExit();
        }
        ;
        this.currStatus.onEnter();
        MgrData.inst.callDataChange();
    }
    /**
     * 事件派发 - 创建
     */
    onCreate() {
    }
    /**
     * 事件派发 - 销毁
     */
    onDestroy() {
    }
}
export default SmoothMachine;

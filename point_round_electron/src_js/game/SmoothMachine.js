import SmoothMachineStatusIdle from "./SmoothMachineStatusIdle.js";
import SmoothMachineStatusCached from "./SmoothMachineStatusCached.js";
import MgrData from "../mgr/MgrData.js";
import SmoothMachineStatusLoaded from "./SmoothMachineStatusLoaded.js";
import MgrRes from "../mgr/MgrRes.js";
import IndexGlobal from "../IndexGlobal.js";
/**
 * 图片存档的状态机
 */
class SmoothMachine {
    constructor(rel, relId) {
        this.rel = rel;
        this.dataId = relId;
        for (let i = 0; i < IndexGlobal.inst.expListImg.length; i++) {
            let expListImgI = IndexGlobal.inst.expListImg[i];
            if (expListImgI.expImgData.id == this.dataId) {
                this.dataInst = expListImgI;
                break;
            }
            ;
        }
        ;
        this.assetsImg = MgrRes.inst.getImg(this.dataInst.expImgData.dataOrigin);
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

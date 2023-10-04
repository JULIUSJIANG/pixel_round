import ImgMachineStatusIdle from "./ImgMachineStatusIdle.js";
import ImgMachineStatusCached from "./ImgMachineStatusCached.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrData from "../mgr/MgrData.js";
import ImgMachineStatusLoaded from "./ImgMachineStatusLoaded.js";
import MgrRes from "../mgr/MgrRes.js";
/**
 * 图片存档的状态机
 */
class ImgMachine {
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
        this.statusIdle = new ImgMachineStatusIdle(this);
        this.statusLoaded = new ImgMachineStatusLoaded(this);
        this.statusCached = new ImgMachineStatusCached(this);
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
    /**
     * 获取平滑优先
     * @param colorIdA
     * @param colorIdB
     */
    getColorFirst(colorIdA, colorIdB) {
        // 小的排前面
        let colorSmall = colorIdA;
        let colorLarge = colorIdB;
        if (colorLarge < colorSmall) {
            [colorSmall, colorLarge] = [colorLarge, colorSmall];
        }
        ;
        // 读取记录
        let value = false;
        if (this.dataInst.colorTable
            && this.dataInst.colorTable[colorSmall]
            && this.dataInst.colorTable[colorSmall][colorLarge]) {
            value = true;
        }
        ;
        if (colorIdB < colorIdA) {
            return !value;
        }
        ;
        return value;
    }
}
export default ImgMachine;

import MgrData from "../mgr/MgrData.js";
import ImgMachineStatus from "./ImgMachineStatus.js";

/**
 * 状态 - 图像信息缓存完毕
 */
class ImgMachineStatusCached extends ImgMachineStatus {

    onSizeChanged (): void {
        this.relMachine.enter (this.relMachine.statusLoaded);
        MgrData.inst.callDataChange ();
    }
}

export default ImgMachineStatusCached;
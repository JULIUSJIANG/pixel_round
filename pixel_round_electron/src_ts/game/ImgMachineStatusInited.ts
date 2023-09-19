import MgrData from "../mgr/MgrData.js";
import ImgMachineStatus from "./ImgMachineStatus.js";

class ImgMachineStatusInited extends ImgMachineStatus {

    onSizeChanged (): void {
        this.relMachine.enter (this.relMachine.statusIdle);
        MgrData.inst.callDataChange ();
    }
}

export default ImgMachineStatusInited;
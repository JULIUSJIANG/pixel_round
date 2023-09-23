import CornerMachineStatus from "./CornerMachineStatus.js";
import CornerTypeRSSide from "./CornerTypeRSSide.js";

/**
 * 角状态机 - 状态 - 侧方切一刀
 */
class CornerMachineStatusResultNone extends CornerMachineStatus {

    onGetCornerType (): CornerTypeRSSide {
        return CornerTypeRSSide.none;
    }
}

export default CornerMachineStatusResultNone;
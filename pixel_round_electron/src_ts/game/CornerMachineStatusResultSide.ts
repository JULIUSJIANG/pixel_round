import CornerMachineStatus from "./CornerMachineStatus.js";
import CornerTypeRSSide from "./CornerTypeRSSide.js";

/**
 * 角状态机 - 状态 - 侧方切一刀
 */
class CornerMachineStatusResultSide extends CornerMachineStatus {

    onGetCornerType (): CornerTypeRSSide {
        return CornerTypeRSSide.side;
    }
}

export default CornerMachineStatusResultSide;
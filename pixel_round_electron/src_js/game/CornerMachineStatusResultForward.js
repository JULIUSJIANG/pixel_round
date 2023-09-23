import CornerMachineStatus from "./CornerMachineStatus.js";
import CornerTypeRSSide from "./CornerTypeRSSide.js";
/**
 * 角状态机 - 状态 - 前方切一刀
 */
class CornerMachineStatusResultForward extends CornerMachineStatus {
    onGetCornerType() {
        return CornerTypeRSSide.forward;
    }
}
export default CornerMachineStatusResultForward;

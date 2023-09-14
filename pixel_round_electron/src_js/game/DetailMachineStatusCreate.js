import ReactComponentExtend from "../common/ReactComponentExtend.js";
import DomRightCreate from "../ui/DomRightCreate.js";
import DetailMachineStatus from "./DetailMachineStatus.js";
export default class DetailMachineStatusCreate extends DetailMachineStatus {
    onRender() {
        return ReactComponentExtend.instantiateComponent(DomRightCreate, null);
    }
}

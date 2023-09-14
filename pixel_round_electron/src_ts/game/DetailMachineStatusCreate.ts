import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import DomRightCreate from "../ui/DomRightCreate.js";
import DomRightPreview from "../ui/DomRightPreview.js";
import DetailMachineStatus from "./DetailMachineStatus.js";

export default class DetailMachineStatusCreate extends DetailMachineStatus {
    onRender(): ReactComponentExtendInstance {
        return ReactComponentExtend.instantiateComponent (DomRightCreate, null);
    }
}
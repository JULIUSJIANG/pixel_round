import ReactComponentExtend from "../common/ReactComponentExtend.js";
import DomRightPreview from "../ui/DomRightPreview.js";
import DetailMachineStatus from "./DetailMachineStatus.js";
export default class DetailMachineStatusPreview extends DetailMachineStatus {
    onRender() {
        return ReactComponentExtend.instantiateComponent(DomRightPreview, null);
    }
}

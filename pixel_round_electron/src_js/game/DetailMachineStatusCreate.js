import ReactComponentExtend from "../common/ReactComponentExtend.js";
import DomRightCreate from "../ui/DomRightCreate.js";
import DetailMachineStatus from "./DetailMachineStatus.js";
export default class DetailMachineStatusCreate extends DetailMachineStatus {
    onImg(id) {
        this.relMachine.enter(this.relMachine.statusPreview);
        this.relMachine.currStatus.onImg(id);
    }
    onRender() {
        return ReactComponentExtend.instantiateComponent(DomRightCreate, null);
    }
}

import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import DomRightCreate from "../ui/DomRightCreate.js";
import DetailMachineStatus from "./DetailMachineStatus.js";
export default class DetailMachineStatusCreate extends DetailMachineStatus {
    onImg(id) {
        MgrData.inst.set(MgrDataItem.CURRENT_IMG, id);
        this.relMachine.enter(this.relMachine.statusPreview);
    }
    onRender() {
        return ReactComponentExtend.instantiateComponent(DomRightCreate, null);
    }
}

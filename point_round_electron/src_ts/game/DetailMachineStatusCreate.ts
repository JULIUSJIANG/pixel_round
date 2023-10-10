import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import DomExperimentRightCreate from "../ui/DomExperimentRightCreate.js";
import DomExperimentRightPreview from "../ui/DomExperimentRightPreview.js";
import DetailMachineStatus from "./DetailMachineStatus.js";

export default class DetailMachineStatusCreate extends DetailMachineStatus {

    onImg (id: number): void {
        MgrData.inst.set (MgrDataItem.CURRENT_IMG, id);
        this.relMachine.enter (this.relMachine.statusPreview);
    }

    onRender(): ReactComponentExtendInstance {
        return ReactComponentExtend.instantiateComponent (DomExperimentRightCreate, null);
    }
}
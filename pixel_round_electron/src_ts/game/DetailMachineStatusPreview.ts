import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import DomRightPreview from "../ui/DomRightPreview.js";
import DetailMachineStatus from "./DetailMachineStatus.js";

export default class DetailMachineStatusPreview extends DetailMachineStatus {

    onCreate (): void {
        this.relMachine.enter (this.relMachine.statusCreate);
    }

    onImg (id: number): void {
        MgrData.inst.set (MgrDataItem.CURRENT_IMG, id);
    }

    onRender(): ReactComponentExtendInstance {
        return ReactComponentExtend.instantiateComponent (DomRightPreview, null);
    }
}
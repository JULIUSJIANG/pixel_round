import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import DomExperimentRightPreview from "../ui/DomExperimentRightPreview.js";
import MCRootStatusExperimentDetailStatus from "./MCRootStatusExperimentDetailStatus.js";

export default class MCRootStatusExperimentDetailStatusSmooth extends MCRootStatusExperimentDetailStatus {

    onCreate (): void {
        this.relMachine.detailEnter (this.relMachine.detailStatusCreate);
    }

    onRender (): ReactComponentExtendInstance {
        return ReactComponentExtend.instantiateComponent (DomExperimentRightPreview, null);
    }
}
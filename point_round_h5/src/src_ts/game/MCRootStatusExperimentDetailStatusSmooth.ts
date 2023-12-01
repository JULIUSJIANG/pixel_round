import ReactComponentExtend from "../common/ReactComponentExtend";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance";
import DomExperimentRightPreview from "../ui/DomExperimentRightPreview";
import MCRootStatusExperimentDetailStatus from "./MCRootStatusExperimentDetailStatus";

export default class MCRootStatusExperimentDetailStatusSmooth extends MCRootStatusExperimentDetailStatus {

    onCreate (): void {
        this.relMachine.detailEnter (this.relMachine.detailStatusCreate);
    }

    onRender (): ReactComponentExtendInstance {
        return ReactComponentExtend.instantiateComponent (DomExperimentRightPreview, null);
    }
}
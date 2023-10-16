import ReactComponentExtend from "../common/ReactComponentExtend.js";
import DomExperimentRightPreview from "../ui/DomExperimentRightPreview.js";
import MCRootStatusExperimentDetailStatus from "./MCRootStatusExperimentDetailStatus.js";
export default class MCRootStatusExperimentDetailStatusSmooth extends MCRootStatusExperimentDetailStatus {
    onCreate() {
        this.relMachine.detailEnter(this.relMachine.detailStatusCreate);
    }
    onRender() {
        return ReactComponentExtend.instantiateComponent(DomExperimentRightPreview, null);
    }
}

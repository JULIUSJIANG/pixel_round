import IndexGlobal from "../IndexGlobal.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import DomImageSmooth from "./DomImageSmooth.js";
class DomExperimentRightSmooth extends ReactComponentExtend {
    render() {
        let dataSrc = IndexGlobal.mcExp().statusPreview;
        return ReactComponentExtend.instantiateComponent(DomImageSmooth, dataSrc.argsSmooth);
    }
}
export default DomExperimentRightSmooth;

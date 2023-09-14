import CreateMachine from "./game/CreateMachine.js";
import DetailMachine from "./game/DetailMachine.js";
import MgrData from "./mgr/MgrData.js";
import MgrDataItem from "./mgr/MgrDataItem.js";
class IndexGlobal {
    init() {
        this.detailMachine = new DetailMachine(this);
        this.detailMachine.enter(this.detailMachine.mapIdToStatus.get(MgrData.inst.get(MgrDataItem.DETAIL_MACHINE_STATUS)));
        this.createMachine = new CreateMachine(this);
    }
}
(function (IndexGlobal) {
    IndexGlobal.inst = new IndexGlobal();
})(IndexGlobal || (IndexGlobal = {}));
export default IndexGlobal;

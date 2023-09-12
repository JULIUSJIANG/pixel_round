import DetailMachine from "./game/DetailMachine.js";
import MgrData from "./mgr/MgrData.js";
import MgrDataItem from "./mgr/MgrDataItem.js";
class IndexGlobal {
    init() {
        this.machine = new DetailMachine(this);
        this.machine.enter(this.machine.mapIdToStatus.get(MgrData.inst.get(MgrDataItem.DETAIL_MACHINE_STATUS)));
    }
}
(function (IndexGlobal) {
    IndexGlobal.inst = new IndexGlobal();
})(IndexGlobal || (IndexGlobal = {}));
export default IndexGlobal;

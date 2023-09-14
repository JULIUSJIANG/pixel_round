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
    IndexGlobal.IMG_MINI_SIZE = 100;
    IndexGlobal.IMG_LIST_COLUMN_COUNT = 3;
})(IndexGlobal || (IndexGlobal = {}));
export default IndexGlobal;

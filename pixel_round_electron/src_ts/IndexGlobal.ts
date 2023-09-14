import CreateMachine from "./game/CreateMachine.js";
import DetailMachine from "./game/DetailMachine.js";
import MgrData from "./mgr/MgrData.js";
import MgrDataItem from "./mgr/MgrDataItem.js";

class IndexGlobal {

    detailMachine: DetailMachine;

    createMachine: CreateMachine;

    init () {
        this.detailMachine = new DetailMachine (this);
        this.detailMachine.enter (this.detailMachine.mapIdToStatus.get (MgrData.inst.get (MgrDataItem.DETAIL_MACHINE_STATUS)));
        this.createMachine = new CreateMachine (this);
    }
}

namespace IndexGlobal {

    export const inst = new IndexGlobal ();

    export const IMG_MINI_SIZE = 100;

    export const IMG_LIST_COLUMN_COUNT = 3;
}

export default IndexGlobal;
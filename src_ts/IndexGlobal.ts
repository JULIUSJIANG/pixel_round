import DetailMachine from "./game/DetailMachine.js";
import MgrData from "./mgr/MgrData.js";
import MgrDataItem from "./mgr/MgrDataItem.js";

class IndexGlobal {

    machine: DetailMachine;

    init () {
        this.machine = new DetailMachine (this);
        this.machine.enter (this.machine.mapIdToStatus.get (MgrData.inst.get (MgrDataItem.DETAIL_MACHINE_STATUS)));
    }
}

namespace IndexGlobal {

    export const inst = new IndexGlobal ();
}

export default IndexGlobal;
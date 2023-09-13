import IndexGlobal from "../IndexGlobal.js";
import MgrData from "../mgr/MgrData.js";
import MgrResAssetsImage from "../mgr/MgrResAssetsImage.js";
import CreateMachineStatus from "./CreateMachineStatus.js";
import CreateMachineStatusIdle from "./CreateMachineStatusIdle.js";
import CreateMachineStatusLoading from "./CreateMachineStatusLoading.js";
import CreateMachineStatusUploading from "./CreateMachineStatusUploading.js";

export default class CreateMachine {

    img: MgrResAssetsImage;

    relGlobal: IndexGlobal;

    canvasWidth = 400;

    canvasHeight = 400;

    constructor (indexGlobal: IndexGlobal) {
        this.relGlobal = indexGlobal;

        this.statusIdle = new CreateMachineStatusIdle (this);
        this.statusUploading = new CreateMachineStatusUploading (this);
        this.statusLoading = new CreateMachineStatusLoading (this);

        this.enter (this.statusIdle);
    }

    statusIdle: CreateMachineStatusIdle;

    statusUploading: CreateMachineStatusUploading;

    statusLoading: CreateMachineStatusLoading;

    currStatus: CreateMachineStatus;

    enter (status: CreateMachineStatus) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.onExit ();
        };
        this.currStatus.onEnter ();
        MgrData.inst.callDataChange ();
    }
}
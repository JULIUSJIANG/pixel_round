import ImgMachineStatusIdle from "./ImgMachineStatusIdle.js";
import ImgMachineStatusInited from "./ImgMachineStatusInited.js";
class ImgMachine {
    constructor(rel, relId) {
        this.rel = rel;
        this.relId = relId;
        this.statusIdle = new ImgMachineStatusIdle(this);
        this.statusInited = new ImgMachineStatusInited(this);
        this.enter(this.statusIdle);
    }
    enter(status) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.onExit();
        }
        ;
        this.currStatus.onEnter();
    }
    onCreate() {
    }
    onDestroy() {
    }
}
export default ImgMachine;

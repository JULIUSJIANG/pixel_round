import DetailMachineStatusPreview from "./DetailMachineStatusPreview.js";
import DetailMachineStatusPreviewColor from "./DetailMachineStatusPreviewColor.js";
import ImgMachineStatus from "./ImgMachineStatus.js";
import ImgMachineStatusIdle from "./ImgMachineStatusIdle.js";
import ImgMachineStatusInited from "./ImgMachineStatusInited.js";

class ImgMachine {

    rel: DetailMachineStatusPreview;

    relId: number;

    constructor (rel: DetailMachineStatusPreview, relId: number) {
        this.rel = rel;
        this.relId = relId;
        this.statusIdle = new ImgMachineStatusIdle (this);
        this.statusInited = new ImgMachineStatusInited (this);
        this.enter (this.statusIdle);
    }

    statusIdle: ImgMachineStatusIdle;
    statusInited: ImgMachineStatusInited;

    currStatus: ImgMachineStatus;

    enter (status: ImgMachineStatus) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.onExit ();
        };
        this.currStatus.onEnter ();
    }

    onCreate () {

    }

    onDestroy () {

    }
}

export default ImgMachine;
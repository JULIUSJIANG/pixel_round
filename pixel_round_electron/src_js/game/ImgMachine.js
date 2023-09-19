import ImgMachineStatusIdle from "./ImgMachineStatusIdle.js";
import ImgMachineStatusInited from "./ImgMachineStatusInited.js";
class ImgMachine {
    constructor(relId) {
        /**
         * 每四个数字代表一个颜色
         */
        this.binRgba = new Uint8Array(1);
        this.binRgbaSize = 4;
        /**
         * 每个数字代表一个颜色
         */
        this.binColor = new Uint32Array(1);
        this.binColorSize = 1;
        /**
         * 所有颜色
         */
        this.listColor = new Array();
        /**
         * 标识到具体颜色的映射
         */
        this.mapIdToColor = new Map();
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

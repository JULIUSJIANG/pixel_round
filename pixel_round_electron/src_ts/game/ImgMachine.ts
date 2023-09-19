import { List } from "../../node_modules/antd/es/index.js";
import DetailMachineStatusPreviewColor from "./DetailMachineStatusPreviewColor.js";
import ImgMachineStatus from "./ImgMachineStatus.js";
import ImgMachineStatusIdle from "./ImgMachineStatusIdle.js";
import ImgMachineStatusInited from "./ImgMachineStatusInited.js";

class ImgMachine {

    relId: number;

    constructor (relId: number) {
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

    /**
     * 图片宽
     */
    imgWidth: number;
    /**
     * 图片高
     */
    imgHeight: number;

    /**
     * 每四个数字代表一个颜色
     */
    binRgba = new Uint8Array (1);
    binRgbaSize = 4;

    /**
     * 每个数字代表一个颜色
     */
    binColor = new Uint32Array (1);
    binColorSize = 1;

    /**
     * 所有颜色
     */
    listColor = new Array <DetailMachineStatusPreviewColor> ();
    /**
     * 标识到具体颜色的映射
     */
    mapIdToColor = new Map <number, DetailMachineStatusPreviewColor> ();
}

export default ImgMachine;
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import DomRightPreview from "../ui/DomRightPreview.js";
import DetailMachineStatus from "./DetailMachineStatus.js";
import DetailMachineStatusPreviewColor from "./DetailMachineStatusPreviewColor.js";
import ImgMachine from "./ImgMachine.js";
import ImgPixelGroup from "./ImgPixelGroup.js";

export default class DetailMachineStatusPreview extends DetailMachineStatus {

    onEnter (): void {
        this.onImg (MgrData.inst.get (MgrDataItem.CURRENT_IMG));
    }

    onCreate (): void {
        this.relMachine.enter (this.relMachine.statusCreate);
    }

    imgMachine: ImgMachine;

    onImg (id: number): void {
        MgrData.inst.set (MgrDataItem.CURRENT_IMG, id);
        let rec = this.imgMachine;
        this.imgMachine = new ImgMachine (this, id);
        if (rec) {
            rec.onDestroy ();
        };
        this.imgMachine.onCreate ();
    }

    onRender(): ReactComponentExtendInstance {
        return ReactComponentExtend.instantiateComponent (DomRightPreview, null);
    }

    /**
     * 图片宽
     */
    imgWidth: number = 1;
    /**
     * 图片高
     */
    imgHeight: number = 1;

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

    /**
     * 存储分块信息的集合，与位置相关
     */
    listImgPixelGroup = new Array <ImgPixelGroup> ();
    /**
     * 仅关注类型
     */
    listImgPixelGroupAll = new Array <ImgPixelGroup> ();
}
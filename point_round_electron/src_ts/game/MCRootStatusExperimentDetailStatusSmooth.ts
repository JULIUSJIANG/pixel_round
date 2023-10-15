import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import DomExperimentRightPreview from "../ui/DomExperimentRightPreview.js";
import MCRootStatusExperimentDetailStatus from "./MCRootStatusExperimentDetailStatus.js";
import TextureColor from "./TextureColor.js";
import SmoothMachine from "./SmoothMachine.js";
import objectPool from "../common/ObjectPool.js";
import DomImageSmooth from "../ui/DomImageSmooth.js";
import MCRootStatusExperiment from "./MCRootStatusExperiment.js";

export default class MCRootStatusExperimentDetailStatusSmooth extends MCRootStatusExperimentDetailStatus {

    constructor (machine: MCRootStatusExperiment, id: number) {
        super (machine, id);
        this.argsSmooth = objectPool.pop (DomImageSmooth.Args.poolType);
    }

    onEnter (): void {
        this.onImg (MgrData.inst.get (MgrDataItem.EXP_CURRENT_IMG));
    }

    onCreate (): void {
        this.relMachine.detailEnter (this.relMachine.detailStatusCreate);
    }

    /**
     * 当前控制的图片
     */
    imgMachine: SmoothMachine;

    onImg (id: number): void {
        MgrData.inst.set (MgrDataItem.EXP_CURRENT_IMG, id);
        let rec = this.imgMachine;
        this.imgMachine = new SmoothMachine (this, id);
        if (rec) {
            rec.onDestroy ();
        };
        this.imgMachine.onCreate ();
    }

    onRender (): ReactComponentExtendInstance {
        return ReactComponentExtend.instantiateComponent (DomExperimentRightPreview, null);
    }

    /**
     * 平滑参数
     */
    argsSmooth: DomImageSmooth.Args;

    /**
     * 展示裁切内容时候图片宽度
     */
    imgWidthShowAll: number;
    /**
     * 展示裁切内容时候图片高度
     */
    imgHeightShowAll: number;

    /**
     * 每四个数字代表一个颜色
     */
    binXYToRgbaUint = new Uint8Array (1);
    binXYToRgbaUintSize = 4;

    /**
     * 每个数字代表一个颜色
     */
    binXYToColorUint = new Uint32Array (1);
    binXYToColorUintSize = 1;

    /**
     * 所有颜色
     */
    listColor = new Array <TextureColor> ();
    /**
     * 标识到具体颜色的映射
     */
    mapIdToColor = new Map <number, TextureColor> ();
}
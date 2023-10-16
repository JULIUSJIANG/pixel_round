import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import DomExperimentRightPreview from "../ui/DomExperimentRightPreview.js";
import MCRootStatusExperimentDetailStatus from "./MCRootStatusExperimentDetailStatus.js";
import ColorRecord from "./ColorRecord.js";
import objectPool from "../common/ObjectPool.js";
import DomImageSmooth from "../ui/DomImageSmooth.js";
import MCRootStatusExperiment from "./MCRootStatusExperiment.js";
import IndexGlobal from "../IndexGlobal.js";

export default class MCRootStatusExperimentDetailStatusSmooth extends MCRootStatusExperimentDetailStatus {

    constructor (machine: MCRootStatusExperiment, id: number) {
        super (machine, id);
    }

    onEnter (): void {
        
    }

    onCreate (): void {
        this.relMachine.detailEnter (this.relMachine.detailStatusCreate);
    }

    onRender (): ReactComponentExtendInstance {
        return ReactComponentExtend.instantiateComponent (DomExperimentRightPreview, null);
    }

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
    listColor = new Array <ColorRecord> ();
    /**
     * 标识到具体颜色的映射
     */
    mapIdToColor = new Map <number, ColorRecord> ();
}
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import DomRightPreview from "../ui/DomRightPreview.js";
import DetailMachineStatus from "./DetailMachineStatus.js";
import TextureColor from "./TextureColor.js";
import ImgMachine from "./ImgMachine.js";
import TextureGroup from "./TextureGroup.js";
import TexturePixel from "./TexturePixel.js";
import DetailMachine from "./DetailMachine.js";
import CornerMachine from "./CornerMachine.js";

export default class DetailMachineStatusPreview extends DetailMachineStatus {

    /**
     * 角状态机
     */
    private _cornerMachine: CornerMachine;

    constructor (machine: DetailMachine, id: number) {
        super (machine, id);
        this._cornerMachine = new CornerMachine (this);
    }

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
    binXYToRgba = new Uint8Array (1);
    binXYToRgbaSize = 4;

    /**
     * 每个数字代表一个颜色
     */
    binXYToColor = new Uint32Array (1);
    binXYToColorSize = 1;

    /**
     * 所有颜色
     */
    listColor = new Array <TextureColor> ();
    /**
     * 标识到具体颜色的映射
     */
    mapIdToColor = new Map <number, TextureColor> ();

    /**
     * 存储分块信息的集合，与位置相关
     */
    listXYToTextureGroup = new Array <TextureGroup> ();
    /**
     * 仅关注类型
     */
    listTextureGroup = new Array <TextureGroup> ();
    /**
     * 仅关注类型 - 不为空
     */
    listTextureGroupNotEmpty = new Array <TextureGroup> ();

    /**
     * 所有像素的记录
     */
    listXYToTexturePixel = new Array <TexturePixel> ();

    /**
     * 获取角的裁切类型
     * @param posCurrentX 
     * @param posCurrentY 
     */
    getCornerType (
        posCurrentX: number, 
        posCurrentY: number, 
        
        vecForwardX: number,
        vecForwardY: number
    )
    {
        let vecRightX = vecForwardX;
        let vecRightY = -vecForwardY;

        let rsSideLeft = this._cornerMachine.getCornerType (
            posCurrentX,
            posCurrentY,

            vecForwardX,
            vecForwardY,

            vecRightX,
            vecRightY
        );
        let rsSideRight = this._cornerMachine.getCornerType (
            posCurrentX,
            posCurrentY,

            vecForwardX,
            vecForwardY,

            - vecRightX,
            - vecRightY
        );
        return rsSideLeft.onRight (rsSideRight);
    }
}
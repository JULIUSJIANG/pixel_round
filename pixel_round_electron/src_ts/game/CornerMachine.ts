import CornerMachineStatus from "./CornerMachineStatus.js";
import CornerMachineStatusResultForward from "./CornerMachineStatusResultForward.js";
import CornerMachineStatusIdle from "./CornerMachineStatusIdle.js";
import CornerMachineStatusResultNone from "./CornerMachineStatusResultNone.js";
import CornerMachineStatusResultSide from "./CornerMachineStatusResultSide.js";
import CornerMachineStatusMayBeForward from "./CornerMachineStatusMayBeForward.js";
import DetailMachineStatusPreview from "./DetailMachineStatusPreview.js";
import CornerMachineStatusMayBeSide from "./CornerMachineStatusMayBeSide.js";

/**
 * 角状态机
 */
class CornerMachine {
    /**
     * 数据源
     */
    dataSrc: DetailMachineStatusPreview;

    /**
     * 状态 - 待机
     */
    statusIdle: CornerMachineStatusIdle;
    /**
     * 状态 - 趋近于前方平滑
     */
    statusMayBeForward: CornerMachineStatusMayBeForward;
    /**
     * 状态 - 趋近于侧方平滑
     */
    statusMayBeSide: CornerMachineStatusMayBeSide;
    /**
     * 状态 - 不处理
     */
    statusResultNone: CornerMachineStatusResultNone;
    /**
     * 状态 - 前方平滑
     */
    statusResultForward: CornerMachineStatusResultForward;
    /**
     * 状态 - 侧方平滑
     */
    statusResultSide: CornerMachineStatusResultSide;

    constructor (dataSrc: DetailMachineStatusPreview) {
        this.dataSrc = dataSrc;
        this.statusIdle = new CornerMachineStatusIdle (this);
        this.statusMayBeForward = new CornerMachineStatusMayBeForward (this);
        this.statusMayBeSide = new CornerMachineStatusMayBeSide (this);
        this.statusResultNone = new CornerMachineStatusResultNone (this);
        this.statusResultForward = new CornerMachineStatusResultForward (this);
        this.statusResultSide = new CornerMachineStatusResultSide (this);
    }

    /**
     * 当前状态
     */
    currStatus: CornerMachineStatus;

    enter (status: CornerMachineStatus) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.onExit ();
        };
        this.currStatus.onEnter ();
    }

    /**
     * 获取颜色
     * @param x 
     * @param y 
     * @returns 
     */
    private getColor (x: number, y: number) {
        let colorId: number;
        if (x < 0 || this.dataSrc.imgWidth <= x || y < 0 || this.dataSrc.imgHeight <= y) {
            colorId = 0;
        }
        else {
            let idx = y + this.dataSrc.imgWidth + x;
            colorId = this.dataSrc.binXYToColor [idx]; 
        };
        // 返回颜色索引
        return this.dataSrc.mapIdToColor.get (colorId).idx;
    }

    colorCurrent: number;
    colorForward: number;
    colorBack: number;
    colorRight: number;
    colorLeft: number;
    colorRF: number;
    colorLF: number;
    colorRB: number;
    colorLB: number;

    /**
     * 获取角的裁切类型
     * @param posCurrentX 
     * @param posCurrentY 
     */
    getCornerType (
        posCurrentX: number, 
        posCurrentY: number, 
        
        vecForwardX: number,
        vecForwardY: number,

        vecRightX: number,
        vecRightY: number
    ) 
    {
        // 位置
        let posForwardX = posCurrentX + vecForwardX * 2.0;
        let posForwardY = posCurrentY + vecForwardY * 2.0;

        let posBackX = posCurrentX - vecForwardX * 2.0;
        let posBackY = posCurrentY - vecForwardY * 2.0;

        let posRightX = posCurrentX + vecRightX * 2.0;
        let posRightY = posCurrentY + vecRightY * 2.0;

        let posLeftX = posCurrentX - vecRightX * 2.0;
        let posLeftY = posCurrentY - vecRightY * 2.0;

        let posRFX = posCurrentX + vecRightX + vecForwardX;
        let posRFY = posCurrentY + vecRightY + vecForwardY;

        let posLFX = posCurrentX - vecRightX + vecForwardX;
        let posLFY = posCurrentY - vecRightY + vecForwardY;

        let posRBX = posCurrentX + vecRightX - vecForwardX;
        let posRBY = posCurrentY + vecRightY - vecForwardY;

        let posLBX = posCurrentX - vecRightX - vecForwardX;
        let posLBY = posCurrentY - vecRightY - vecForwardY;

        // 颜色
        this.colorCurrent = this.getColor (posCurrentX, posCurrentY);
        this.colorForward = this.getColor (posForwardX, posForwardY);
        this.colorBack = this.getColor (posBackX, posBackY);
        this.colorRight = this.getColor (posRightX, posRightY);
        this.colorLeft = this.getColor (posLeftX, posLeftY);
        this.colorRF = this.getColor (posRFX, posRFY);
        this.colorLF = this.getColor (posLFX, posLFY);
        this.colorRB = this.getColor (posRBX, posRBY);
        this.colorLB = this.getColor (posLBX, posLBY);

        this.enter (this.statusIdle);
        return this.currStatus.onGetCornerType ();
    }
}

export default CornerMachine;
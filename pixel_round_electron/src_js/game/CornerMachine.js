import CornerMachineStatusResultForward from "./CornerMachineStatusResultForward.js";
import CornerMachineStatusIdle from "./CornerMachineStatusIdle.js";
import CornerMachineStatusResultNone from "./CornerMachineStatusResultNone.js";
import CornerMachineStatusResultSide from "./CornerMachineStatusResultSide.js";
import CornerMachineStatusMayBeForward from "./CornerMachineStatusMayBeForward.js";
import CornerMachineStatusMayBeSide from "./CornerMachineStatusMayBeSide.js";
/**
 * 角状态机
 */
class CornerMachine {
    constructor(dataSrc) {
        this.dataSrc = dataSrc;
        this.statusIdle = new CornerMachineStatusIdle(this);
        this.statusMayBeForward = new CornerMachineStatusMayBeForward(this);
        this.statusMayBeSide = new CornerMachineStatusMayBeSide(this);
        this.statusResultNone = new CornerMachineStatusResultNone(this);
        this.statusResultForward = new CornerMachineStatusResultForward(this);
        this.statusResultSide = new CornerMachineStatusResultSide(this);
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
    /**
     * 获取颜色
     * @param x
     * @param y
     * @returns
     */
    getColor(x, y) {
        let colorId;
        if (x < 0 || this.dataSrc.imgWidth <= x || y < 0 || this.dataSrc.imgHeight <= y) {
            colorId = 0;
        }
        else {
            let idx = y * this.dataSrc.imgWidth + x;
            colorId = this.dataSrc.binXYToColor[idx];
        }
        ;
        // 返回颜色索引
        return this.dataSrc.mapIdToColor.get(colorId).idx;
    }
    /**
     * 获取角的裁切类型
     * @param posCurrentX
     * @param posCurrentY
     */
    getCornerType(posCurrentX, posCurrentY, vecForwardX, vecForwardY, vecRightX, vecRightY) {
        this.posCurrentX = posCurrentX;
        this.posCurrentY = posCurrentY;
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
        this.colorCurrent = this.getColor(posCurrentX, posCurrentY);
        this.colorForward = this.getColor(posForwardX, posForwardY);
        this.colorBack = this.getColor(posBackX, posBackY);
        this.colorRight = this.getColor(posRightX, posRightY);
        this.colorLeft = this.getColor(posLeftX, posLeftY);
        this.colorRF = this.getColor(posRFX, posRFY);
        this.colorLF = this.getColor(posLFX, posLFY);
        this.colorRB = this.getColor(posRBX, posRBY);
        this.colorLB = this.getColor(posLBX, posLBY);
        this.enter(this.statusIdle);
        let cornerType = this.currStatus.onGetCornerType();
        return cornerType;
    }
}
export default CornerMachine;

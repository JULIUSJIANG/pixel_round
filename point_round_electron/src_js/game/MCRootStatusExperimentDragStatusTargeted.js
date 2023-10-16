import IndexGlobal from "../IndexGlobal.js";
import MgrData from "../mgr/MgrData.js";
import MCRootStatusExperimentDragStatus from "./MCRootStatusExperimentDragStatus.js";
class MCRootStatusExperimentDragStatusTargeted extends MCRootStatusExperimentDragStatus {
    onEnter() {
        for (let i = 0; i < IndexGlobal.inst.expListImg.length; i++) {
            let expImg = IndexGlobal.inst.expListImg[i];
            if (expImg == this.relMachine.dragTargetStart) {
                this.idxStart = i;
            }
            ;
            if (expImg == this.relMachine.dragTargetHover) {
                this.idxHover = i;
            }
            ;
        }
        ;
        if (this.idxStart < this.idxHover) {
            for (let i = this.idxStart; i < this.idxHover; i++) {
                let dbListImgI = IndexGlobal.inst.expListImg[i];
                let dbListImgINext = IndexGlobal.inst.expListImg[i + 1];
                dbListImgI.maskCurrStatus.onMaskEnable(dbListImgINext);
            }
            ;
        }
        ;
        if (this.idxHover < this.idxStart) {
            for (let i = this.idxStart; this.idxHover < i; i--) {
                let dbListImgI = IndexGlobal.inst.expListImg[i];
                let dbListImgINext = IndexGlobal.inst.expListImg[i - 1];
                dbListImgI.maskCurrStatus.onMaskEnable(dbListImgINext);
            }
            ;
        }
        ;
        this.relMachine.dragTargetHover.maskCurrStatus.onMaskEnable(this.relMachine.dragTargetStart);
        MgrData.inst.callDataChange();
    }
    onTargetLeave() {
        for (let i = 0; i < IndexGlobal.inst.expListImg.length; i++) {
            let expImg = IndexGlobal.inst.expListImg[i];
            expImg.maskCurrStatus.onMaskDisable();
        }
        ;
        this.relMachine.dragEnter(this.relMachine.dargStatusHover);
        MgrData.inst.callDataChange();
    }
    onEnd() {
        for (let i = 0; i < IndexGlobal.inst.expListImg.length; i++) {
            let expImg = IndexGlobal.inst.expListImg[i];
            expImg.maskCurrStatus.onMaskDisable();
        }
        ;
        IndexGlobal.inst.expMove(this.idxStart, this.idxHover);
        this.relMachine.dragEnter(this.relMachine.dragStatusIdle);
        MgrData.inst.callDataChange();
    }
}
export default MCRootStatusExperimentDragStatusTargeted;

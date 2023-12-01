import IndexGlobal from "../IndexGlobal";
import MgrData from "../mgr/MgrData";
import MCRootStatusExperimentDragStatus from "./MCRootStatusExperimentDragStatus";

class MCRootStatusExperimentDragStatusTargeted extends MCRootStatusExperimentDragStatus {

    idxStart: number;

    idxHover: number;

    onEnter (): void {
        for (let i = 0; i < IndexGlobal.inst.expListImg.length; i++) {
            let expImg = IndexGlobal.inst.expListImg [i];
            if (expImg == this.relMachine.dragTargetStart) {
                this.idxStart = i;
            };
            if (expImg == this.relMachine.dragTargetHover) {
                this.idxHover = i;
            };
        };

        if (this.idxStart < this.idxHover) {
            for (let i = this.idxStart; i < this.idxHover; i++) {
                let dbListImgI = IndexGlobal.inst.expListImg [i];
                let dbListImgINext = IndexGlobal.inst.expListImg [i + 1];
                dbListImgI.maskCurrStatus.onMaskEnable (dbListImgINext);
            };
        };
        if (this.idxHover < this.idxStart) {
            for (let i = this.idxStart; this.idxHover < i; i--) {
                let dbListImgI = IndexGlobal.inst.expListImg [i];
                let dbListImgINext = IndexGlobal.inst.expListImg [i - 1];
                dbListImgI.maskCurrStatus.onMaskEnable (dbListImgINext);
            };
        };
        this.relMachine.dragTargetHover.maskCurrStatus.onMaskEnable (this.relMachine.dragTargetStart);
        MgrData.inst.callDataChange ();
    }

    onTargetLeave (): void {
        for (let i = 0; i < IndexGlobal.inst.expListImg.length; i++) {
            let expImg = IndexGlobal.inst.expListImg [i];
            expImg.maskCurrStatus.onMaskDisable ();
        };
        this.relMachine.dragEnter (this.relMachine.dargStatusHover);
        MgrData.inst.callDataChange ();
    }

    onEnd (): void {
        for (let i = 0; i < IndexGlobal.inst.expListImg.length; i++) {
            let expImg = IndexGlobal.inst.expListImg [i];
            expImg.maskCurrStatus.onMaskDisable ();
        };
        IndexGlobal.inst.expMove (this.idxStart, this.idxHover);
        this.relMachine.dragEnter (this.relMachine.dragStatusIdle);
        MgrData.inst.callDataChange ();
    }
}

export default MCRootStatusExperimentDragStatusTargeted;
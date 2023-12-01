import IndexGlobal from "../IndexGlobal";
import MgrData from "../mgr/MgrData";
import MCRootStatusDrawingBoardDragStatus from "./MCRootStatusDrawingBoardDragStatus";

class MCRootStatusDrawingBoardDragStatusTargeted extends MCRootStatusDrawingBoardDragStatus {

    idxStart: number;

    idxHover: number;

    onEnter (): void {


        for (let i = 0; i < IndexGlobal.inst.dbListImg.length; i++) {
            let dbImg = IndexGlobal.inst.dbListImg [i];
            if (dbImg == this.relMachine.dragTargetStart) {
                this.idxStart = i;
            };
            if (dbImg == this.relMachine.dragTargetHover) {
                this.idxHover = i;
            };
        };

        if (this.idxStart < this.idxHover) {
            for (let i = this.idxStart; i < this.idxHover; i++) {
                let dbListImgI = IndexGlobal.inst.dbListImg [i];
                let dbListImgINext = IndexGlobal.inst.dbListImg [i + 1];
                dbListImgI.maskCurrStatus.onMaskEnable (dbListImgINext);
            };
        };
        if (this.idxHover < this.idxStart) {
            for (let i = this.idxStart; this.idxHover < i; i--) {
                let dbListImgI = IndexGlobal.inst.dbListImg [i];
                let dbListImgINext = IndexGlobal.inst.dbListImg [i - 1];
                dbListImgI.maskCurrStatus.onMaskEnable (dbListImgINext);
            };
        };
        this.relMachine.dragTargetHover.maskCurrStatus.onMaskEnable (this.relMachine.dragTargetStart);
        MgrData.inst.callDataChange ();
    }

    onTargetEnterLeave (): void {
        for (let i = 0; i < IndexGlobal.inst.dbListImg.length; i++) {
            let dbImg = IndexGlobal.inst.dbListImg [i];
            dbImg.maskCurrStatus.onMaskDisable ();
        };
        this.relMachine.dragEnter (this.relMachine.dargStatusHover);
        MgrData.inst.callDataChange ();
    }

    onEnd (): void {
        for (let i = 0; i < IndexGlobal.inst.dbListImg.length; i++) {
            let dbImg = IndexGlobal.inst.dbListImg [i];
            dbImg.maskCurrStatus.onMaskDisable ();
        };
        IndexGlobal.inst.dbMove (this.idxStart, this.idxHover);
        this.relMachine.dragEnter (this.relMachine.dragStatusIdle);
        MgrData.inst.callDataChange ();
    }
}

export default MCRootStatusDrawingBoardDragStatusTargeted;
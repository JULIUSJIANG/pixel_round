import MgrRes from "../mgr/MgrRes";
import MgrResAssetsImage from "../mgr/MgrResAssetsImage";
import MCRootStatusExperimentDetailStatusCreateStatus from "./MCRootStatusExperimentDetailStatusCreateStatus";

export default class MCRootStatusExperimentDetailStatusCreateStatusLoading extends MCRootStatusExperimentDetailStatusCreateStatus {

    dataUrl: string;

    img: MgrResAssetsImage;

    listenIdLoadFinished: number;

    onEnter (): void {
        this.img = MgrRes.inst.getImg (this.dataUrl);
        if (this.img.currStatus == this.img.statusFinished) {
            this.transfer ();
        }
        else {
            this.listenIdLoadFinished = this.img.evterFinished.on (() => {
                this.transfer ();
            });
        };
    }

    transfer () {
        this.relMachine.img = this.img;
        this.relMachine.enter (this.relMachine.statusIdle);
    }

    onExit (): void {
        this.img.evterFinished.off (this.listenIdLoadFinished);
    }

    onUploading (uid: string): void {
        this.relMachine.statusUploading.targetUid = uid;
        this.relMachine.enter (this.relMachine.statusUploading);
    }

    onDraggerTxt () {
        return `加载中...`;
    }
}
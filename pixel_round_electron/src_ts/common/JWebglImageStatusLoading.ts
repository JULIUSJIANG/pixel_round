import JWebglImageStatus from "./JWebglImageStatus.js";

class JWebglImageStatusLoading extends JWebglImageStatus {

    listenIdLoadFinished: number;

    onEnter (): void {
        this.listenIdLoadFinished = this.relImg.assetsImg.evterFinished.on (() => {
            this.relImg.enter (this.relImg.statusFinished);
        });
    }

    onExit (): void {
        this.relImg.assetsImg.evterFinished.off (this.listenIdLoadFinished);
    }
}

export default JWebglImageStatusLoading;
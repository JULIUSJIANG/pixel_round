import JWebglImageStatus from "./JWebglImageStatus.js";
class JWebglImageStatusLoading extends JWebglImageStatus {
    onEnter() {
        this.listenIdLoadFinished = this.relImg.assetsImg.evterFinished.on(() => {
            this.relImg.enter(this.relImg.statusFinished);
        });
    }
    onExit() {
        this.relImg.assetsImg.evterFinished.off(this.listenIdLoadFinished);
    }
}
export default JWebglImageStatusLoading;

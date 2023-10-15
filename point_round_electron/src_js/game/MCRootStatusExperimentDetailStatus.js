export default class MCRootStatusExperimentDetailStatus {
    constructor(machine, id) {
        this.relMachine = machine;
        this.id = id;
        this.relMachine.detailListStatus.push(this);
        this.relMachine.detailMapIdToStatus.set(this.id, this);
    }
    onEnter() {
    }
    onExit() {
    }
    onRender() {
        return null;
    }
    onCreate() {
    }
    onImg(id) {
    }
}

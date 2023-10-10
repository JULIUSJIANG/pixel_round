export default class MCRootStatusExperimentStatus {
    constructor(machine, id) {
        this.relMachine = machine;
        this.id = id;
        this.relMachine.listStatus.push(this);
        this.relMachine.mapIdToStatus.set(this.id, this);
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
    onInit() {
    }
}

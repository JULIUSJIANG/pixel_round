import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MCRootStatusExperiment from "./MCRootStatusExperiment.js";

export default class MCRootStatusExperimentStatus {

    relMachine: MCRootStatusExperiment;

    id: number;
    
    constructor (machine: MCRootStatusExperiment, id: number) {
        this.relMachine = machine;
        this.id = id;

        this.relMachine.listStatus.push (this);
        this.relMachine.mapIdToStatus.set (this.id, this);
    }

    onEnter () {

    }

    onExit () {
        
    }

    onRender (): ReactComponentExtendInstance {
        return null;
    }

    onCreate () {

    }

    onImg (id: number) {

    }

    onInit () {
        
    }
}
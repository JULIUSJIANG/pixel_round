import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance";
import MCRootStatusExperiment from "./MCRootStatusExperiment";

export default class MCRootStatusExperimentDetailStatus {

    relMachine: MCRootStatusExperiment;

    id: number;
    
    constructor (machine: MCRootStatusExperiment, id: number) {
        this.relMachine = machine;
        this.id = id;

        this.relMachine.detailListStatus.push (this);
        this.relMachine.detailMapIdToStatus.set (this.id, this);
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

    onImg () {

    }
}
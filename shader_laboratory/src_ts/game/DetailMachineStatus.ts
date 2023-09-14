import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import DetailMachine from "./DetailMachine.js";

export default class DetailMachineStatus {

    relMachine: DetailMachine;

    id: number;
    
    constructor (machine: DetailMachine, id: number) {
        this.relMachine = machine;
        this.id = id;
    }

    onEnter () {

    }

    onExit () {
        
    }

    onRender (): ReactComponentExtendInstance {
        return null;
    }
}
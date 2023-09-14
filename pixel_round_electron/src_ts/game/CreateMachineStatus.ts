import CreateMachine from "./CreateMachine.js";

export default class CreateMachineStatus {

    relMachine: CreateMachine;

    constructor (relMachine: CreateMachine) {
        this.relMachine = relMachine;
    }

    onEnter () {

    }

    onExit () {

    }

    onUploading (uid: string) {

    }

    onDone (uid: string, dataUrl: string) {

    }

    onDraggerTxt () {
        return `拖拽文件到这里或通过点击选择文件`;
    }
}
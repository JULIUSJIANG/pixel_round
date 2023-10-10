import MCRootStatusExperimentStatusCreate from "./MCRootStatusExperimentStatusCreate.js";

export default class MCRootStatusExperimentStatusCreateStatus {

    relMachine: MCRootStatusExperimentStatusCreate;

    constructor (relMachine: MCRootStatusExperimentStatusCreate) {
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
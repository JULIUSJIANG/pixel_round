import DomDrawingBoardRightPaintCanvasSource from "../ui/DomDrawingBoardRightPaintCanvasSource.js";
import MCRootStatusDrawingBoard from "./MCRootStatusDrawingBoard.js";

/**
 * 根状态机 - 状态 - 画板模式 - 操作状态
 */
class MCRootStatusDrawingBoardOpStatus {

    relMachine: MCRootStatusDrawingBoard;

    id: number;

    name: string;

    constructor (relMachine: MCRootStatusDrawingBoard, id: number, name: string) {
        this.relMachine = relMachine;
        this.id = id;
        this.name = name;
        this.relMachine.opListStatus.push (this);
        this.relMachine.opMapIdToStatus.set (this.id, this);
    }

    /**
     * 事件派发 - 进入状态
     */
    onEnter () {

    }

    /**
     * 事件派发 - 离开状态
     */
    onExit () {

    }

    /**
     * 更新状态
     */
    onUpdate (dataSrc: DomDrawingBoardRightPaintCanvasSource, x: number, y: number, w: number, h: number) {

    }
}

export default MCRootStatusDrawingBoardOpStatus;
import IndexGlobal from "../IndexGlobal.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MCRootStatus from "./MCRootStatus.js";
import MCRootStatusDrawingBoard from "./MCRootStatusDrawingBoard.js";
import MCRootStatusExperiment from "./MCRootStatusExperiment.js";

/**
 * 根状态机
 */
class MCRoot {

    /**
     * 归属的全局变量
     */
    relGlobal: IndexGlobal;

    /**
     * 所有状态的集合
     */
    listStatus = new Array <MCRootStatus> ();
    /**
     * 标识到状态的映射
     */
    mapIdToStatus = new Map <number, MCRootStatus> ();

    constructor (indexGlobal: IndexGlobal) {
        this.relGlobal = indexGlobal;

        this.statusDrawingBoard = new MCRootStatusDrawingBoard (this, 0, `画板模式`);
        this.statusExperiment = new MCRootStatusExperiment (this, 1, `实验模式`);
    }

    /**
     * 当前状态
     */
    currStatus: MCRootStatus;

    /**
     * 状态 - 画板
     */
    statusDrawingBoard: MCRootStatusDrawingBoard;
    /**
     * 状态 - 实验
     */
    statusExperiment: MCRootStatusExperiment;

    /**
     * 切换状态
     * @param status 
     */
    enter (status: MCRootStatus) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.onExit ();
        };
        this.currStatus.onEnter ();
        MgrData.inst.set (MgrDataItem.MC_ROOT_STATUS, this.currStatus.id);
    }

    /**
     * 事件派发 - 初始化
     */
    onInit () {
        for (let i = 0; i < this.listStatus.length; i++) {
            let listStatusI = this.listStatus [i];
            listStatusI.onInit ();
        };

        this.enter (this.mapIdToStatus.get (MgrData.inst.get (MgrDataItem.MC_ROOT_STATUS)));
    }
}

export default MCRoot;
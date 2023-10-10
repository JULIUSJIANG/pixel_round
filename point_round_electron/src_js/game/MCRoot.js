import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MCRootStatusDrawingBoard from "./MCRootStatusDrawingBoard.js";
import MCRootStatusExperiment from "./MCRootStatusExperiment.js";
/**
 * 根状态机
 */
class MCRoot {
    constructor(indexGlobal) {
        /**
         * 所有状态的集合
         */
        this.listStatus = new Array();
        /**
         * 标识到状态的映射
         */
        this.mapIdToStatus = new Map();
        this.relGlobal = indexGlobal;
        this.statusDrawingBoard = new MCRootStatusDrawingBoard(this, 0);
        this.statusExperiment = new MCRootStatusExperiment(this, 1);
    }
    /**
     * 切换状态
     * @param status
     */
    enter(status) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.onExit();
        }
        ;
        this.currStatus.onEnter();
    }
    /**
     * 事件派发 - 初始化
     */
    onInit() {
        for (let i = 0; i < this.listStatus.length; i++) {
            let listStatusI = this.listStatus[i];
            listStatusI.onInit();
        }
        ;
        this.enter(this.mapIdToStatus.get(MgrData.inst.get(MgrDataItem.MC_ROOT_STATUS)));
    }
}
export default MCRoot;

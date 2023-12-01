import Eventer from "../common/Eventer";
import MgrResAssetsStatus from "./MgrResAssetsStatus";
import MgrResAssetsStatusFinished from "./MgrResAssetsStatusFinished";
import MgrResAssetsStatusLoading from "./MgrResAssetsStatusLoading";

/**
 * 资源数据
 */
export default class MgrResAssets {
    
    /**
     * 状态 - 加载中
     */
    statusLoading: MgrResAssetsStatusLoading;
    /**
     * 状态 - 完成
     */
    statusFinished: MgrResAssetsStatusFinished;

    constructor () {
        this.statusLoading = new MgrResAssetsStatusLoading (this);
        this.statusFinished = new MgrResAssetsStatusFinished (this);
        this.enter (this.statusLoading);
    }

    /**
     * 当前状态
     */
    currStatus: MgrResAssetsStatus;

    /**
     * 事件派发器 - 加载完成
     */
    evterFinished = new Eventer <any> ();

    /**
     * 切换加载状态
     * @param status 
     */
    enter (status: MgrResAssetsStatus) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec != null) {
            rec.onExit ();
        };
        this.currStatus.onEnter ();
    }
}
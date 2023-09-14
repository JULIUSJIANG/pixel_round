import Eventer from "../common/Eventer.js";
import MgrResAssetsStatusFinished from "./MgrResAssetsStatusFinished.js";
import MgrResAssetsStatusLoading from "./MgrResAssetsStatusLoading.js";
/**
 * 资源数据
 */
export default class MgrResAssets {
    constructor() {
        /**
         * 事件派发器 - 加载完成
         */
        this.evterFinished = new Eventer();
        this.statusLoading = new MgrResAssetsStatusLoading(this);
        this.statusFinished = new MgrResAssetsStatusFinished(this);
        this.enter(this.statusLoading);
    }
    /**
     * 切换加载状态
     * @param status
     */
    enter(status) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec != null) {
            rec.onExit();
        }
        ;
        this.currStatus.onEnter();
    }
}

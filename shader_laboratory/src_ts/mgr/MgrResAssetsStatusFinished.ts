import MgrData from "./MgrData.js";
import MgrResAssetsStatus from "./MgrResAssetsStatus.js";

/**
 * 资源数据 - 状态 - 加载完成
 */
export default class MgrResAssetsStatusFinished extends MgrResAssetsStatus {

    onEnter (): void {
        this.relAssets.evterFinished.call (null);
        MgrData.inst.callDataChange ();
    }
}
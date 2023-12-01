import MgrData from "./MgrData";
import MgrResAssetsStatus from "./MgrResAssetsStatus";

/**
 * 资源数据 - 状态 - 加载完成
 */
export default class MgrResAssetsStatusFinished extends MgrResAssetsStatus {

    onEnter (): void {
        this.relAssets.evterFinished.call (null);
        MgrData.inst.callDataChange ();
    }
}
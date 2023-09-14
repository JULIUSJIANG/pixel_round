import MgrResAssetsStatus from "./MgrResAssetsStatus.js";
/**
 * 资源数据 - 状态 - 加载中
 */
export default class MgrResAssetsStatusLoading extends MgrResAssetsStatus {
    onLoadFinish() {
        this.relAssets.enter(this.relAssets.statusFinished);
    }
}

import MgrResAssetsStatus from "./MgrResAssetsStatus";

/**
 * 资源数据 - 状态 - 加载中
 */
export default class MgrResAssetsStatusLoading extends MgrResAssetsStatus {

    onLoadFinish (): void {
        this.relAssets.enter (this.relAssets.statusFinished);
    }
}
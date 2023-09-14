import MgrSdkCoreElectron from "./MgrSdkCoreElectron.js";
/**
 * 针对不同运行环境做兼容处理
 */
class MgrSdk {
    /**
     * 初始化
     */
    init() {
        this.core = new MgrSdkCoreElectron();
        return Promise.resolve();
    }
}
(function (MgrSdk) {
    /**
     * 全局实例
     */
    MgrSdk.inst = new MgrSdk();
})(MgrSdk || (MgrSdk = {}));
export default MgrSdk;

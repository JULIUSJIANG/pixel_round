import MgrSdkCore from "./MgrSdkCore.js";
import MgrSdkCoreElectron from "./MgrSdkCoreElectron.js";

/**
 * 针对不同运行环境做兼容处理
 */
class MgrSdk {

    /**
     * 当前策略
     */
    core: MgrSdkCore;

    /**
     * 初始化
     */
    init () {
        this.core = new MgrSdkCoreElectron ();
        return Promise.resolve ();
    }
}

namespace MgrSdk {
    /**
     * 全局实例
     */
    export const inst = new MgrSdk ();
}

export default MgrSdk;
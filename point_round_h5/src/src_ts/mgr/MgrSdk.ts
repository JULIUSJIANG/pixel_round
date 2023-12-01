import MgrSdkCore from "./MgrSdkCore";
import MgrsdkcoreH5 from "./MgrSdkCoreH5";

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
        this.core = new MgrsdkcoreH5 ();
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
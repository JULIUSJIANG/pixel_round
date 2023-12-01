import MgrSdkCtxGet from "./MgrSdkCtxGet";
import MgrSdkCtxSet from "./MgrSdkCtxSet";
import MgrSdkCtxLogToMain from "./MgrSdkCtxLogToMain";
import MgrSdkCtxSaveFile from "./MgrSdkCtxSaveFile";

/**
 * 针对不同运行环境做兼容处理 - 策略
 */
abstract class MgrSdkCore {
    /**
     * 存档
     * @param txt 
     */
    abstract set (txt: string): Promise <MgrSdkCtxSet>;
    /**
     * 取档
     */
    abstract get (): Promise <MgrSdkCtxGet>;
    /**
     * 打印日志
     */
    abstract logToMain (txt: string): Promise <MgrSdkCtxLogToMain>;
    /**
     * 保存文件
     * @param fileName 
     * @param dataUrl 
     */
    abstract saveFile (fileName: string, dataUrl: string): Promise <MgrSdkCtxSaveFile>;
    /**
     * 打开调试工具
     */
    abstract openDebugTools ();
    /**
     * 通知服务端已被销毁
     */
    abstract callDestoried ();
}

export default MgrSdkCore;
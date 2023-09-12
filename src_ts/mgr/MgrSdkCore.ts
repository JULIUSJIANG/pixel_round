import MgrSdkCtxGet from "./MgrSdkCtxGet.js";
import MgrSdkCtxSet from "./MgrSdkCtxSet.js";
import MgrSdkCtxLogToMain from "./MgrSdkCtxLogToMain.js";
import MgrSdkCtxSaveFile from "./MgrSdkCtxSaveFile.js";
import MgrSdkCtxGetFile from "./MgrSdkCtxGetFile.js";

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
}

export default MgrSdkCore;
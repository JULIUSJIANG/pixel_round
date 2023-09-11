import MgrSdkCore from "./MgrSdkCore.js";
import NodeModules from "../NodeModules.js";
/**
 * 存档路径
 */
const STORAGE_PATH = NodeModules.path.join(`c_sdk_core_electron_storage.json`);
/**
 * 主进程希望渲染进程做的异步事情以及渲染进程希望主进程做的异步事情都定义在里面
 * IndexMain 中定义的 ActionRequest 与该 ActionRequest 不一样，具体表现为 “非自己需要实现的 analyse，都直接是 null”
 * 简单而言 ActionRequest 作为协议，统一主进程、渲染进程对于对方的要求
 */
class MgrSdkCoreElectronRequest {
    constructor(args) {
        this.code = args.code;
        this.analyse = args.analyse;
        MgrSdkCoreElectronRequest.mapCodeToRequest.set(this.code, this);
    }
}
(function (MgrSdkCoreElectronRequest) {
    ;
    /**
     * 由主进程主动发起的流程上的所有事件名称
     */
    MgrSdkCoreElectronRequest.EVT_NAME_SERVER_ACTIVE = `EVT_NAME_SERVER_ACTIVE`;
    /**
     * 由渲染进程主动发起的流程上的所有事件名称
     */
    MgrSdkCoreElectronRequest.EVT_NAME_CLIENT_ACTIVE = `EVT_NAME_CLIENT_ACTIVE`;
    /**
     * 代号到具体策略的映射
     */
    MgrSdkCoreElectronRequest.mapCodeToRequest = new Map();
    ;
    ;
    /**
     * 客户端通知 - 打印日志
     */
    MgrSdkCoreElectronRequest.CLIENT_FETCH_LOG = new MgrSdkCoreElectronRequest({
        code: 1002,
        analyse: null
    });
    ;
    ;
    MgrSdkCoreElectronRequest.CLIENT_FETCH_SAVE = new MgrSdkCoreElectronRequest({
        code: 1003,
        analyse: null
    });
    ;
    ;
    MgrSdkCoreElectronRequest.CLIENT_FETCH_OPEN_CONSOLE = new MgrSdkCoreElectronRequest({
        code: 1004,
        analyse: null
    });
})(MgrSdkCoreElectronRequest || (MgrSdkCoreElectronRequest = {}));
NodeModules.electron.ipcRenderer.on(MgrSdkCoreElectronRequest.EVT_NAME_SERVER_ACTIVE, (evt, args) => {
    // 解析得到具体策略
    let action = MgrSdkCoreElectronRequest.mapCodeToRequest.get(args.code);
    // 让策略处理
    action.analyse(args.data)
        .then((resp) => {
        // 返回最终结果
        NodeModules.electron.ipcRenderer.send(MgrSdkCoreElectronRequest.EVT_NAME_SERVER_ACTIVE, resp);
    });
});
/**
 * 针对不同运行环境做兼容处理 - 策略 - electron
 */
class MgrSdkCoreElectron extends MgrSdkCore {
    set(txt) {
        let folder = NodeModules.path.dirname(STORAGE_PATH);
        return Promise.resolve()
            // 检查文件目录是否存在
            .then(() => {
            return new Promise((resolve) => {
                NodeModules.fs.stat(folder, (err, stat) => {
                    if (err) {
                        resolve(false);
                        return;
                    }
                    ;
                    resolve(true);
                });
            });
        })
            // 目录不存在的话，就新建一个
            .then((isExist) => {
            if (isExist) {
                return;
            }
            ;
            return new Promise((resolve, reject) => {
                NodeModules.fs.mkdir(folder, {
                    recursive: true
                }, (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    ;
                    resolve(null);
                });
            });
        })
            // 正式写入文件
            .then(() => {
            return new Promise((resolve, reject) => {
                NodeModules.fs.writeFile(STORAGE_PATH, txt, (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    ;
                    resolve({
                        isSuccessed: true
                    });
                });
            });
        })
            // 有任何异常，视为执行失败
            .catch((err) => {
            console.log(`存档失败`, err);
            return Promise.resolve({
                isSuccessed: false
            });
        });
    }
    get() {
        return new Promise((resolve) => {
            NodeModules.fs.readFile(STORAGE_PATH, (err, data) => {
                if (err) {
                    resolve({
                        isSuccessed: false,
                        txt: null
                    });
                    return;
                }
                ;
                resolve({
                    isSuccessed: true,
                    txt: data.toString()
                });
            });
        });
    }
    logToMain(txt) {
        return this.fetch(MgrSdkCoreElectronRequest.CLIENT_FETCH_LOG, {
            txt
        })
            .then(() => {
            return {
                isSuccessed: true
            };
        });
    }
    saveFile(fileName, dataUrl) {
        return this.fetch(MgrSdkCoreElectronRequest.CLIENT_FETCH_SAVE, {
            fileName: fileName,
            fileUrl: dataUrl
        })
            .then(() => {
            return {
                isSuccessed: true
            };
        });
    }
    /**
     * 告知服务端
     * @param action
     * @param i
     */
    fetch(action, i) {
        let msg = {
            code: action.code,
            data: i
        };
        NodeModules.electron.ipcRenderer.send(MgrSdkCoreElectronRequest.EVT_NAME_CLIENT_ACTIVE, msg);
        return new Promise((resolve) => {
            NodeModules.electron.ipcRenderer.once(MgrSdkCoreElectronRequest.EVT_NAME_CLIENT_ACTIVE, (evt, resp) => {
                resolve(resp);
            });
        });
    }
}
export default MgrSdkCoreElectron;

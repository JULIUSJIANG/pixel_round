const _electron = require (`electron`);
const {app, BrowserWindow, dialog} = _electron;
const path = require (`path`);

/**
 * 异步请求
 */
class MgrSdkCoreElectronRequest<TInput, TOutput> {
    /**
     * 代号
     */
    code: number;
    /**
     * 处理器
     */
    analyse: (i: TInput) => Promise <TOutput>;

    constructor (args: {
        code: number,
        analyse: (i: TInput) => Promise <TOutput>
    })
    {
        this.code = args.code;
        this.analyse = args.analyse;

        MgrSdkCoreElectronRequest.mapCodeToRequest.set (this.code, this);
    }
}

namespace MgrSdkCoreElectronRequest {
    /**
     * 请求体
     */
    export interface Ctx {
        /**
         * 策略代号
         */
        code: number;
        /**
         * 策略需要的数据
         */
        data: any;
    };

    /**
     * 服务端监听的事件名
     */
    export const EVT_NAME_SERVER_ACTIVE = `EVT_NAME_SERVER_ACTIVE`;
    /**
     * 客户端监听的事件名
     */
    export const EVT_NAME_CLIENT_ACTIVE = `EVT_NAME_CLIENT_ACTIVE`;

    /**
     * 代号到具体策略的映射
     */
    export const mapCodeToRequest: Map <number, MgrSdkCoreElectronRequest <unknown, unknown>> = new Map ();

    export interface ClientFetchLogInput {
        txt: string
    };
    export interface ClientFetchLogOutput {

    };
    /**
     * 客户端通知 - 打印日志
     */
    export const CLIENT_FETCH_LOG = new MgrSdkCoreElectronRequest <ClientFetchLogInput, ClientFetchLogOutput> ({
        code: 1002,
        analyse: (ctx) => {
            console.log (ctx.txt);
            return Promise.resolve ({});
        }
    });

    export interface ClientFetchSaveInput {
        /**
         * 文件名
         */
        fileName: string;
        /**
         * 文件数据
         */
        fileUrl: string;
    };
    export interface ClientFetchSaveOutput {

    };
    export const CLIENT_FETCH_SAVE = new MgrSdkCoreElectronRequest <ClientFetchSaveInput, ClientFetchSaveOutput> ({
        code: 1003,
        analyse: (ctx) => {
            let filters = [
                {
                    name: `全部文件`,
                    extensions: [
                        `*`
                    ]
                }
            ];
            let ext = path.extname (ctx.fileName);
            if (ext && ext !== `.`) {
                const name = ext.slice (1, ext.length);
                if (name) {
                    filters.unshift ({
                        name: ``,
                        extensions: [
                            name
                        ]
                    });
                };
            };

            return Promise.resolve ()
                .then (() => {
                    return dialog.showSaveDialog (
                        win,
                        {
                            title: `另存为`,
                            filters,
                            defaultPath: ctx.fileName
                        }
                    );
                })
                .then ((result) => {
                    filePath = result.filePath;
                    if (filePath) {
                        win.webContents.downloadURL (ctx.fileUrl);
                    };
                    return {};
                });
        }
    });

    export interface ClientFetchOpenConsoleI {

    };
    export interface ClientFetchOpenConsoleO {

    };
    export const CLIENT_FETCH_OPEN_CONSOLE = new MgrSdkCoreElectronRequest <ClientFetchOpenConsoleI, ClientFetchOpenConsoleO> ({
        code: 1004,
        analyse: (ctx) => {
            win.webContents.openDevTools ();
            return Promise.resolve ({});
        }
    });
}

let win;
let filePath: string;
const createWindow = () => {
    win = new BrowserWindow ({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    win.maximize();
    win.setMenu (null);
    win.loadFile (`./src_js/IndexWindow.html`);
    win.openDevTools ();

    win.webContents.session.on (
        'will-download', 
        (event, item, webContents) => {
        if (!filePath) {
            return;
        };
        //设置下载项的保存文件路径
        item.setSavePath(filePath);
    });
}

Promise.resolve ()
    // 等待环境就绪
    .then (() => {
        return app.whenReady ();
    })
    .then (() => {
        createWindow ();
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                createWindow();
            };
        });
        app.on (`window-all-closed`, () => {
            if (process.platform !== `darwin`) {
                Promise.resolve ()
                    // 正式退出
                    .then (() => {
                        app.quit ();
                    });
            };
        });
    });

_electron.ipcMain.on (
    MgrSdkCoreElectronRequest.EVT_NAME_CLIENT_ACTIVE,
    (
        evt,
        args
    ) =>
    {
        // 解析得到具体策略
        let action = MgrSdkCoreElectronRequest.mapCodeToRequest.get (args.code);
        // 让策略处理
        action.analyse (args.data)
            .then ((resp) => {
                // 返回最终结果
                win.webContents.send (MgrSdkCoreElectronRequest.EVT_NAME_CLIENT_ACTIVE, resp);
    });
    }
);

class IndexMain {
    
}

namespace IndexMain {
    /**
     * 告知客户端
     * @param action 
     * @param i 
     * @returns 
     */
    export function fetch <TInput, TOutput> (
        action,
        i: TInput
    ) 
    {
        let msg = {
            code: action.code,
            data: i
        };
        win.webContents.send (MgrSdkCoreElectronRequest.EVT_NAME_SERVER_ACTIVE, msg);
        return new Promise <TOutput> ((resolve) => {
            _electron.ipcMain.once (
                MgrSdkCoreElectronRequest.EVT_NAME_SERVER_ACTIVE,
                (
                    evt,
                    resp: TOutput
                ) =>
                {
                    resolve (resp);
                }
            );
        });
    }
};
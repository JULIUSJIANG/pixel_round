const _electron = require(`electron`);
const _fs = require(`fs`);
const { app, BrowserWindow, dialog } = _electron;
const path = require(`path`);
/**
 * 异步请求
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
     * 服务端监听的事件名
     */
    MgrSdkCoreElectronRequest.EVT_NAME_SERVER_ACTIVE = `EVT_NAME_SERVER_ACTIVE`;
    /**
     * 客户端监听的事件名
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
        analyse: (ctx) => {
            console.log(ctx.txt);
            return Promise.resolve({});
        }
    });
    ;
    ;
    MgrSdkCoreElectronRequest.CLIENT_FETCH_SAVE_FILE = new MgrSdkCoreElectronRequest({
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
            let ext = path.extname(ctx.fileName);
            if (ext && ext !== `.`) {
                const name = ext.slice(1, ext.length);
                if (name) {
                    filters.unshift({
                        name: ``,
                        extensions: [
                            name
                        ]
                    });
                }
                ;
            }
            ;
            return Promise.resolve()
                .then(() => {
                return dialog.showSaveDialog(win, {
                    title: `另存为`,
                    filters,
                    defaultPath: ctx.fileName
                });
            })
                .then((result) => {
                filePath = result.filePath;
                if (filePath) {
                    win.webContents.downloadURL(ctx.fileUrl);
                }
                ;
                return {};
            });
        }
    });
    ;
    ;
    MgrSdkCoreElectronRequest.CLIENT_FETCH_OPEN_CONSOLE = new MgrSdkCoreElectronRequest({
        code: 1004,
        analyse: (ctx) => {
            win.webContents.openDevTools();
            return Promise.resolve({});
        }
    });
    ;
    ;
    MgrSdkCoreElectronRequest.CLIENT_FETCH_SAVE_TXT = new MgrSdkCoreElectronRequest({
        code: 1005,
        analyse: (ctx) => {
            return new Promise((resolve, reject) => {
                _fs.writeFile(ctx.fileName, ctx.txt, (err) => {
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
        }
    });
    ;
    ;
    MgrSdkCoreElectronRequest.CLIENT_FETCH_DEBUG = new MgrSdkCoreElectronRequest({
        code: 1006,
        analyse: (ctx) => {
            win.openDevTools();
            return Promise.resolve({});
        }
    });
    ;
    ;
    MgrSdkCoreElectronRequest.CLIENT_FETCH_DESTORIED = new MgrSdkCoreElectronRequest({
        code: 1007,
        analyse: (ctx) => {
            isDestoried = true;
            return Promise.resolve({});
        }
    });
})(MgrSdkCoreElectronRequest || (MgrSdkCoreElectronRequest = {}));
let win;
let filePath;
const createWindow = () => {
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    win.maximize();
    win.setMenu(null);
    win.loadFile(`./src_js/IndexWindow.html`);
    win.openDevTools();
    win.webContents.session.on('will-download', (event, item, webContents) => {
        if (!filePath) {
            return;
        }
        ;
        //设置下载项的保存文件路径
        item.setSavePath(filePath);
    });
};
Promise.resolve()
    // 等待环境就绪
    .then(() => {
    return app.whenReady();
})
    .then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
        ;
    });
    app.on(`window-all-closed`, () => {
        if (process.platform !== `darwin`) {
            Promise.resolve()
                // 正式退出
                .then(() => {
                app.quit();
            });
        }
        ;
    });
});
let isDestoried = false;
_electron.ipcMain.on(MgrSdkCoreElectronRequest.EVT_NAME_CLIENT_ACTIVE, (evt, args) => {
    // 解析得到具体策略
    let action = MgrSdkCoreElectronRequest.mapCodeToRequest.get(args.code);
    // 让策略处理
    action.analyse(args.data)
        .then((resp) => {
        if (isDestoried) {
            return;
        }
        ;
        // 返回最终结果
        win.webContents.send(MgrSdkCoreElectronRequest.EVT_NAME_CLIENT_ACTIVE, resp);
    });
});
class IndexMain {
}
(function (IndexMain) {
    /**
     * 告知客户端
     * @param action
     * @param i
     * @returns
     */
    function fetch(action, i) {
        let msg = {
            code: action.code,
            data: i
        };
        win.webContents.send(MgrSdkCoreElectronRequest.EVT_NAME_SERVER_ACTIVE, msg);
        return new Promise((resolve) => {
            _electron.ipcMain.once(MgrSdkCoreElectronRequest.EVT_NAME_SERVER_ACTIVE, (evt, resp) => {
                resolve(resp);
            });
        });
    }
    IndexMain.fetch = fetch;
})(IndexMain || (IndexMain = {}));
;

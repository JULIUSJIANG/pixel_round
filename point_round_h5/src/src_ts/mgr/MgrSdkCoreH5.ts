import MgrSdkCore from "./MgrSdkCore";

const STORAGE_KEY = `MgrsdkcoreH5_5`;

/**
 * h5 底下的策略
 */
class MgrsdkcoreH5 extends MgrSdkCore {
    set (txt: string) {
        localStorage.clear ();
        localStorage.setItem (STORAGE_KEY, txt);
        return Promise.resolve ({
            isSuccessed: true
        });
    }
    get () {
        return Promise.resolve ({
            isSuccessed: true,
            txt: localStorage.getItem (STORAGE_KEY) as string
        });
    }
    logToMain (txt: string) {
        console.log (txt);
        return Promise.resolve ({
            isSuccessed: true
        });
    }
    saveFile (fileName: string, dataUrl: string) {
        var a = document.createElement('a');
        a.href = dataUrl;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return Promise.resolve ({
            isSuccessed: true
        });
    }
    openDebugTools () {

    }
    callDestoried () {

    }
    consoleCtrlAble() {
        return false;
    }
}

export default MgrsdkcoreH5;
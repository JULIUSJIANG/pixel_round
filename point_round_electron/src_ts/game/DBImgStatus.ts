import DataUint8Array from "../common/DataUint8Array.js";
import objectPool from "../common/ObjectPool.js";
import ObjectPoolType from "../common/ObjectPoolType.js";
import MgrGlobal from "../mgr/MgrGlobal.js";

/**
 * 绘画数据的状态
 */
export default class DBImgStatus {
    /**
     * 核心数据
     */
    dataBin = new DataUint8Array ();
    /**
     * 宽
     */
    width: number;
    /**
     * 高
     */
    height: number;

    /**
     * base64 格式的数据
     */
    base64: string;

    /**
     * 构造实例
     * @param bin 
     * @param width 
     * @param height 
     */
    static create (bin: Uint8Array | Uint8ClampedArray, width: number, height: number) {
        let inst = objectPool.pop (DBImgStatus.poolType);
        inst.dataBin.loadData (bin);
        inst.width = width;
        inst.height = height;
        inst.base64 = MgrGlobal.inst.arrUint8ToBase64 (inst.dataBin.bin, inst.width, inst.height);
        return inst;
    }

    static poolType = new ObjectPoolType <DBImgStatus> ({
        instantiate: () => {
            return new DBImgStatus ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        }
    });
}
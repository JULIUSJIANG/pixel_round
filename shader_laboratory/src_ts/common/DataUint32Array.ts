import ObjectPoolType from "./ObjectPoolType.js";

/**
 * 字节数据
 */
export default class DataUint32Array {
    /**
     * 核心数据
     */
    bin = new Uint32Array (1);

    /**
     * 确保长度足够
     * @param len 
     */
    initLength (len: number) {
        let size = this.bin.length;
        // 尺寸不够的话，扩容
        if (size < len) {
            while (size < len) {
                size *= 2;
            };
            this.bin = new Uint32Array (len);
        };
    }

    /**
     * 载入数据
     * @param data 
     */
    loadData (data: Uint32Array) {
        this.initLength (data.length);
        for (let i = 0; i < data.length; i++) {
            this.bin [i] = data [i];
        };
    }

    static poolType = new ObjectPoolType <DataUint32Array> ({
        instantiate: () => {
            return new DataUint32Array ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        }
    });
}
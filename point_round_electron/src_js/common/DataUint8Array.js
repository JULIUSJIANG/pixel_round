/**
 * 字节数据
 */
export default class DataUint8Array {
    constructor() {
        /**
         * 核心数据
         */
        this.bin = new Uint8Array(1);
    }
    /**
     * 确保长度足够
     * @param len
     */
    initLength(len) {
        let size = this.bin.length;
        // 尺寸不够的话，扩容
        if (size < len) {
            while (size < len) {
                size *= 2;
            }
            ;
            this.bin = new Uint8Array(len);
        }
        ;
    }
    /**
     * 载入数据
     * @param data
     */
    loadData(data) {
        this.initLength(data.length);
        for (let i = 0; i < data.length; i++) {
            this.bin[i] = data[i];
        }
        ;
    }
}

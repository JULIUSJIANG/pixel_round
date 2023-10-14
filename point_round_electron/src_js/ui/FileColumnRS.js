class FileColumnRS {
    constructor(args) {
        this.id = args.id;
        this.count = args.count;
        this.name = `${this.count}`;
        FileColumnRS.listInst.push(this);
        FileColumnRS.mapIdToInst.set(this.id, this);
    }
}
(function (FileColumnRS) {
    /**
     * 全部实例
     */
    FileColumnRS.listInst = new Array();
    /**
     * 标识到实例的映射
     */
    FileColumnRS.mapIdToInst = new Map();
    /**
     * 列数控制
     */
    FileColumnRS.column1 = new FileColumnRS({
        id: 1,
        count: 1
    });
    FileColumnRS.column2 = new FileColumnRS({
        id: 2,
        count: 2
    });
    FileColumnRS.column3 = new FileColumnRS({
        id: 3,
        count: 3
    });
    FileColumnRS.column4 = new FileColumnRS({
        id: 4,
        count: 4
    });
})(FileColumnRS || (FileColumnRS = {}));
export default FileColumnRS;

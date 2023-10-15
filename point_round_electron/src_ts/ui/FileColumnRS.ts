
class FileColumnRS {

    id: number;

    count: number;

    name: string;

    constructor (args: {
        id: number,
        count: number
    }) 
    {
        this.id = args.id;
        this.count = args.count;
        this.name = `${this.count}`;

        FileColumnRS.listInst.push (this);
        FileColumnRS.mapIdToInst.set (this.id, this);
    }
}

namespace FileColumnRS {
    /**
     * 全部实例
     */
    export const listInst = new Array <FileColumnRS> ();
    /**
     * 标识到实例的映射
     */
    export const mapIdToInst = new Map <number, FileColumnRS> ();

    /**
     * 列数控制
     */
    export const column1 = new FileColumnRS ({
        id: 0,
        count: 1
    });
    export const column2 = new FileColumnRS ({
        id: 1,
        count: 2
    });
    export const column3 = new FileColumnRS ({
        id: 2,
        count: 3
    });
    export const column4 = new FileColumnRS ({
        id: 3,
        count: 4
    });
}

export default FileColumnRS;
import JWebglColor from "../common/JWebglColor.js";
import ObjectPoolType from "../common/ObjectPoolType.js";
class ColorRecord {
    constructor() {
        /**
         * 主颜色
         */
        this.colorMain = new JWebglColor();
        /**
         * 相对主颜色，能够看得清的颜色
         */
        this.colorRel = new JWebglColor();
    }
    init(id, idx, r, g, b, a) {
        this.id = id;
        this.idx = idx;
        this.colorMain.initByRGBA(r, g, b, a);
        if (a == 0) {
            this.colorRel.initByRGBA(0, 0, 0, 1);
        }
        else {
            this.colorRel.initByRGBA((r + 127 / 255) % 1, (g + 127 / 255) % 1, (b + 127 / 255) % 1, 1);
        }
        ;
    }
}
ColorRecord.poolType = new ObjectPoolType({
    instantiate: () => {
        return new ColorRecord();
    },
    onPop: (t) => {
    },
    onPush: (t) => {
    }
});
export default ColorRecord;

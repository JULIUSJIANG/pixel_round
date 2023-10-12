import JWebglColor from "../common/JWebglColor.js";
import ObjectPoolType from "../common/ObjectPoolType.js";

class TextureColor {
    /**
     * 标识
     */
    id: number;
    /**
     * 索引
     */
    idx: number;
    /**
     * 主颜色
     */
    colorMain = new JWebglColor ();
    /**
     * 相对主颜色，能够看得清的颜色
     */
    colorRel = new JWebglColor ();

    init (id: number, idx: number, r: number, g: number, b: number, a: number) {
        this.id = id;
        this.idx = idx;
        this.colorMain.initByRGBA (r, g, b, a);
        if (a == 0) {
            this.colorRel.initByRGBA (0, 0, 0, 1);
        }
        else {
            this.colorRel.initByRGBA ((r + 127 / 255) % 1, (g + 127 / 255) % 1, (b + 127 / 255) % 1, 1);
        };
    }

    static poolType = new ObjectPoolType <TextureColor> ({
        instantiate: () => {
            return new TextureColor ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {
            
        }
    });
}

export default TextureColor;
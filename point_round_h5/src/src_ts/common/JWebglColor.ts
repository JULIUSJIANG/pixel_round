import JWebglMathVector4 from "./JWebglMathVector4";
import ObjectPoolType from "./ObjectPoolType";

/**
 * 颜色
 */
class JWebglColor {
    /**
     * 数据，区间 0 - 1
     */
    data01 = new Float32Array (4);
    /**
     * 数据，区间 0 - 255
     */
    data255 = new Uint8Array (4);
    /**
     * #ffffffff 格式
     */
    str16: string;
    /**
     * css 专用的文本 - 填充
     */
    str2dText: string;

    constructor (r = 1, g = 1, b = 1, a = 1) {
        this.initByRGBA (r, g, b, a);
    }

    initByRGBA (r: number, g: number, b: number, a: number) {
        this.data255 [0] = r * 255;
        this.data255 [1] = g * 255;
        this.data255 [2] = b * 255;
        this.data255 [3] = a * 255;

        for (let i = 0; i < 4; i++) {
            this.data01 [i] = this.data255 [i] / 255;
        };
        this.str16 = `#${this.parseNumberToHex (this.data255 [0])}${this.parseNumberToHex (this.data255 [1])}${this.parseNumberToHex (this.data255 [2])}${this.parseNumberToHex (this.data255 [3])}`;
        this.str2dText = `rgba(${this.data255 [0]}, ${this.data255 [1]}, ${this.data255 [2]}, ${this.data01 [3]})`;
    }

    initByHex (hex: string) {
        let r = 1, g = 1, b = 1, a = 1;
        if (hex != null) {
            r = this.parseHexToNumber (hex [0]) * 16 + this.parseHexToNumber (hex [1]);
            r /= 255;
            g = this.parseHexToNumber (hex [2]) * 16 + this.parseHexToNumber (hex [3]);
            g /= 255;
            b = this.parseHexToNumber (hex [4]) * 16 + this.parseHexToNumber (hex [5]);
            b /= 255;
            a = this.parseHexToNumber (hex [6]) * 16 + this.parseHexToNumber (hex [7]);
            a /= 255;
        };
        this.initByRGBA (r, g, b, a);
    }

    parseNumberToHex (num: number) {
        let str = num.toString (16);
        if (str.length == 1) {
            return `0${str}`;
        };
        return str;
    }

    parseHexToNumber (hex: string) {
        if (hex == null) {
            return 15;
        };
        hex = hex.toLowerCase ();
        switch (hex) {
            case `a`: {
                return 10;
            };
            case `b`: {
                return 11;
            };
            case `c`: {
                return 12;
            };
            case `d`: {
                return 13;
            };
            case `e`: {
                return 14;
            };
            case `f`: {
                return 15;
            };
            default: {
                let val = Number.parseFloat (hex);
                if (!Number.isNaN (val)) {
                    return val;
                };
                return 15;
            };
        };
    }

    static poolType = new ObjectPoolType ({
        instantiate: () => {
            return new JWebglColor ();
        },
        onPop: null,
        onPush: null
    });
}

/**
 * 颜色数据
 */
let colorData255 = [
    //  57, 185, 144, 255, // 绿色   0.2235, 0.7254, 0.5647
       142, 222,  73, 255, // 黄绿色
       250, 217,   0, 255, // 黄色
       249, 164,  63, 255, // 橙色
    // 247, 109, 116, 255, // 红色   0.9686, 0.4274, 0.4549
       226,  73, 157, 255, // 洋红
       146,  86, 217, 255, // 紫色
    // 103, 103, 236, 255, // 靛蓝色 0.4039, 0.4039, 0.9254
       227, 102, 239, 255, // 紫红色
        32, 207, 214, 255  // 海蓝色
];

namespace JWebglColor {
    /**
     * 当前所有颜色
     */
    export const listColor = new Array <JWebglColor> ();
    /**
     * 提取颜色
     * @param idx 
     * @returns 
     */
    export function color (idx: number) {
        return listColor [idx % listColor.length];
    }

    /**
     * 白色
     */
    export const COLOR_WHITE = new JWebglColor (1, 1, 1, 1);
    /**
     * 遮罩
     */
    export const COLOR_MASK = new JWebglColor (0, 0, 0, 0.9);
    /**
     * 黑色
     */
    export const COLOR_BLACK = new JWebglColor (0, 0, 0, 1);
    /**
     * 灰色
     */
    export const COLOR_GREY = new JWebglColor (0.5, 0.5, 0.5, 1);
    /**
     * 灰色
     */
    export const COLOR_LIGHT = new JWebglColor (0.75, 0.75, 0.75, 1);

    /**
     * 红色
     */
    export const COLOR_RED = new JWebglColor (0.9686, 0.4274, 0.4549, 1);
    /**
     * 绿色
     */
    export const COLOR_GREEN = new JWebglColor (0.2235, 0.7254, 0.5647, 1);
    /**
     * 蓝色
     */
    export const COLOR_BLUE = new JWebglColor (0.4039, 0.4039, 0.9254, 1);
    /**
     * 蓝色
     */
    export const COLOR_BLUE_ALPHA = new JWebglColor (0.4039, 0.4039, 0.9254, 0.7);

    /**
     * 红色
     */
    export const COLOR_PURE_RED = new JWebglColor (1, 0, 0, 1);
}

for (let i = 0; i < colorData255.length; i+=4) {
    JWebglColor.listColor.push (
        new JWebglColor (
            colorData255 [i + 0] / 255,
            colorData255 [i + 1] / 255,
            colorData255 [i + 2] / 255,
            colorData255 [i + 3] / 255
        )
    );
};

export default JWebglColor;
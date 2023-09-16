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
     * css 专用的文本 - 填充
     */
    txtCssMain: string;
    /**
     * css 专用的文本 - 描边
     */
    txtCssBg: string;

    constructor (r = 1, g = 1, b = 1, a = 1) {
        this.data01 [0] = r;
        this.data01 [1] = g;
        this.data01 [2] = b;
        this.data01 [3] = a;

        for (let i = 0; i < 4; i++) {
            this.data255 [i] = this.data01 [i] * 255;
        };
        this.txtCssMain = `rgba(${this.data255 [0]}, ${this.data255 [1]}, ${this.data255 [2]}, ${this.data01 [3]})`;
        this.txtCssBg = `rgba(${(this.data255 [0] + 127) % 255}, ${(this.data255 [1] + 127) % 255}, ${(this.data255 [2] + 127) % 255}, ${this.data01 [3]})`;
    }
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
}

// for (let i = 0; i < colorData01.length; i+=4) {
//     DemoLifeCycleColor.listColor.push (
//         new DemoLifeCycleColor (
//             colorData01 [i + 0],
//             colorData01 [i + 1],
//             colorData01 [i + 2],
//             colorData01 [i + 3]
//         )
//     );
// };

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
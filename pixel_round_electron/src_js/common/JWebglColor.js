import ObjectPoolType from "./ObjectPoolType.js";
/**
 * 颜色
 */
class JWebglColor {
    constructor(r = 1, g = 1, b = 1, a = 1) {
        /**
         * 数据，区间 0 - 1
         */
        this.data01 = new Float32Array(4);
        /**
         * 数据，区间 0 - 255
         */
        this.data255 = new Uint8Array(4);
        this.init(r, g, b, a);
    }
    init(r, g, b, a) {
        this.data01[0] = r;
        this.data01[1] = g;
        this.data01[2] = b;
        this.data01[3] = a;
        for (let i = 0; i < 4; i++) {
            this.data255[i] = this.data01[i] * 255;
        }
        ;
        this.str16 = `#${this.to16(this.data255[0])}${this.to16(this.data255[1])}${this.to16(this.data255[2])}${this.to16(this.data255[3])}`;
        this.str2dText = `rgba(${this.data255[0]}, ${this.data255[1]}, ${this.data255[2]}, ${this.data01[3]})`;
    }
    to16(num) {
        let str = num.toString(16);
        if (str.length == 1) {
            return `0${str}`;
        }
        ;
        return str;
    }
}
JWebglColor.poolType = new ObjectPoolType({
    instantiate: () => {
        return new JWebglColor();
    },
    onPop: null,
    onPush: null
});
/**
 * 颜色数据
 */
let colorData255 = [
    //  57, 185, 144, 255, // 绿色   0.2235, 0.7254, 0.5647
    142, 222, 73, 255,
    250, 217, 0, 255,
    249, 164, 63, 255,
    // 247, 109, 116, 255, // 红色   0.9686, 0.4274, 0.4549
    226, 73, 157, 255,
    146, 86, 217, 255,
    // 103, 103, 236, 255, // 靛蓝色 0.4039, 0.4039, 0.9254
    227, 102, 239, 255,
    32, 207, 214, 255 // 海蓝色
];
(function (JWebglColor) {
    /**
     * 当前所有颜色
     */
    JWebglColor.listColor = new Array();
    /**
     * 提取颜色
     * @param idx
     * @returns
     */
    function color(idx) {
        return JWebglColor.listColor[idx % JWebglColor.listColor.length];
    }
    JWebglColor.color = color;
    /**
     * 白色
     */
    JWebglColor.COLOR_WHITE = new JWebglColor(1, 1, 1, 1);
    /**
     * 遮罩
     */
    JWebglColor.COLOR_MASK = new JWebglColor(0, 0, 0, 0.9);
    /**
     * 黑色
     */
    JWebglColor.COLOR_BLACK = new JWebglColor(0, 0, 0, 1);
    /**
     * 灰色
     */
    JWebglColor.COLOR_GREY = new JWebglColor(0.5, 0.5, 0.5, 1);
    /**
     * 红色
     */
    JWebglColor.COLOR_RED = new JWebglColor(0.9686, 0.4274, 0.4549, 1);
    /**
     * 绿色
     */
    JWebglColor.COLOR_GREEN = new JWebglColor(0.2235, 0.7254, 0.5647, 1);
    /**
     * 蓝色
     */
    JWebglColor.COLOR_BLUE = new JWebglColor(0.4039, 0.4039, 0.9254, 1);
    /**
     * 蓝色
     */
    JWebglColor.COLOR_BLUE_ALPHA = new JWebglColor(0.4039, 0.4039, 0.9254, 0.7);
})(JWebglColor || (JWebglColor = {}));
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
for (let i = 0; i < colorData255.length; i += 4) {
    JWebglColor.listColor.push(new JWebglColor(colorData255[i + 0] / 255, colorData255[i + 1] / 255, colorData255[i + 2] / 255, colorData255[i + 3] / 255));
}
;
export default JWebglColor;

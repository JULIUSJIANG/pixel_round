import objectPool from "./ObjectPool.js";
import ObjectPoolType from "./ObjectPoolType.js";
/**
 * 维度
 */
const DIMENSION = 4;
/**
 * 4 维向量
 */
class JWebglMathVector4 {
    constructor(x = 0, y = 0, z = 0) {
        /**
         * 核心数据
         */
        this.elements = new Float32Array(DIMENSION);
        this.elements[0] = x;
        this.elements[1] = y;
        this.elements[2] = z;
        this.elements[3] = 1;
    }
    toString() {
        return `x[${this.elements[0].toFixed(2)}] y[${this.elements[1].toFixed(2)}] z[${this.elements[2].toFixed(2)}] w[${this.elements[3].toFixed(2)}]`;
    }
    /**
     * w 归置为 1
     */
    wBe1() {
        for (let i = 0; i < DIMENSION; i++) {
            this.elements[i] /= this.elements[DIMENSION - 1];
        }
        ;
    }
    /**
     * 归一化
     * @param vec4From
     * @param vec4To
     */
    static normalize(vec4From, vec4To) {
        let len = Math.sqrt(vec4From.elements[0] ** 2 + vec4From.elements[1] ** 2 + vec4From.elements[2] ** 2);
        if (len == 0) {
            vec4To.elements[0] = Math.sqrt(3);
            vec4To.elements[1] = Math.sqrt(3);
            vec4To.elements[2] = Math.sqrt(3);
            return;
        }
        ;
        vec4To.elements[0] = vec4From.elements[0] / len;
        vec4To.elements[1] = vec4From.elements[1] / len;
        vec4To.elements[2] = vec4From.elements[2] / len;
    }
    /**
     * 归一化
     */
    normalize() {
        JWebglMathVector4.normalize(this, this);
    }
    /**
     * 拷贝向量
     * @param vec4
     */
    static copy(vec4From, vec4To) {
        for (let i = 0; i < DIMENSION; i++) {
            vec4To.elements[i] = vec4From.elements[i];
        }
        ;
    }
    /**
     * 叉乘
     * @param vec4A
     * @param vec4B
     * @param vec4Result
     */
    static cross(vec4A, vec4B, vec4Result) {
        vec4Result.elements[0] = vec4A.elements[1] * vec4B.elements[2] - vec4B.elements[1] * vec4A.elements[2];
        vec4Result.elements[1] = vec4B.elements[0] * vec4A.elements[2] - vec4A.elements[0] * vec4B.elements[2];
        vec4Result.elements[2] = vec4A.elements[0] * vec4B.elements[1] - vec4B.elements[0] * vec4A.elements[1];
    }
    /**
     * 点积
     * @param vec4A
     * @param vec4B
     * @returns
     */
    static dot(vec4A, vec4B) {
        return vec4A.elements[0] * vec4B.elements[0] + vec4A.elements[1] * vec4B.elements[1] + vec4A.elements[2] * vec4B.elements[2];
    }
    /**
     * 求长度
     * @param vec4
     */
    static len(vec4) {
        let len = 0;
        for (let i = 0; i < DIMENSION - 1; i++) {
            len += vec4.elements[i] ** 2;
        }
        ;
        return Math.sqrt(len);
    }
    /**
     * 求距离
     * @param vecA
     * @param vecB
     * @returns
     */
    static distance(vecA, vecB) {
        let len = 0;
        for (let i = 0; i < DIMENSION - 1; i++) {
            len += (vecA.elements[i] - vecB.elements[i]) ** 2;
        }
        ;
        return Math.sqrt(len);
    }
    /**
     * 返回弧度制夹角
     * @param vecA
     * @param vecB
     */
    static angleRadians(vecA, vecB) {
        return Math.acos(JWebglMathVector4.dot(vecA, vecB) / (JWebglMathVector4.len(vecA) * JWebglMathVector4.len(vecB)));
    }
    /**
     * 计算相对向量
     * @param vec4From
     * @param vec4To
     * @param vec4Relative
     */
    static relative(vec4From, vec4To, vec4Relative) {
        for (let i = 0; i < DIMENSION - 1; i++) {
            vec4Relative.elements[i] = vec4To.elements[i] - vec4From.elements[i];
        }
        ;
    }
    /**
     * 计算左向量，上向量尽量取 y 轴
     * @param vec4Forward
     * @param vec4Result
     * @returns
     */
    static left(vec4Forward, vec4Result) {
        JWebglMathVector4.normalize(vec4Forward, JWebglMathVector4._upVec4ForwardNormalize);
        // 完全的正朝上，返回 z 轴
        if (JWebglMathVector4._upVec4ForwardNormalize.elements[1] == 1) {
            JWebglMathVector4.copy(JWebglMathVector4.axisZEnd, vec4Result);
            return;
        }
        ;
        // 计算与 "vec4Forward 与 y 轴张成平面" 垂直的向量 "左"
        JWebglMathVector4.cross(JWebglMathVector4.axisYEnd, vec4Forward, vec4Result);
        vec4Result.normalize();
    }
    /**
     * 缩放
     * @param scale
     */
    scale(scale) {
        JWebglMathVector4.scale(this, scale, this);
    }
    /**
     * 缩放
     * @param vecFrom
     * @param scale
     * @param vecTo
     */
    static scale(vecFrom, scale, vecTo) {
        for (let i = 0; i < 3; i++) {
            vecTo.elements[i] = vecFrom.elements[i] * scale;
        }
        ;
    }
    /**
     * 合并向量
     * @param listVec
     * @returns
     */
    static add(...listVec) {
        if (listVec.length == 0) {
            return;
        }
        ;
        for (let i = 0; i < 3; i++) {
            JWebglMathVector4._addVec.elements[i] = 0;
            for (let j = 0; j < listVec.length - 1; j++) {
                JWebglMathVector4._addVec.elements[i] += listVec[j].elements[i];
            }
            ;
        }
        ;
        JWebglMathVector4.copy(this._addVec, listVec[listVec.length - 1]);
    }
    /**
     * 构造实例
     * @param x
     * @param y
     * @param z
     */
    static create(x, y, z) {
        let inst = objectPool.pop(this.poolType);
        inst.elements[0] = x;
        inst.elements[1] = y;
        inst.elements[2] = z;
        inst.elements[3] = 1;
        return inst;
    }
}
JWebglMathVector4.poolType = new ObjectPoolType({
    instantiate: () => {
        return new JWebglMathVector4();
    },
    onPop: (t) => {
    },
    onPush: (t) => {
    }
});
JWebglMathVector4._upVec4ForwardNormalize = new JWebglMathVector4();
JWebglMathVector4._addVec = new JWebglMathVector4();
(function (JWebglMathVector4) {
    /**
     * 原点
     */
    JWebglMathVector4.centerO = new JWebglMathVector4();
    /**
     * 坐标轴 x
     */
    JWebglMathVector4.axisXStart = new JWebglMathVector4(-1, 0, 0);
    /**
     * 坐标轴 x
     */
    JWebglMathVector4.axisXEnd = new JWebglMathVector4(1, 0, 0);
    /**
     * 坐标轴 y
     */
    JWebglMathVector4.axisYStart = new JWebglMathVector4(0, -1, 0);
    /**
     * 坐标轴 y
     */
    JWebglMathVector4.axisYEnd = new JWebglMathVector4(0, 1, 0);
    /**
     * 坐标轴 z
     */
    JWebglMathVector4.axisZStart = new JWebglMathVector4(0, 0, -1);
    /**
     * 坐标轴 z
     */
    JWebglMathVector4.axisZEnd = new JWebglMathVector4(0, 0, 1);
})(JWebglMathVector4 || (JWebglMathVector4 = {}));
export default JWebglMathVector4;

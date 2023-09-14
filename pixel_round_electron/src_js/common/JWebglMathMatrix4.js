import JWebglMathVector4 from "./JWebglMathVector4.js";
import objectPool from "./ObjectPool.js";
import ObjectPoolType from "./ObjectPoolType.js";
/**
 * 维度
 */
const DIMENSION = 4;
/**
 * 数据大小
 */
const SIZE = DIMENSION ** 2;
/**
 * 4 维矩阵
 */
export default class JWebglMathMatrix4 {
    constructor() {
        /**
         * 核心数据
         */
        this.elements = new Float32Array(SIZE);
        // e[ 0] e[ 4] e[ 8] e[12]
        // e[ 1] e[ 5] e[ 9] e[13]
        // e[ 2] e[ 6] e[10] e[14]
        // e[ 3] e[ 7] e[11] e[15]
    }
    /**
     * 拷贝矩阵
     * @param mat4
     */
    static copy(mat4Origin, mat4Result) {
        for (let i = 0; i < SIZE; i++) {
            mat4Result.elements[i] = mat4Origin.elements[i];
        }
        ;
    }
    /**
     * 左乘矩阵
     * @param mat4Right
     */
    static multiplyMat4(mat4Left, mat4Right, mat4Result) {
        let mat4Temp0 = objectPool.pop(JWebglMathMatrix4.poolType);
        // 行索引
        for (let i = 0; i < DIMENSION; i++) {
            // 列索引
            for (let j = 0; j < DIMENSION; j++) {
                let location = i + j * DIMENSION;
                mat4Temp0.elements[location] = 0;
                // 序索引
                for (let idx = 0; idx < DIMENSION; idx++) {
                    mat4Temp0.elements[location] += mat4Left.elements[i + idx * DIMENSION] * mat4Right.elements[idx + j * DIMENSION];
                }
                ;
            }
            ;
        }
        ;
        JWebglMathMatrix4.copy(mat4Temp0, mat4Result);
        objectPool.push(mat4Temp0);
    }
    /**
     * 复合一系列变换到最后的矩阵
     * @param mat4A
     * @param mat4B
     * @param mat4C
     * @param listMat4
     */
    static multiplayMat4List(mat4A, mat4B, mat4C, ...listMat4) {
        JWebglMathMatrix4.multiplayMat4ListTemp.push(mat4A, mat4B, mat4C, ...listMat4);
        let result = JWebglMathMatrix4.multiplayMat4ListTemp[JWebglMathMatrix4.multiplayMat4ListTemp.length - 1];
        JWebglMathMatrix4.copy(JWebglMathMatrix4.multiplayMat4ListTemp[JWebglMathMatrix4.multiplayMat4ListTemp.length - 2], result);
        for (let i = JWebglMathMatrix4.multiplayMat4ListTemp.length - 3; 0 <= i; i--) {
            let multiplayMat4ListTempI = JWebglMathMatrix4.multiplayMat4ListTemp[i];
            JWebglMathMatrix4.multiplyMat4(multiplayMat4ListTempI, result, result);
        }
        ;
        JWebglMathMatrix4.multiplayMat4ListTemp.length = 0;
    }
    /**
     * 对一个向量进行变换
     * @param vec4Origin
     */
    static transformVec4(mat4, vec4Origin, vec4Result) {
        let vec4Temp0 = objectPool.pop(JWebglMathVector4.poolType);
        JWebglMathVector4.copy(vec4Origin, vec4Temp0);
        // 行索引
        for (let i = 0; i < DIMENSION; i++) {
            vec4Temp0.elements[i] = 0;
            // 序索引
            for (let idx = 0; idx < DIMENSION; idx++) {
                vec4Temp0.elements[i] += mat4.elements[i + idx * DIMENSION] * vec4Origin.elements[idx];
            }
            ;
        }
        ;
        JWebglMathVector4.copy(vec4Temp0, vec4Result);
        objectPool.push(vec4Temp0);
    }
    /**
     * 转置
     */
    static transpose(mat4Origin, mat4Result) {
        let mat4Temp0 = objectPool.pop(JWebglMathMatrix4.poolType);
        JWebglMathMatrix4.copy(mat4Origin, mat4Temp0);
        // 行索引
        for (let i = 0; i < DIMENSION; i++) {
            // 列索引
            for (let j = 0; j < DIMENSION; j++) {
                mat4Temp0.elements[i + j * DIMENSION] = mat4Origin.elements[j + i * DIMENSION];
            }
            ;
        }
        ;
        JWebglMathMatrix4.copy(mat4Temp0, mat4Result);
        objectPool.push(mat4Temp0);
    }
    /**
     * 逆
     */
    static setInvert(mat4Origin, mat4Result) {
        let mat4Temp0 = objectPool.pop(JWebglMathMatrix4.poolType);
        let m = mat4Origin.elements;
        mat4Temp0.elements[0] = m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15] + m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10];
        mat4Temp0.elements[4] = -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15] - m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10];
        mat4Temp0.elements[8] = m[4] * m[9] * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15] + m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9];
        mat4Temp0.elements[12] = -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] + m[8] * m[5] * m[14] - m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9];
        mat4Temp0.elements[1] = -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15] - m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10];
        mat4Temp0.elements[5] = m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15] + m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10];
        mat4Temp0.elements[9] = -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15] - m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9];
        mat4Temp0.elements[13] = m[0] * m[9] * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14] + m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9];
        mat4Temp0.elements[2] = m[1] * m[6] * m[15] - m[1] * m[7] * m[14] - m[5] * m[2] * m[15] + m[5] * m[3] * m[14] + m[13] * m[2] * m[7] - m[13] * m[3] * m[6];
        mat4Temp0.elements[6] = -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] + m[4] * m[2] * m[15] - m[4] * m[3] * m[14] - m[12] * m[2] * m[7] + m[12] * m[3] * m[6];
        mat4Temp0.elements[10] = m[0] * m[5] * m[15] - m[0] * m[7] * m[13] - m[4] * m[1] * m[15] + m[4] * m[3] * m[13] + m[12] * m[1] * m[7] - m[12] * m[3] * m[5];
        mat4Temp0.elements[14] = -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] + m[4] * m[1] * m[14] - m[4] * m[2] * m[13] - m[12] * m[1] * m[6] + m[12] * m[2] * m[5];
        mat4Temp0.elements[3] = -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] + m[5] * m[2] * m[11] - m[5] * m[3] * m[10] - m[9] * m[2] * m[7] + m[9] * m[3] * m[6];
        mat4Temp0.elements[7] = m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11] + m[4] * m[3] * m[10] + m[8] * m[2] * m[7] - m[8] * m[3] * m[6];
        mat4Temp0.elements[11] = -m[0] * m[5] * m[11] + m[0] * m[7] * m[9] + m[4] * m[1] * m[11] - m[4] * m[3] * m[9] - m[8] * m[1] * m[7] + m[8] * m[3] * m[5];
        mat4Temp0.elements[15] = m[0] * m[5] * m[10] - m[0] * m[6] * m[9] - m[4] * m[1] * m[10] + m[4] * m[2] * m[9] + m[8] * m[1] * m[6] - m[8] * m[2] * m[5];
        let det = m[0] * mat4Temp0.elements[0] + m[1] * mat4Temp0.elements[4] + m[2] * mat4Temp0.elements[8] + m[3] * mat4Temp0.elements[12];
        if (det != 0) {
            for (let i = 0; i < SIZE; i++) {
                mat4Temp0.elements[i] /= det;
            }
            ;
        }
        ;
        JWebglMathMatrix4.copy(mat4Temp0, mat4Result);
        objectPool.push(mat4Temp0);
    }
    setInvert(mat4Origin) {
        JWebglMathMatrix4.setInvert(mat4Origin, this);
    }
    invert(mat4Origin) {
        let temp0 = objectPool.pop(JWebglMathMatrix4.poolType);
        temp0.setInvert(mat4Origin);
        JWebglMathMatrix4.multiplyMat4(this, temp0, this);
        objectPool.push(temp0);
    }
    /**
     * 设置为正射投影
     * @param left
     * @param right
     * @param bottom
     * @param top
     * @param near
     * @param far
     */
    static setOrtho(left, right, bottom, top, near, far, mat4Result) {
        let rw = 1 / (right - left);
        let rh = 1 / (top - bottom);
        let rd = 1 / (far - near);
        let e = mat4Result.elements;
        e[0] = 2 * rw;
        e[1] = 0;
        e[2] = 0;
        e[3] = 0;
        e[4] = 0;
        e[5] = 2 * rh;
        e[6] = 0;
        e[7] = 0;
        e[8] = 0;
        e[9] = 0;
        e[10] = -2 * rd;
        e[11] = 0;
        e[12] = -(right + left) * rw;
        e[13] = -(top + bottom) * rh;
        e[14] = -(far + near) * rd;
        e[15] = 1;
    }
    setOrtho(left, right, bottom, top, near, far) {
        JWebglMathMatrix4.setOrtho(left, right, bottom, top, near, far, this);
        return this;
    }
    ortho(left, right, bottom, top, near, far) {
        let temp0 = objectPool.pop(JWebglMathMatrix4.poolType);
        temp0.setOrtho(left, right, bottom, top, near, far);
        JWebglMathMatrix4.multiplyMat4(this, temp0, this);
        objectPool.push(temp0);
        return this;
    }
    /**
     * 设置为透视投影
     * @param fov
     * @param aspect
     * @param near
     * @param far
     */
    static setPerspective(fovy, aspect, near, far, mat4Result) {
        fovy = Math.PI * fovy / 180 / 2;
        let s = Math.sin(fovy);
        let rd = 1 / (far - near);
        let ct = Math.cos(fovy) / s;
        let e = mat4Result.elements;
        e[0] = ct / aspect;
        e[1] = 0;
        e[2] = 0;
        e[3] = 0;
        e[4] = 0;
        e[5] = ct;
        e[6] = 0;
        e[7] = 0;
        e[8] = 0;
        e[9] = 0;
        e[10] = -(far + near) * rd;
        e[11] = -1;
        e[12] = 0;
        e[13] = 0;
        e[14] = -2 * near * far * rd;
        e[15] = 0;
    }
    setPerspective(fovy, aspect, near, far) {
        JWebglMathMatrix4.setPerspective(fovy, aspect, near, far, this);
        return this;
    }
    perspective(fovy, aspect, near, far) {
        let temp0 = objectPool.pop(JWebglMathMatrix4.poolType);
        temp0.setPerspective(fovy, aspect, near, far);
        JWebglMathMatrix4.multiplyMat4(this, temp0, this);
        objectPool.push(temp0);
        return this;
    }
    /**
     * 设置为单位阵
     * @return this
     */
    static setIdentity(mat4Result) {
        let m = mat4Result.elements;
        m[0] = 1;
        m[4] = 0;
        m[8] = 0;
        m[12] = 0;
        m[1] = 0;
        m[5] = 1;
        m[9] = 0;
        m[13] = 0;
        m[2] = 0;
        m[6] = 0;
        m[10] = 1;
        m[14] = 0;
        m[3] = 0;
        m[7] = 0;
        m[11] = 0;
        m[15] = 1;
        return mat4Result;
    }
    ;
    setIdentity() {
        JWebglMathMatrix4.setIdentity(this);
        return this;
    }
    /**
     * 设置为缩放矩阵
     * @param scaleX
     * @param scaleY
     * @param scaleZ
     * @param mat4Result
     */
    static setScale(scaleX, scaleY, scaleZ, mat4Result) {
        let m = mat4Result.elements;
        m[0] = scaleX;
        m[4] = 0;
        m[8] = 0;
        m[12] = 0;
        m[1] = 0;
        m[5] = scaleY;
        m[9] = 0;
        m[13] = 0;
        m[2] = 0;
        m[6] = 0;
        m[10] = scaleZ;
        m[14] = 0;
        m[3] = 0;
        m[7] = 0;
        m[11] = 0;
        m[15] = 1;
    }
    setScale(scaleX, scaleY, scaleZ) {
        JWebglMathMatrix4.setScale(scaleX, scaleY, scaleZ, this);
        return this;
    }
    scale(scaleX, scaleY, scaleZ) {
        let temp0 = objectPool.pop(JWebglMathMatrix4.poolType);
        temp0.setScale(scaleX, scaleY, scaleZ);
        JWebglMathMatrix4.multiplyMat4(this, temp0, this);
        objectPool.push(temp0);
        return this;
    }
    /**
     * 设置为平移矩阵
     * @param translateX
     * @param translateY
     * @param translateZ
     * @param mat4Result
     */
    static setTranslate(translateX, translateY, translateZ, mat4Result) {
        let m = mat4Result.elements;
        m[0] = 1;
        m[4] = 0;
        m[8] = 0;
        m[12] = translateX;
        m[1] = 0;
        m[5] = 1;
        m[9] = 0;
        m[13] = translateY;
        m[2] = 0;
        m[6] = 0;
        m[10] = 1;
        m[14] = translateZ;
        m[3] = 0;
        m[7] = 0;
        m[11] = 0;
        m[15] = 1;
    }
    setTranslate(translateX, translateY, translateZ) {
        JWebglMathMatrix4.setTranslate(translateX, translateY, translateZ, this);
        return this;
    }
    translate(translateX, translateY, translateZ) {
        let temp0 = objectPool.pop(JWebglMathMatrix4.poolType);
        temp0.setTranslate(translateX, translateY, translateZ);
        JWebglMathMatrix4.multiplyMat4(this, temp0, this);
        objectPool.push(temp0);
        return this;
    }
    /**
     * 设置为旋转矩阵
     * @param rotateX
     * @param rotateY
     * @param rotateZ
     * @param mat4Result
     */
    static setRotate(angle, x, y, z, mat4Result) {
        angle = Math.PI * angle / 180;
        let e = mat4Result.elements;
        let s = Math.sin(angle);
        let c = Math.cos(angle);
        if (0 !== x && 0 === y && 0 === z) {
            // Rotation around X axis
            if (x < 0) {
                s = -s;
            }
            e[0] = 1;
            e[4] = 0;
            e[8] = 0;
            e[12] = 0;
            e[1] = 0;
            e[5] = c;
            e[9] = -s;
            e[13] = 0;
            e[2] = 0;
            e[6] = s;
            e[10] = c;
            e[14] = 0;
            e[3] = 0;
            e[7] = 0;
            e[11] = 0;
            e[15] = 1;
        }
        else if (0 === x && 0 !== y && 0 === z) {
            // Rotation around Y axis
            if (y < 0) {
                s = -s;
            }
            e[0] = c;
            e[4] = 0;
            e[8] = s;
            e[12] = 0;
            e[1] = 0;
            e[5] = 1;
            e[9] = 0;
            e[13] = 0;
            e[2] = -s;
            e[6] = 0;
            e[10] = c;
            e[14] = 0;
            e[3] = 0;
            e[7] = 0;
            e[11] = 0;
            e[15] = 1;
        }
        else if (0 === x && 0 === y && 0 !== z) {
            // Rotation around Z axis
            if (z < 0) {
                s = -s;
            }
            e[0] = c;
            e[4] = -s;
            e[8] = 0;
            e[12] = 0;
            e[1] = s;
            e[5] = c;
            e[9] = 0;
            e[13] = 0;
            e[2] = 0;
            e[6] = 0;
            e[10] = 1;
            e[14] = 0;
            e[3] = 0;
            e[7] = 0;
            e[11] = 0;
            e[15] = 1;
        }
        else {
            // Rotation around another axis
            let len = Math.sqrt(x * x + y * y + z * z);
            if (len !== 1) {
                let rlen = 1 / len;
                x *= rlen;
                y *= rlen;
                z *= rlen;
            }
            ;
            let nc = 1 - c;
            let xy = x * y;
            let yz = y * z;
            let zx = z * x;
            let xs = x * s;
            let ys = y * s;
            let zs = z * s;
            e[0] = x * x * nc + c;
            e[1] = xy * nc + zs;
            e[2] = zx * nc - ys;
            e[3] = 0;
            e[4] = xy * nc - zs;
            e[5] = y * y * nc + c;
            e[6] = yz * nc + xs;
            e[7] = 0;
            e[8] = zx * nc + ys;
            e[9] = yz * nc - xs;
            e[10] = z * z * nc + c;
            e[11] = 0;
            e[12] = 0;
            e[13] = 0;
            e[14] = 0;
            e[15] = 1;
        }
    }
    setRotate(angle, x, y, z) {
        JWebglMathMatrix4.setRotate(angle, x, y, z, this);
        return this;
    }
    rotate(angle, x, y, z) {
        let temp0 = objectPool.pop(JWebglMathMatrix4.poolType);
        temp0.setRotate(angle, x, y, z);
        JWebglMathMatrix4.multiplyMat4(this, temp0, this);
        objectPool.push(temp0);
        return this;
    }
    /**
     * 设置为视点观察
     */
    static setLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ, mat4Result) {
        let fx = centerX - eyeX;
        let fy = centerY - eyeY;
        let fz = centerZ - eyeZ;
        // Normalize f.
        let rlf = 1 / Math.sqrt(fx * fx + fy * fy + fz * fz);
        fx *= rlf;
        fy *= rlf;
        fz *= rlf;
        // Calculate cross product of f and up.
        let sx = fy * upZ - fz * upY;
        let sy = fz * upX - fx * upZ;
        let sz = fx * upY - fy * upX;
        // Normalize s.
        let rls = 1 / Math.sqrt(sx * sx + sy * sy + sz * sz);
        sx *= rls;
        sy *= rls;
        sz *= rls;
        // Calculate cross product of s and f.
        let ux = sy * fz - sz * fy;
        let uy = sz * fx - sx * fz;
        let uz = sx * fy - sy * fx;
        // Set to this.
        let e = mat4Result.elements;
        e[0] = sx;
        e[1] = ux;
        e[2] = -fx;
        e[3] = 0;
        e[4] = sy;
        e[5] = uy;
        e[6] = -fy;
        e[7] = 0;
        e[8] = sz;
        e[9] = uz;
        e[10] = -fz;
        e[11] = 0;
        e[12] = 0;
        e[13] = 0;
        e[14] = 0;
        e[15] = 1;
        let temp = objectPool.pop(JWebglMathMatrix4.poolType);
        JWebglMathMatrix4.setTranslate(-eyeX, -eyeY, -eyeZ, temp);
        JWebglMathMatrix4.multiplyMat4(mat4Result, temp, mat4Result);
        objectPool.push(temp);
    }
    setLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
        JWebglMathMatrix4.setLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ, this);
        return this;
    }
    lookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
        let temp0 = objectPool.pop(JWebglMathMatrix4.poolType);
        temp0.setLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ);
        JWebglMathMatrix4.multiplyMat4(this, temp0, this);
        objectPool.push(temp0);
        return this;
    }
}
JWebglMathMatrix4.poolType = new ObjectPoolType({
    instantiate: () => {
        return new JWebglMathMatrix4();
    },
    onPop: (t) => {
    },
    onPush: (t) => {
    }
});
JWebglMathMatrix4.multiplayMat4ListTemp = new Array();

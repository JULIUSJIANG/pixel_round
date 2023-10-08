var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import JWebglEnum from "./JWebglEnum.js";
import JWebglMathVector4 from "./JWebglMathVector4.js";
import JWebglProgram from "./JWebglProgram.js";
import JWebglProgramAttributeVec2 from "./JWebglProgramAttributeVec2.js";
import JWebglProgramAttributeVec4 from "./JWebglProgramAttributeVec4.js";
import JWEbglProgramDefine from "./JWebglProgramDefine.js";
import JWebglProgramUniformMat4 from "./JWebglProgramUniformMat4.js";
import JWebglProgramUniformSampler2D from "./JWebglProgramUniformSampler2D.js";
import JWebglProgramUniformVec2 from "./JWebglProgramUniformVec2.js";
import JWebglProgramVaryingVec2 from "./JWebglProgramVaryingVec2.js";
/**
 * 正式平滑 - 经典款，绝大部分交界处可导
 */
export default class JWebglProgramTypeSmoothDisplayCircle extends JWebglProgram {
    constructor() {
        super(...arguments);
        this._addLeft = new JWebglMathVector4();
        this._addUp = new JWebglMathVector4();
        this._addPosLB = new JWebglMathVector4();
        this._addPosRB = new JWebglMathVector4();
        this._addPosRT = new JWebglMathVector4();
        this._addPosLT = new JWebglMathVector4();
        this._addOffsetX = new JWebglMathVector4();
        this._addOffsetY = new JWebglMathVector4();
    }
    impGetShaderVTxt() {
        return `
void main() {
    gl_Position = ${this.uMvp} * ${this.aPosition};
    ${this.vTexCoord} = ${this.aTexCoord};
}
        `;
    }
    impGetnShaderFTxt() {
        return `
// 手动实现的 atan2
float atan2 (float y, float x) {
    return atan (y / x) + step (x, 0.0) * step (0.0, y) * ${this.dPI} - step (x, 0.0) * step (y, 0.0) * ${this.dPI};
}

// 取样
vec4 getTextureRGBA (sampler2D tex, vec2 uv) {
    vec2 pos = uv / ${this.uTextureSize};
    if (
           pos.x < 0.0 
        || 1.0 < pos.x
        || pos.y < 0.0
        || 1.0 < pos.y
    )
    {
        return vec4 (0, 0, 0, 0);
    };
    return texture2D (tex, pos);
}

// 2 个数是否匹配
bool match (float current, float target) {
    return abs (current - target) < 0.1;
}

// 检查 2 个颜色是否一致
bool checkEqual (vec4 colorA, vec4 colorB) {
    return (
          abs (colorA.r - colorB.r) 
        + abs (colorA.g - colorB.g) 
        + abs (colorA.b - colorB.b)
        + abs (colorA.a - colorB.a)
    ) <= 0.01;
}

// 获取角的缓存数据
vec4 getCornerCache (vec2 posTex, vec2 dir) {
    vec2 posCorner = posTex + dir / 4.0;
    return getTextureRGBA (${this.uTextureCorner}, posCorner);
}

// 获取平滑类型的缓存数据
vec4 getEnumCache (vec2 posTex, vec2 dir) {
    vec2 posCorner = posTex + dir / 4.0;
    return getTextureRGBA (${this.uTextureEnum}, posCorner);
}

// 获取平滑区域的缓存数据 - 左
vec4 getAreaCacheLeft (vec2 posTex, vec2 dir) {
    vec2 posCorner = posTex + dir / 4.0;
    return getTextureRGBA (${this.uTextureAreaLeft}, posCorner);
}

// 获取平滑区域的缓存数据 - 右
vec4 getAreaCacheRight (vec2 posTex, vec2 dir) {
    vec2 posCorner = posTex + dir / 4.0;
    return getTextureRGBA (${this.uTextureAreaRight}, posCorner);
}

// 获取角度区域的缓存数据 - 左
vec4 getAngleCacheLeft (vec2 posTex, vec2 dir) {
    vec2 posCorner = posTex + dir / 4.0;
    return getTextureRGBA (${this.uTextureAngleLeft}, posCorner);
}

// 获取角度区域的缓存数据 - 右
vec4 getAngleCacheRight (vec2 posTex, vec2 dir) {
    vec2 posCorner = posTex + dir / 4.0;
    return getTextureRGBA (${this.uTextureAngleRight}, posCorner);
}

// 进行平滑
void connect (inout vec4 sum, vec2 uv, vec2 p1, vec2 p2, float tickness, vec4 smoothColor) {
    // 向量: p1 -> p2
    vec2 dir = p2 - p1;
    // 向量: p1 -> p2 顺时针旋转 90 度
    dir = normalize (vec2 (dir.y, -dir.x));
    // 向量: p1 像素点中心 -> uv
    vec2 lp = uv - (floor (p1) + 0.5);
    // lp 在 dir 上的投影，取值 0 - 1.4142135623730951;
    float shadow = dot (lp, dir);
    // 准线以内，对颜色进行替换
    float l = step (shadow, tickness);
    // 根据权重，进行取色
    sum = mix (sum, smoothColor, l); 
}

// 使用一个角对总颜色进行影响
void colorCorner (inout vec4 colorSum, vec2 pos, vec2 vecForward) {
    vec2 vecRight = vec2 (vecForward.y, - vecForward.x);

    vec2 vecForwardNormalized = normalize (vecForward);
    vec2 vecRightNormalized = normalize (vecRight);

    vec2 posCenter = floor (pos) + vec2 (0.5, 0.5);
    vec4 posCenterCornerForward = getCornerCache (posCenter, vecForward);
    vec4 posCenterEnumForward = getEnumCache (posCenter, vecForward);
    vec4 posCenterAreaForwardLeft = getAreaCacheLeft (posCenter, vecForward);
    vec4 posCenterAreaForwardRight = getAreaCacheRight (posCenter, vecForward);
    vec4 posCenterAngleForwardLeft = getAngleCacheLeft (posCenter, vecForward);
    vec4 posCenterAngleForwardRight = getAngleCacheRight (posCenter, vecForward);
    vec4 posCenterColor = getTextureRGBA (${this.uTextureMain}, posCenter);

    vec2 posLeft = posCenter - vecRight;
    vec2 posRight = posCenter + vecRight;

    vec2 posFL = posCenter + vecForward / 2.0 - vecRight / 2.0;
    vec4 posFLColor = getTextureRGBA (${this.uTextureMain}, posFL);

    vec2 posFR = posCenter + vecForward / 2.0 + vecRight / 2.0;
    vec4 posFRColor = getTextureRGBA (${this.uTextureMain}, posFR);

    // 相对于中心的位置
    vec2 posRel = pos - posCenter;
    // 在参考坐标系中的角度
    float posAngle = atan2 (dot (posRel, vecForward), dot (posRel, vecRight)) / ${this.dPI};

    vec4 colorSmooth = posCenterColor;
    if (match (posCenterCornerForward.r, 1.0)) {
        colorSmooth = posFLColor;
    };
    if (match (posCenterCornerForward.g, 1.0)) {
        colorSmooth = posFRColor;
    };

    // 涉猎左管制区域
    if (
           match (posCenterAngleForwardLeft.a, 1.0)
        && posCenterAngleForwardLeft.r < posAngle
        && posAngle < posCenterAngleForwardLeft.g
    ) 
    {
        // 圆心位置
        vec2 circleCenter = posCenter + posCenterAreaForwardLeft.r * vecRightNormalized + posCenterAreaForwardLeft.g * vecForwardNormalized;
        // 与圆心距离
        float distance = length (pos - circleCenter);
        // 超出半径，取平滑颜色
        if (posCenterAreaForwardLeft.b < distance) {
            colorSum = colorSmooth;
        };
    }
    // 涉猎右管制区域
    else if (
            match (posCenterAngleForwardRight.a, 1.0)
        && posCenterAngleForwardRight.r < posAngle
        && posAngle < posCenterAngleForwardRight.g
    )
    {
        // 圆心位置
        vec2 circleCenter = posCenter + posCenterAreaForwardRight.r * vecRightNormalized + posCenterAreaForwardRight.g * vecForwardNormalized;
        // 与圆心距离
        float distance = length (pos - circleCenter);
        // 超出半径，取平滑颜色
        if (posCenterAreaForwardRight.b < distance) {
            colorSum = colorSmooth;
        };
    }
    // 否则采纳默认平滑
    else {
        // 需要平滑
        if (match (posCenterCornerForward.a, 1.0)) {
            // 小平滑
            connect (colorSum, pos, posFL, posFR, ${this.dForwardSmall}, colorSmooth);
    
            // 经典平滑
            if (match (posCenterEnumForward.r, 0.0)) {
                connect (colorSum, pos, posFL, posFR, ${this.dForward}, colorSmooth);
            };
    
            // 左倾平滑
            if (match (posCenterEnumForward.g, 1.0)) {
                connect (colorSum, pos, posLeft, posFR, ${this.dSide}, colorSmooth);
            };
    
            // 右倾平滑
            if (match (posCenterEnumForward.b, 1.0)) {
                connect (colorSum, pos, posFL, posRight, ${this.dSide}, colorSmooth);
            };
        };
    };
}

void main() {
    vec2 pos = ${this.vTexCoord} * ${this.uTextureSize};
    vec4 colorSum = getTextureRGBA (${this.uTextureMain}, pos);

    colorCorner (colorSum, pos, vec2 (- 1.0, 1.0));
    colorCorner (colorSum, pos, vec2 (1.0, 1.0));
    colorCorner (colorSum, pos, vec2 (1.0, - 1.0));
    colorCorner (colorSum, pos, vec2 (- 1.0, - 1.0));

    gl_FragColor = colorSum;
}
        `;
    }
    impGetMode() {
        return JWebglEnum.DrawArraysMode.TRIANGLES;
    }
    /**
     * 添加一条线
     * @param posA
     * @param posB
     * @param color
     * @returns
     */
    add(pos, forward, up, width, height) {
        JWebglMathVector4.cross(up, forward, this._addLeft);
        JWebglMathVector4.cross(forward, this._addLeft, this._addUp);
        this._addLeft.normalize();
        this._addUp.normalize();
        JWebglMathVector4.scale(this._addLeft, width / 2, this._addOffsetX);
        JWebglMathVector4.scale(this._addUp, height / 2, this._addOffsetY);
        JWebglMathVector4.add(pos, this._addOffsetX, this._addOffsetY, this._addPosLT);
        JWebglMathVector4.scale(this._addLeft, -width / 2, this._addOffsetX);
        JWebglMathVector4.scale(this._addUp, height / 2, this._addOffsetY);
        JWebglMathVector4.add(pos, this._addOffsetX, this._addOffsetY, this._addPosRT);
        JWebglMathVector4.scale(this._addLeft, -width / 2, this._addOffsetX);
        JWebglMathVector4.scale(this._addUp, -height / 2, this._addOffsetY);
        JWebglMathVector4.add(pos, this._addOffsetX, this._addOffsetY, this._addPosRB);
        JWebglMathVector4.scale(this._addLeft, width / 2, this._addOffsetX);
        JWebglMathVector4.scale(this._addUp, -height / 2, this._addOffsetY);
        JWebglMathVector4.add(pos, this._addOffsetX, this._addOffsetY, this._addPosLB);
        let idxLT = this.addAttributeData(this._addPosLT, 0, 1);
        let idxRT = this.addAttributeData(this._addPosRT, 1, 1);
        let idxRB = this.addAttributeData(this._addPosRB, 1, 0);
        let idxLB = this.addAttributeData(this._addPosLB, 0, 0);
        this._addIndexData(idxLB, idxRB, idxRT, idxLB, idxRT, idxLT);
    }
    /**
     * 添加顶点数据
     * @param pX
     * @param pY
     * @param pZ
     * @param cR
     * @param cG
     * @param cB
     */
    addAttributeData(pos, texCoordX, texCoordY) {
        return this._addAttributeData(pos.elements[0], pos.elements[1], pos.elements[2], 1, texCoordX, texCoordY);
    }
}
__decorate([
    JWebglProgram.define(JWEbglProgramDefine, `0.3535`)
], JWebglProgramTypeSmoothDisplayCircle.prototype, "dForward", void 0);
__decorate([
    JWebglProgram.define(JWEbglProgramDefine, `0.2071`)
], JWebglProgramTypeSmoothDisplayCircle.prototype, "dForwardSmall", void 0);
__decorate([
    JWebglProgram.define(JWEbglProgramDefine, `0.2236`)
], JWebglProgramTypeSmoothDisplayCircle.prototype, "dSide", void 0);
__decorate([
    JWebglProgram.define(JWEbglProgramDefine, `3.1415`)
], JWebglProgramTypeSmoothDisplayCircle.prototype, "dPI", void 0);
__decorate([
    JWebglProgram.uniform(JWebglProgramUniformMat4)
], JWebglProgramTypeSmoothDisplayCircle.prototype, "uMvp", void 0);
__decorate([
    JWebglProgram.uniform(JWebglProgramUniformSampler2D)
], JWebglProgramTypeSmoothDisplayCircle.prototype, "uTextureMain", void 0);
__decorate([
    JWebglProgram.uniform(JWebglProgramUniformVec2)
], JWebglProgramTypeSmoothDisplayCircle.prototype, "uTextureSize", void 0);
__decorate([
    JWebglProgram.uniform(JWebglProgramUniformSampler2D)
], JWebglProgramTypeSmoothDisplayCircle.prototype, "uTextureCorner", void 0);
__decorate([
    JWebglProgram.uniform(JWebglProgramUniformSampler2D)
], JWebglProgramTypeSmoothDisplayCircle.prototype, "uTextureEnum", void 0);
__decorate([
    JWebglProgram.uniform(JWebglProgramUniformSampler2D)
], JWebglProgramTypeSmoothDisplayCircle.prototype, "uTextureAreaLeft", void 0);
__decorate([
    JWebglProgram.uniform(JWebglProgramUniformSampler2D)
], JWebglProgramTypeSmoothDisplayCircle.prototype, "uTextureAreaRight", void 0);
__decorate([
    JWebglProgram.uniform(JWebglProgramUniformSampler2D)
], JWebglProgramTypeSmoothDisplayCircle.prototype, "uTextureAngleLeft", void 0);
__decorate([
    JWebglProgram.uniform(JWebglProgramUniformSampler2D)
], JWebglProgramTypeSmoothDisplayCircle.prototype, "uTextureAngleRight", void 0);
__decorate([
    JWebglProgram.attribute(JWebglProgramAttributeVec4)
], JWebglProgramTypeSmoothDisplayCircle.prototype, "aPosition", void 0);
__decorate([
    JWebglProgram.attribute(JWebglProgramAttributeVec2)
], JWebglProgramTypeSmoothDisplayCircle.prototype, "aTexCoord", void 0);
__decorate([
    JWebglProgram.varying(JWebglProgramVaryingVec2)
], JWebglProgramTypeSmoothDisplayCircle.prototype, "vTexCoord", void 0);

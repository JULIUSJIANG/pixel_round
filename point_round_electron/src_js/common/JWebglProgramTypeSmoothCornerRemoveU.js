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
import JWebglProgramUniformFloat from "./JWebglProgramUniformFloat.js";
import JWebglProgramUniformMat4 from "./JWebglProgramUniformMat4.js";
import JWebglProgramUniformSampler2D from "./JWebglProgramUniformSampler2D.js";
import JWebglProgramUniformVec2 from "./JWebglProgramUniformVec2.js";
import JWebglProgramVaryingVec2 from "./JWebglProgramVaryingVec2.js";
/**
 * 剔除无明确指示的平滑
 */
export default class JWebglProgramTypeSmoothCornerRemoveU extends JWebglProgram {
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
// 2 个数是否匹配
bool match (float current, float target) {
    return abs (current - target) < 0.5;
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

// 获取角的缓存数据
vec4 getCornerCache (vec2 posTex, vec2 dir) {
    vec2 posCorner = posTex + dir / 4.0;
    return getTextureRGBA (${this.uTextureCorner}, posCorner);
}

// 获取平坦的缓存数据
vec4 getFlatCache (vec2 posTex, vec2 dir) {
    vec2 posCorner = posTex + dir / 4.0;
    return getTextureRGBA (${this.uTextureFlat}, posCorner);
}

void main() {
    vec2 pos = ${this.vTexCoord} * ${this.uTextureSize};

    vec2 posCenter = floor (pos) + vec2 (0.5, 0.5);
    vec2 vecForward = vec2 (pos - posCenter) * 4.0;
    vec2 vecRight = vec2 (vecForward.y, - vecForward.x) * ${this.uRight};
    vec4 posCenterCornerForward = getCornerCache (posCenter, vecForward);
    vec4 posCenterColor = getTextureRGBA (${this.uTexture}, posCenter);

    vec2 posFL = posCenter + vecForward / 2.0 - vecRight / 2.0;
    vec4 posFLCornerRight = getCornerCache (posFL, vecRight);
    vec4 posFLFlatRight = getFlatCache (posFL, vecRight);
    vec4 posFLColor = getTextureRGBA (${this.uTexture}, posFL);

    vec2 posFR = posCenter + vecForward / 2.0 + vecRight / 2.0;
    vec4 posFRCornerLeft = getCornerCache (posFR, - vecRight);
    vec4 posFRFlatLeft = getFlatCache (posFR, - vecRight);
    vec4 posFRColor = getTextureRGBA (${this.uTexture}, posFR);

    // 先认为平滑无效
    float posCenterCornerForwardVal = posCenterCornerForward.a;
    posCenterCornerForward.a = 0.0;

    // 有效的平滑
    if (checkEqual (posFLColor, posFRColor)) {
        posCenterCornerForward.a = posCenterCornerForwardVal;
    };
    // 左不平右平，选左颜色
    if (!match (posFLFlatRight.g, 1.0) && match (posFRFlatLeft.r, 1.0)) {
        posCenterCornerForward.a = posCenterCornerForwardVal;
    };
    // 左平右不平，选右颜色
    if (match (posFLFlatRight.g, 1.0) && !match (posFRFlatLeft.r, 1.0)) {
        posCenterCornerForward.a = posCenterCornerForwardVal;
    };

    gl_FragColor = posCenterCornerForward;
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
    JWebglProgram.uniform(JWebglProgramUniformMat4)
], JWebglProgramTypeSmoothCornerRemoveU.prototype, "uMvp", void 0);
__decorate([
    JWebglProgram.uniform(JWebglProgramUniformSampler2D)
], JWebglProgramTypeSmoothCornerRemoveU.prototype, "uTexture", void 0);
__decorate([
    JWebglProgram.uniform(JWebglProgramUniformVec2)
], JWebglProgramTypeSmoothCornerRemoveU.prototype, "uTextureSize", void 0);
__decorate([
    JWebglProgram.uniform(JWebglProgramUniformSampler2D)
], JWebglProgramTypeSmoothCornerRemoveU.prototype, "uTextureCorner", void 0);
__decorate([
    JWebglProgram.uniform(JWebglProgramUniformSampler2D)
], JWebglProgramTypeSmoothCornerRemoveU.prototype, "uTextureFlat", void 0);
__decorate([
    JWebglProgram.uniform(JWebglProgramUniformFloat)
], JWebglProgramTypeSmoothCornerRemoveU.prototype, "uRight", void 0);
__decorate([
    JWebglProgram.attribute(JWebglProgramAttributeVec4)
], JWebglProgramTypeSmoothCornerRemoveU.prototype, "aPosition", void 0);
__decorate([
    JWebglProgram.attribute(JWebglProgramAttributeVec2)
], JWebglProgramTypeSmoothCornerRemoveU.prototype, "aTexCoord", void 0);
__decorate([
    JWebglProgram.varying(JWebglProgramVaryingVec2)
], JWebglProgramTypeSmoothCornerRemoveU.prototype, "vTexCoord", void 0);

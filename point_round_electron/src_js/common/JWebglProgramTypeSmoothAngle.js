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
import JWebglProgramUniformFloat from "./JWebglProgramUniformFloat.js";
import JWebglProgramUniformMat4 from "./JWebglProgramUniformMat4.js";
import JWebglProgramUniformSampler2D from "./JWebglProgramUniformSampler2D.js";
import JWebglProgramUniformVec2 from "./JWebglProgramUniformVec2.js";
import JWebglProgramVaryingVec2 from "./JWebglProgramVaryingVec2.js";
/**
 * 让部分折线更加平滑 - 影响的角度
 */
export default class JWebglProgramTypeSmoothAngle extends JWebglProgram {
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

// 获取平滑类型
vec4 getEnumCache (vec2 posTex, vec2 dir) {
    vec2 posCorner = posTex + dir / 4.0;
    return getTextureRGBA (${this.uTextureEnum}, posCorner);
}

void main() {
    vec2 pos = ${this.vTexCoord} * ${this.uTextureSize};

    vec2 posCenter = floor (pos) + vec2 (0.5, 0.5);
    vec4 posCenterColor = getTextureRGBA (${this.uTextureMain}, posCenter);
    vec2 vecForward = vec2 (pos - posCenter) * 4.0;
    vec2 vecRight = vec2 (vecForward.y, - vecForward.x) * ${this.uRight};
    vec4 posCenterEnumForward = getEnumCache (posCenter, vecForward);
    vec4 posCenterEnumLeft = getEnumCache (posCenter, - vecRight);
    vec4 posCenterEnumRight = getEnumCache (posCenter, vecRight);

    // 最终结果
    vec4 colorResult = vec4 (0);

    // 仅关心有平滑的角
    if (match (posCenterEnumForward.a, 1.0)) {
        // 是经典平滑
        if (
               match (posCenterEnumForward.r, 0.0)
            && match (posCenterEnumForward.g, 0.0)
            && match (posCenterEnumForward.b, 0.0)
        ) 
        {
            // 左侧也是经典平滑，那么形成折线
            if (
                   match (posCenterEnumLeft.a, 1.0)
                && match (posCenterEnumLeft.r, 0.0)
                && match (posCenterEnumLeft.g, 0.0)
                && match (posCenterEnumLeft.b, 0.0)
            ) 
            {
                // 标注为有效
                colorResult.a = 1.0;
                // 起始角
                colorResult.r = 0.25;
                // 终止角
                colorResult.g = 1.0;

                // 处于反向
                if (${this.uRight} < 0.0) {
                    float valR = colorResult.r;
                    float valG = colorResult.g;
                    colorResult.r = 1.0 - valG;
                    colorResult.g = 1.0 - valR;
                };
            };
        };
    };

    gl_FragColor = colorResult * abs (${this.uRight});
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
    JWebglProgram.define(JWEbglProgramDefine, `0.7071`) // 0.7071067811865476
], JWebglProgramTypeSmoothAngle.prototype, "dForwardLength", void 0);
__decorate([
    JWebglProgram.define(JWEbglProgramDefine, `0.5`)
], JWebglProgramTypeSmoothAngle.prototype, "dForwardUnit", void 0);
__decorate([
    JWebglProgram.define(JWEbglProgramDefine, `0.4142`) // 0.4142135623730951
], JWebglProgramTypeSmoothAngle.prototype, "dForwardLengthSmall", void 0);
__decorate([
    JWebglProgram.define(JWEbglProgramDefine, `0.2928`) // 0.2928932188134525
], JWebglProgramTypeSmoothAngle.prototype, "dForwardUnitSmall", void 0);
__decorate([
    JWebglProgram.define(JWEbglProgramDefine, `1.118`) // 1.118033988749895
], JWebglProgramTypeSmoothAngle.prototype, "dSideLength", void 0);
__decorate([
    JWebglProgram.define(JWEbglProgramDefine, `0.5`)
], JWebglProgramTypeSmoothAngle.prototype, "dSideUnit", void 0);
__decorate([
    JWebglProgram.uniform(JWebglProgramUniformMat4)
], JWebglProgramTypeSmoothAngle.prototype, "uMvp", void 0);
__decorate([
    JWebglProgram.uniform(JWebglProgramUniformVec2)
], JWebglProgramTypeSmoothAngle.prototype, "uTextureSize", void 0);
__decorate([
    JWebglProgram.uniform(JWebglProgramUniformSampler2D)
], JWebglProgramTypeSmoothAngle.prototype, "uTextureMain", void 0);
__decorate([
    JWebglProgram.uniform(JWebglProgramUniformSampler2D)
], JWebglProgramTypeSmoothAngle.prototype, "uTextureEnum", void 0);
__decorate([
    JWebglProgram.uniform(JWebglProgramUniformFloat)
], JWebglProgramTypeSmoothAngle.prototype, "uRight", void 0);
__decorate([
    JWebglProgram.attribute(JWebglProgramAttributeVec4)
], JWebglProgramTypeSmoothAngle.prototype, "aPosition", void 0);
__decorate([
    JWebglProgram.attribute(JWebglProgramAttributeVec2)
], JWebglProgramTypeSmoothAngle.prototype, "aTexCoord", void 0);
__decorate([
    JWebglProgram.varying(JWebglProgramVaryingVec2)
], JWebglProgramTypeSmoothAngle.prototype, "vTexCoord", void 0);

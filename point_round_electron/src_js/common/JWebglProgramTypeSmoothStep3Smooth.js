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
export default class JWebglProgramTypeSmoothStep3Smooth extends JWebglProgram {
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
    return abs (current - target) < 0.5;
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
    vec2 posTex = floor (pos) + vec2 (0.5, 0.5);

    vec2 posCorner = posTex + vecForward / 4.0;
    vec4 colorCorner = getTextureRGBA (${this.uTextureCorner}, posCorner);
    
    vec2 vecRight = vec2 (vecForward.y, -vecForward.x);

    vec2 posLeft = posTex - vecRight;
    vec2 posRight = posTex + vecRight;

    vec2 posFL = posTex + vecForward / 2.0 - vecRight / 2.0;
    vec2 posFR = posTex + vecForward / 2.0 + vecRight / 2.0;

    vec4 colorFL = getTextureRGBA (${this.uTexture}, posFL);
    vec4 colorFR = getTextureRGBA (${this.uTexture}, posFR);

    if (match (colorCorner.a, 1.0)) {
        connect (colorSum, pos, posFL, posFR, ${this.dForward}, colorFL);
    };
}

void main() {
    vec2 pos = ${this.vTexCoord} * ${this.uTextureSize};
    vec4 colorSum = getTextureRGBA (${this.uTexture}, pos);

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
], JWebglProgramTypeSmoothStep3Smooth.prototype, "dForward", void 0);
__decorate([
    JWebglProgram.define(JWEbglProgramDefine, `0.2071`)
], JWebglProgramTypeSmoothStep3Smooth.prototype, "dForwardSmall", void 0);
__decorate([
    JWebglProgram.define(JWEbglProgramDefine, `0.2236`)
], JWebglProgramTypeSmoothStep3Smooth.prototype, "dSide", void 0);
__decorate([
    JWebglProgram.uniform(JWebglProgramUniformMat4)
], JWebglProgramTypeSmoothStep3Smooth.prototype, "uMvp", void 0);
__decorate([
    JWebglProgram.uniform(JWebglProgramUniformSampler2D)
], JWebglProgramTypeSmoothStep3Smooth.prototype, "uTexture", void 0);
__decorate([
    JWebglProgram.uniform(JWebglProgramUniformVec2)
], JWebglProgramTypeSmoothStep3Smooth.prototype, "uTextureSize", void 0);
__decorate([
    JWebglProgram.uniform(JWebglProgramUniformSampler2D)
], JWebglProgramTypeSmoothStep3Smooth.prototype, "uTextureCorner", void 0);
__decorate([
    JWebglProgram.attribute(JWebglProgramAttributeVec4)
], JWebglProgramTypeSmoothStep3Smooth.prototype, "aPosition", void 0);
__decorate([
    JWebglProgram.attribute(JWebglProgramAttributeVec2)
], JWebglProgramTypeSmoothStep3Smooth.prototype, "aTexCoord", void 0);
__decorate([
    JWebglProgram.varying(JWebglProgramVaryingVec2)
], JWebglProgramTypeSmoothStep3Smooth.prototype, "vTexCoord", void 0);

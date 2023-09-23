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
export default class JWebglProgramTypeSmooth3Step1 extends JWebglProgram {
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
// 判断颜色是否一致
float checkEqual (vec4 c1, vec4 c2) {
  // 各分量差值和小于阈值
  return 1.0 - step (0.0, abs (c1 [0] - c2 [0]) + abs (c1 [1] - c2 [1]) + abs (c1 [2] - c2 [2]) + abs (c1 [3] - c2 [3]));
} 
// 对纹理进行采样
vec4 getTextureRGBA (sampler2D texture, vec2 pos) {
    pos /= ${this.uTextureSize};
    // 值为 1 时表示采样位置已超过边界，此时返回空颜色
    float judegeOutOfBorder = step (pos.x, 0.0) + step (1.0, pos.x) + step (pos.y, 0.0) + step (1.0, pos.y);
    judegeOutOfBorder = sign (judegeOutOfBorder);
    return texture2D (texture, pos) * (1.0 - judegeOutOfBorder);
}
void main() {
    vec2 vecForward = ${this.uVecForward} * ${this.dBorderMini};
    vec2 vecRight = ${this.uVecRight} * ${this.dBorderMini};

    // 位置
    vec2 posCurrent = ${this.vTexCoord} * ${this.uTextureSize};
    vec2 posForward = posCurrent + vecForward * 2.0;
    vec2 posBack = posCurrent - vecForward * 2.0;
    vec2 posRight = posCurrent + vecRight * 2.0;
    vec2 posRF = posCurrent + vecRight + vecForward;
    vec2 posRB = posCurrent + vecRight - vecForward;
    vec2 posLeft = posCurrent - vecRight * 2.0;
    vec2 posLF = posCurrent - vecRight + vecForward;
    vec2 posLB = posCurrent - vecRight - vecForward;

    // 颜色
    vec4 colorCurrent = getTextureRGBA (${this.uTexture}, posCurrent);
    vec4 colorForward = getTextureRGBA (${this.uTexture}, posForward);
    vec4 colorBack = getTextureRGBA (${this.uTexture}, posBack);
    vec4 colorRight = getTextureRGBA (${this.uTexture}, posRight);
    vec4 colorRF = getTextureRGBA (${this.uTexture}, posRF);
    vec4 colorRB = getTextureRGBA (${this.uTexture}, posRB);
    vec4 colorLeft = getTextureRGBA (${this.uTexture}, posLeft);
    vec4 colorLF = getTextureRGBA (${this.uTexture}, posLF);
    vec4 colorLB = getTextureRGBA (${this.uTexture}, posLB);

    gl_FragColor = colorCurrent;
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
], JWebglProgramTypeSmooth3Step1.prototype, "dBorderMini", void 0);
__decorate([
    JWebglProgram.define(JWEbglProgramDefine, `0.2236`)
], JWebglProgramTypeSmooth3Step1.prototype, "dBorderLarge", void 0);
__decorate([
    JWebglProgram.uniform(JWebglProgramUniformVec2)
], JWebglProgramTypeSmooth3Step1.prototype, "uVecForward", void 0);
__decorate([
    JWebglProgram.uniform(JWebglProgramUniformVec2)
], JWebglProgramTypeSmooth3Step1.prototype, "uVecRight", void 0);
__decorate([
    JWebglProgram.uniform(JWebglProgramUniformSampler2D)
], JWebglProgramTypeSmooth3Step1.prototype, "uTexture", void 0);
__decorate([
    JWebglProgram.uniform(JWebglProgramUniformVec2)
], JWebglProgramTypeSmooth3Step1.prototype, "uTextureSize", void 0);
__decorate([
    JWebglProgram.uniform(JWebglProgramUniformMat4)
], JWebglProgramTypeSmooth3Step1.prototype, "uMvp", void 0);
__decorate([
    JWebglProgram.attribute(JWebglProgramAttributeVec4)
], JWebglProgramTypeSmooth3Step1.prototype, "aPosition", void 0);
__decorate([
    JWebglProgram.attribute(JWebglProgramAttributeVec2)
], JWebglProgramTypeSmooth3Step1.prototype, "aTexCoord", void 0);
__decorate([
    JWebglProgram.varying(JWebglProgramVaryingVec2)
], JWebglProgramTypeSmooth3Step1.prototype, "vTexCoord", void 0);

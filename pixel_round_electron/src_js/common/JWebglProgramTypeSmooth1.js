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
 * 经典平滑
 */
export default class JWebglProgramTypeSmooth1 extends JWebglProgram {
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
    ${this.vUv} = ${this.aTexCoord};
}
        `;
    }
    impGetnShaderFTxt() {
        return `
// 通过像素位置对纹理进行取样
vec4 texelFetch (vec2 texelFetch_uv) {
  vec2 pos = texelFetch_uv * vec2 (1.0 / ${this.u_TextureSize}.x, 1.0 / ${this.u_TextureSize}.y);
  if (
    pos.x < 0.0 
    || 1.0 < pos.x
    || pos.y < 0.0
    || 1.0 < pos.y
  )
  {
    return vec4 (0, 0, 0, 0);
  };
  return texture2D (${this.uTexture}, pos);
}
// 判断颜色是否一致
bool checkEqual (vec4 c1, vec4 c2) {
  // 各分量差值和小于阈值
  return (
        abs (c1 [0] * c1 [3] - c2 [0] * c2 [3]) 
      + abs (c1 [1] * c1 [3] - c2 [1] * c2 [3]) 
      + abs (c1 [2] * c1 [3] - c2 [2] * c2 [3])
      + abs (c1 [3] - c2 [3])
  )     
  <= 
  ${this.THRESHOLD};
} 
// 该角是否发生平滑
bool cornerAble (vec2 uv, vec2 offsetLeft, vec2 offsetRelative, vec2 offsetRight) {
  vec4 colorUV = texelFetch(uv);
  vec4 colorUVLeft = texelFetch(uv + offsetLeft);
  vec4 colorUVRelative = texelFetch(uv + offsetRelative);
  vec4 colorUVRight = texelFetch(uv + offsetRight);
  // 存在其中一组不造成同类别颜色，那么没问题
  if (!checkEqual (colorUV, colorUVRelative) || !checkEqual (colorUVLeft, colorUVRight)) {
    return true;
  };

  vec4 avgUVWithRelative = (colorUV + colorUVRelative) * 0.5;
  vec4 avgLeftWidthRight = (colorUVLeft + colorUVRight) * 0.5;
  // 4 个位置颜色同类别，那么没问题
  if (checkEqual (avgUVWithRelative, avgLeftWidthRight)) {
    return true;
  };
  // 谁高亮，谁作出妥协
  float weightLeftWithRight = dot (avgLeftWidthRight.rgb, vec3 (1, 1, 1)) * avgLeftWidthRight.a;
  float weightUVWithRelative = dot (avgUVWithRelative.rgb, vec3 (1, 1, 1)) * avgUVWithRelative.a;
  return weightLeftWithRight * ${this.isntLine} < weightUVWithRelative * ${this.isntLine};
}
// 如果在阈值内，绘制连接 2 个像素的对角线
bool diag (inout vec4 sum, vec2 uv, vec2 p1, vec2 p2, float tickness) {
  // 采样 p1
  vec4 v1 = texelFetch (uv + p1);
  // 采样 p2
  vec4 v2 = texelFetch (uv + p2);
  // p1、p2 颜色一致
  if (checkEqual (v1, v2)) {
    // 向量: p1 -> p2
      vec2 dir = p2 - p1;
    // 向量: p1 -> p2 顺时针旋转 90 度
    dir = normalize (vec2 (dir.y, -dir.x));
    // 向量: p1 像素点中心 -> uv
    vec2 lp = uv - (floor (uv + p1) + 0.5);
    // lp 在 dir 上的投影，取值 0 - 1.4142135623730951;
    float shadow = dot (lp, dir);
    // 越靠内权重 l 越大
    float l = clamp ((tickness - shadow) * ${this.AA_SCALE}, 0.0, 1.0);
    // 根据权重，进行取色
    sum = mix (sum, v1, l); 
      return true;
  };
  return false;
}
// 对角平滑
vec4 mainImageAngle (in vec2 fragCoord)
{
  fragCoord *= ${this.u_TextureSize};
  // 采样位置
  vec2 ip = fragCoord;
  // 以最近像素作为背景
  vec4 s = texelFetch (ip);
  // 将周围像素的抗锯齿对角线绘制为前景
  // 如果左、上连接
  if (cornerAble (ip, vec2 (-1, 0), vec2 (-1, 1), vec2 (0, 1))) {
    if (diag (s, ip, vec2 (-1, 0), vec2 (0, 1), ${this.TICKNESS_1_1})) { 
      // 尝试连接左、右上
      diag (s, ip, vec2 (-1, 0), vec2 (1, 1), ${this.TICKNESS_1_2});
      // 尝试连接左下、上
      diag (s, ip, vec2 (-1, -1), vec2 (0, 1), ${this.TICKNESS_1_2});
    };
  };
  
  // 如果上、右连接
  if (cornerAble (ip, vec2 (0, 1), vec2 (1, 1), vec2 (1, 0))) {
    if (diag (s, ip, vec2 (0, 1), vec2 (1, 0), ${this.TICKNESS_1_1})) {
      // 尝试连接右、右下
      diag (s, ip, vec2 (0, 1), vec2 (1, -1), ${this.TICKNESS_1_2});
      // 尝试连接左上、右
      diag (s, ip, vec2 (-1, 1), vec2 (1, 0), ${this.TICKNESS_1_2});
    };
  };
  // 如果右、下连接
  if (cornerAble (ip, vec2 (1, 0), vec2 (1, -1), vec2 (0, -1))) {
    if (diag (s, ip, vec2 (1, 0), vec2 (0, -1), ${this.TICKNESS_1_1})) { 
      // 尝试连接右、左上
      diag (s, ip, vec2 (1, 0), vec2 (-1, -1), ${this.TICKNESS_1_2});
      // 尝试连接右上、左
      diag (s, ip, vec2 (1, 1), vec2 (0, -1), ${this.TICKNESS_1_2});
    };
  };
  
  // 如果下、左连接
  if (cornerAble (ip, vec2 (0, -1), vec2 (-1, -1), vec2 (-1, 0))) {
    if (diag (s, ip, vec2 (0, -1), vec2 (-1, 0), ${this.TICKNESS_1_1})) {
      // 尝试连接下、左上
         diag (s, ip, vec2 (0, -1), vec2 (-1, 1), ${this.TICKNESS_1_2});
      // 尝试连接右下、左
      diag (s, ip, vec2 (1, -1), vec2 (-1, 0), ${this.TICKNESS_1_2});
    };
  };
  return s;
}

void main() {
    gl_FragColor = mainImageAngle (${this.vUv});
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
    JWebglProgram.define(JWEbglProgramDefine, `0.05`)
], JWebglProgramTypeSmooth1.prototype, "THRESHOLD", void 0);
__decorate([
    JWebglProgram.define(JWEbglProgramDefine, `10000.0`)
], JWebglProgramTypeSmooth1.prototype, "AA_SCALE", void 0);
__decorate([
    JWebglProgram.define(JWEbglProgramDefine, `0.3535`)
], JWebglProgramTypeSmooth1.prototype, "TICKNESS_1_1", void 0);
__decorate([
    JWebglProgram.define(JWEbglProgramDefine, `0.2236`)
], JWebglProgramTypeSmooth1.prototype, "TICKNESS_1_2", void 0);
__decorate([
    JWebglProgram.uniform(JWebglProgramUniformMat4)
], JWebglProgramTypeSmooth1.prototype, "uMvp", void 0);
__decorate([
    JWebglProgram.uniform(JWebglProgramUniformSampler2D)
], JWebglProgramTypeSmooth1.prototype, "uTexture", void 0);
__decorate([
    JWebglProgram.uniform(JWebglProgramUniformVec2)
], JWebglProgramTypeSmooth1.prototype, "u_TextureSize", void 0);
__decorate([
    JWebglProgram.uniform(JWebglProgramUniformFloat)
], JWebglProgramTypeSmooth1.prototype, "isntLine", void 0);
__decorate([
    JWebglProgram.attribute(JWebglProgramAttributeVec4)
], JWebglProgramTypeSmooth1.prototype, "aPosition", void 0);
__decorate([
    JWebglProgram.attribute(JWebglProgramAttributeVec2)
], JWebglProgramTypeSmooth1.prototype, "aTexCoord", void 0);
__decorate([
    JWebglProgram.varying(JWebglProgramVaryingVec2)
], JWebglProgramTypeSmooth1.prototype, "vUv", void 0);

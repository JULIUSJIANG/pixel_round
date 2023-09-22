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
export default class JWebglProgramTypeSmooth2 extends JWebglProgram {
    @JWebglProgram.define (JWEbglProgramDefine, `0.3535`)
    dTickness1: JWEbglProgramDefine;
    @JWebglProgram.define (JWEbglProgramDefine, `0.2236`)
    dTickness2: JWEbglProgramDefine;

    @JWebglProgram.uniform (JWebglProgramUniformMat4)
    uMvp: JWebglProgramUniformMat4;
    @JWebglProgram.uniform (JWebglProgramUniformSampler2D)
    uTextureMain: JWebglProgramUniformSampler2D;
    @JWebglProgram.uniform (JWebglProgramUniformSampler2D)
    uTextureMark: JWebglProgramUniformSampler2D;
    @JWebglProgram.uniform (JWebglProgramUniformVec2)
    uTextureSize: JWebglProgramUniformVec2;

    @JWebglProgram.attribute (JWebglProgramAttributeVec4)
    aPosition: JWebglProgramAttributeVec4;
    @JWebglProgram.attribute (JWebglProgramAttributeVec2)
    aTexCoord: JWebglProgramAttributeVec2;

    @JWebglProgram.varying (JWebglProgramVaryingVec2)
    vUv: JWebglProgramVaryingVec2;

    impGetShaderVTxt (): string {
        return `
void main() {
    gl_Position = ${this.uMvp} * ${this.aPosition};
    ${this.vUv} = ${this.aTexCoord};
}
        `;
    }

    impGetnShaderFTxt (): string {
        return `
// 通过像素位置对纹理进行取样
vec4 texelFetch (sampler2D tex, vec2 texelFetch_uv) {
  vec2 pos = texelFetch_uv * vec2 (1.0 / ${this.uTextureSize}.x, 1.0 / ${this.uTextureSize}.y);
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
// 判断颜色是否一致
bool checkEqual (vec4 c1, vec4 c2) {
  // 各分量差值和小于阈值
  return (
        abs (c1 [0] - c2 [0]) 
      + abs (c1 [1] - c2 [1]) 
      + abs (c1 [2] - c2 [2])
      + abs (c1 [3] - c2 [3])
  )     
  <= 
  0.0;
} 
// 该角是否发生平滑
bool cornerAble (vec2 uv, vec2 offsetLeft, vec2 offsetRelative, vec2 offsetRight) {
  // 获取纹理颜色
  vec4 colorUV = texelFetch(${this.uTextureMain}, uv);
  vec4 colorUVLeft = texelFetch(${this.uTextureMain}, uv + offsetLeft);
  vec4 colorUVRelative = texelFetch(${this.uTextureMain}, uv + offsetRelative);
  vec4 colorUVRight = texelFetch(${this.uTextureMain}, uv + offsetRight);

  // 不是 2 个对角线分别为俩种颜色的情况，按照正常流程进行平滑
  if (!checkEqual (colorUV, colorUVRelative) || !checkEqual (colorUVLeft, colorUVRight)) {
    return true;
  };

  // 4 个位置颜色一致，不必平滑
  if (checkEqual (colorUV, colorUVLeft)) {
    return false;
  };

  // 获取分组标号
  vec4 markUV = texelFetch(${this.uTextureMark}, uv);
  vec4 markUVLeft = texelFetch(${this.uTextureMark}, uv + offsetLeft);
  vec4 markUVRelative = texelFetch(${this.uTextureMark}, uv + offsetRelative);
  vec4 markUVRight = texelFetch(${this.uTextureMark}, uv + offsetRight);

  // uv 位置为不透明块
  if (colorUV.a != 0.0) {
    // 当自身不为同标记的组时候允许平滑
    return markUV.r != markUVRelative.r;
  };
  // uv 位置为透明块
  if (colorUV.a == 0.0) {
    // 当俩侧为同标记的组时候允许平滑
    return markUVLeft.r == markUVRight.r;
  };
  return false;
}
// 如果在阈值内，绘制连接 2 个像素的对角线
bool diag (inout vec4 sum, vec2 uv, vec2 p1, vec2 p2, float tickness) {
  // 采样 p1
  vec4 v1 = texelFetch (${this.uTextureMain}, uv + p1);
  // 采样 p2
  vec4 v2 = texelFetch (${this.uTextureMain}, uv + p2);
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
    // 准线以内，对颜色进行替换
    float l = step (shadow, tickness);
    // 根据权重，进行取色
    sum = mix (sum, v1, l); 
    return true;
  };
  return false;
}
// 对角平滑
vec4 mainImageAngle (in vec2 fragCoord)
{
  fragCoord *= ${this.uTextureSize};
  // 采样位置
  vec2 ip = fragCoord;
  // 以最近像素作为背景
  vec4 s = texelFetch (${this.uTextureMain}, ip);
  // 将周围像素的抗锯齿对角线绘制为前景
  // 如果左、上连接
  if (cornerAble (ip, vec2 (-1, 0), vec2 (-1, 1), vec2 (0, 1))) {
    if (diag (s, ip, vec2 (-1, 0), vec2 (0, 1), ${this.dTickness1})) { 
      // 尝试连接左、右上
      diag (s, ip, vec2 (-1, 0), vec2 (1, 1), ${this.dTickness2});
      // 尝试连接左下、上
      diag (s, ip, vec2 (-1, -1), vec2 (0, 1), ${this.dTickness2});
    };
  };
  
  // 如果上、右连接
  if (cornerAble (ip, vec2 (0, 1), vec2 (1, 1), vec2 (1, 0))) {
    if (diag (s, ip, vec2 (0, 1), vec2 (1, 0), ${this.dTickness1})) {
      // 尝试连接右、右下
      diag (s, ip, vec2 (0, 1), vec2 (1, -1), ${this.dTickness2});
      // 尝试连接左上、右
      diag (s, ip, vec2 (-1, 1), vec2 (1, 0), ${this.dTickness2});
    };
  };
  // 如果右、下连接
  if (cornerAble (ip, vec2 (1, 0), vec2 (1, -1), vec2 (0, -1))) {
    if (diag (s, ip, vec2 (1, 0), vec2 (0, -1), ${this.dTickness1})) { 
      // 尝试连接右、左上
      diag (s, ip, vec2 (1, 0), vec2 (-1, -1), ${this.dTickness2});
      // 尝试连接右上、左
      diag (s, ip, vec2 (1, 1), vec2 (0, -1), ${this.dTickness2});
    };
  };
  
  // 如果下、左连接
  if (cornerAble (ip, vec2 (0, -1), vec2 (-1, -1), vec2 (-1, 0))) {
    if (diag (s, ip, vec2 (0, -1), vec2 (-1, 0), ${this.dTickness1})) {
      // 尝试连接下、左上
         diag (s, ip, vec2 (0, -1), vec2 (-1, 1), ${this.dTickness2});
      // 尝试连接右下、左
      diag (s, ip, vec2 (1, -1), vec2 (-1, 0), ${this.dTickness2});
    };
  };
  return s;
}

void main() {
    gl_FragColor = mainImageAngle (${this.vUv});
}
        `;
    }

    impGetMode (): JWebglEnum.DrawArraysMode {
        return JWebglEnum.DrawArraysMode.TRIANGLES;
    }

    private _addLeft = new JWebglMathVector4 ();

    private _addUp = new JWebglMathVector4 ();

    private _addPosLB = new JWebglMathVector4 ();

    private _addPosRB = new JWebglMathVector4 ();

    private _addPosRT = new JWebglMathVector4 ();

    private _addPosLT = new JWebglMathVector4 ();

    private _addOffsetX = new JWebglMathVector4 ();

    private _addOffsetY = new JWebglMathVector4 ();

    /**
     * 添加一条线
     * @param posA 
     * @param posB 
     * @param color 
     * @returns 
     */
    add (
        pos: JWebglMathVector4,
        forward: JWebglMathVector4,
        up: JWebglMathVector4,
        width: number,
        height: number,
    )
    {
        JWebglMathVector4.cross (up, forward, this._addLeft);
        JWebglMathVector4.cross (forward, this._addLeft, this._addUp);
        this._addLeft.normalize ();
        this._addUp.normalize ();

        JWebglMathVector4.scale (this._addLeft, width / 2, this._addOffsetX);
        JWebglMathVector4.scale (this._addUp, height / 2, this._addOffsetY);
        JWebglMathVector4.add (pos, this._addOffsetX, this._addOffsetY, this._addPosLT);

        JWebglMathVector4.scale (this._addLeft, -width / 2, this._addOffsetX);
        JWebglMathVector4.scale (this._addUp, height / 2, this._addOffsetY);
        JWebglMathVector4.add (pos, this._addOffsetX, this._addOffsetY, this._addPosRT);

        JWebglMathVector4.scale (this._addLeft, -width / 2, this._addOffsetX);
        JWebglMathVector4.scale (this._addUp, -height / 2, this._addOffsetY);
        JWebglMathVector4.add (pos, this._addOffsetX, this._addOffsetY, this._addPosRB);

        JWebglMathVector4.scale (this._addLeft, width / 2, this._addOffsetX);
        JWebglMathVector4.scale (this._addUp, -height / 2, this._addOffsetY);
        JWebglMathVector4.add (pos, this._addOffsetX, this._addOffsetY, this._addPosLB);

        let idxLT = this.addAttributeData (this._addPosLT, 0, 1);
        let idxRT = this.addAttributeData (this._addPosRT, 1, 1);
        let idxRB = this.addAttributeData (this._addPosRB, 1, 0);
        let idxLB = this.addAttributeData (this._addPosLB, 0, 0);
        this._addIndexData (idxLB, idxRB, idxRT, idxLB, idxRT, idxLT);
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
    private addAttributeData (
        pos: JWebglMathVector4,
        texCoordX: number,
        texCoordY: number
    )
    {
        return this._addAttributeData (
            pos.elements [0], 
            pos.elements [1], 
            pos.elements [2], 
            1, 
            
            texCoordX, 
            texCoordY
        );
    }
}
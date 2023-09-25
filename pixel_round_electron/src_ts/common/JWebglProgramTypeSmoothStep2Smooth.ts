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

export default class JWebglProgramTypeSmoothStep2Smooth extends JWebglProgram {

    @JWebglProgram.define (JWEbglProgramDefine, `0.3535`)
    dTickness1: JWEbglProgramDefine;
    @JWebglProgram.define (JWEbglProgramDefine, `0.2236`)
    dTickness2: JWEbglProgramDefine;

    @JWebglProgram.define (JWEbglProgramDefine, `4.0`)
    dSmoothIdMax: JWEbglProgramDefine;

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
    vTexCoord: JWebglProgramVaryingVec2;

    impGetShaderVTxt (): string {
        return `
void main() {
    gl_Position = ${this.uMvp} * ${this.aPosition};
    ${this.vTexCoord} = ${this.aTexCoord};
}
        `;
    }

    impGetnShaderFTxt (): string {
        return `
// 通过像素位置对纹理进行取样
vec4 getTextureRGBA (sampler2D tex, vec2 getTextureRGBA_uv) {
  vec2 pos = getTextureRGBA_uv * vec2 (1.0 / ${this.uTextureSize}.x, 1.0 / ${this.uTextureSize}.y);
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
// 如果在阈值内，绘制连接 2 个像素的对角线
void connect (inout vec4 sum, vec2 uv, vec2 p1, vec2 p2, float tickness) {
  // 采样 p1
  vec4 v1 = getTextureRGBA (${this.uTextureMain}, p1);
  // 采样 p2
  vec4 v2 = getTextureRGBA (${this.uTextureMain}, p2);
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
  sum = mix (sum, v1, l); 
}
// 2 个数是否匹配
bool match (float current, float target) {
    return abs (current - target) < 0.5;
}
// 处理一个角
void corner (inout vec4 colorMain, float mark, vec2 pos, vec2 dirForward) {
    vec2 dirRight = vec2 (dirForward.y, -dirForward.x);

    vec2 posRight = pos + dirRight * 2.0;
    vec2 posRightForward = pos + dirRight + dirForward;
    vec2 posLeft = pos - dirRight * 2.0;
    vec2 posLeftForward = pos - dirRight + dirForward;

    if (match (mark, 1.0)) {
        connect (colorMain, pos, posLeftForward, posRightForward, ${this.dTickness1});
    };
    if (match (mark, 2.0) || match (mark, 4.0)) {
        connect (colorMain, pos, posLeft, posRightForward, ${this.dTickness2});
    };
    if (match (mark, 3.0) || match (mark, 4.0)) {
        connect (colorMain, pos, posLeftForward, posRight, ${this.dTickness2});
    };
}
void main () {
    vec4 colorMain = texture2D (${this.uTextureMain}, ${this.vTexCoord});
    vec4 colorMark = texture2D (${this.uTextureMark}, ${this.vTexCoord}) * ${this.dSmoothIdMax};

    // if (match (colorMark.a, 4.0)) {
    //     gl_FragColor = vec4 (1);
    // };

    vec2 pos = ${this.vTexCoord} * ${this.uTextureSize};
    corner (colorMain, colorMark.r, pos, vec2 (- 0.5,   0.5));
    corner (colorMain, colorMark.g, pos, vec2 (  0.5,   0.5));
    corner (colorMain, colorMark.b, pos, vec2 (  0.5, - 0.5));
    corner (colorMain, colorMark.a, pos, vec2 (- 0.5, - 0.5));
    gl_FragColor = colorMain;
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
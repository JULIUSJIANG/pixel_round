import JWebglEnum from "./JWebglEnum";
import JWebglMathVector4 from "./JWebglMathVector4";
import JWebglProgram from "./JWebglProgram";
import JWebglProgramAttributeVec2 from "./JWebglProgramAttributeVec2";
import JWebglProgramAttributeVec4 from "./JWebglProgramAttributeVec4";
import JWebglProgramUniformFloat from "./JWebglProgramUniformFloat";
import JWebglProgramUniformMat4 from "./JWebglProgramUniformMat4";
import JWebglProgramUniformSampler2D from "./JWebglProgramUniformSampler2D";
import JWebglProgramUniformVec2 from "./JWebglProgramUniformVec2";
import JWebglProgramVaryingVec2 from "./JWebglProgramVaryingVec2";

/**
 * 拐角数据
 */
export default class JWebglProgramTypeSmoothCornerData extends JWebglProgram {

    @JWebglProgram.uniform (JWebglProgramUniformMat4)
    uMvp: JWebglProgramUniformMat4;

    @JWebglProgram.uniform (JWebglProgramUniformSampler2D)
    uTextureMain: JWebglProgramUniformSampler2D;

    @JWebglProgram.uniform (JWebglProgramUniformSampler2D)
    uTextureFlat: JWebglProgramUniformSampler2D;

    @JWebglProgram.uniform (JWebglProgramUniformVec2)
    uTextureSize: JWebglProgramUniformVec2;

    @JWebglProgram.uniform (JWebglProgramUniformFloat)
    uRight: JWebglProgramUniformFloat;

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
    vec4 posCenterColor = getTextureRGBA (${this.uTextureMain}, posCenter);

    vec2 posLeft = posCenter - vecRight;
    vec4 posLeftColor = getTextureRGBA (${this.uTextureMain}, posLeft);

    vec2 posRight = posCenter + vecRight;
    vec4 posRightColor = getTextureRGBA (${this.uTextureMain}, posRight);

    vec2 posForward = posCenter + vecForward;
    vec2 posBack = posCenter - vecForward;

    vec2 posFL = posCenter + vecForward / 2.0 - vecRight / 2.0;
    vec4 posFLColor = getTextureRGBA (${this.uTextureMain}, posFL);
    vec4 posFLFlatRight = getFlatCache (posFL, vecRight);

    vec2 posFR = posCenter + vecForward / 2.0 + vecRight / 2.0;
    vec4 posFRColor = getTextureRGBA (${this.uTextureMain}, posFR);
    vec4 posFRFlatLeft = getFlatCache (posFR, - vecRight);

    vec2 posBL = posCenter - vecForward / 2.0 - vecRight / 2.0;

    vec2 posBR = posCenter - vecForward / 2.0 + vecRight / 2.0;

    vec4 colorResult = vec4 (0.0, 0.0, 0.0, 0.0);

    // 前方相邻的 2 个块颜色一致
    if (checkEqual (posFLColor, posFRColor)) {
        colorResult.a = 1.0;
        colorResult.r = 1.0;
        colorResult.g = 1.0;
    };
    // 与左方颜色一致或者与右方颜色一致
    if (checkEqual (posLeftColor, posCenterColor) || checkEqual (posCenterColor, posRightColor)) {
        colorResult.a = 1.0;
        // 左不平右平，选左颜色
        if (!match (posFLFlatRight.g, 1.0) && match (posFRFlatLeft.r, 1.0)) {
            colorResult.r = 1.0;
        };
        // 左平右不平，选右颜色
        if (match (posFLFlatRight.g, 1.0) && !match (posFRFlatLeft.r, 1.0)) {
            colorResult.g = 1.0;
        };
        // 无法根据平坦信息得出平滑颜色，那么根据兼容方向得出平滑颜色
        if (match (colorResult.r, 0.0) && match (colorResult.g, 0.0)) {
            // 不需要理会右边，那就取色左边
            if (!checkEqual (posCenterColor, posRightColor)) {
                colorResult.r = 1.0;
            };
            // 不需要理会左边，那就取色右边
            if (!checkEqual (posLeftColor, posCenterColor)) {
                colorResult.g = 1.0;
            };
        };
    };
    // 不需要多余的平滑
    if (checkEqual (posFLColor, posCenterColor) || checkEqual (posFRColor, posCenterColor)) {
        colorResult.a = 0.0;
    };
    // 没能给出一个明确的颜色，那么取消该平滑
    if (match (colorResult.r, 0.0) && match (colorResult.g, 0.0)) {
        colorResult.a = 0.0;
    };

    gl_FragColor = colorResult;
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
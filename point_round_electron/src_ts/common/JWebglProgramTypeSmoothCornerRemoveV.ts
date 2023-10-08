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
 * 剔除导致尖锐的平滑
 */
export default class JWebglProgramTypeSmoothCornerRemoveV extends JWebglProgram {

    @JWebglProgram.uniform (JWebglProgramUniformMat4)
    uMvp: JWebglProgramUniformMat4;
    @JWebglProgram.uniform (JWebglProgramUniformVec2)
    uTextureSize: JWebglProgramUniformVec2;
    @JWebglProgram.uniform (JWebglProgramUniformSampler2D)
    uTextureMain: JWebglProgramUniformSampler2D;
    @JWebglProgram.uniform (JWebglProgramUniformSampler2D)
    uTextureCorner: JWebglProgramUniformSampler2D;
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

// 获取角的缓存数据
vec4 getCornerCache (vec2 posTex, vec2 dir) {
    vec2 posCorner = posTex + dir / 4.0;
    return getTextureRGBA (${this.uTextureCorner}, posCorner);
}

void main() {
    vec2 pos = ${this.vTexCoord} * ${this.uTextureSize};

    vec2 posCenter = floor (pos) + vec2 (0.5, 0.5);
    vec2 vecForward = vec2 (pos - posCenter) * 4.0;
    vec2 vecRight = vec2 (vecForward.y, - vecForward.x) * ${this.uRight};
    vec4 posCenterCornerForward = getCornerCache (posCenter, vecForward);
    vec4 posCenterCornerBack = getCornerCache (posCenter, - vecForward);
    vec4 posCenterCornerLeft = getCornerCache (posCenter, - vecRight);
    vec4 posCenterCornerRight = getCornerCache (posCenter, vecRight);
    vec4 posCenterColor = getTextureRGBA (${this.uTextureMain}, posCenter);

    vec2 posFL = posCenter + vecForward / 2.0 - vecRight / 2.0;
    vec4 posFLCornerBack = getCornerCache (posFL, - vecForward);
    vec4 posFLCornerRight = getCornerCache (posFL, vecRight);
    vec4 posFLColor = getTextureRGBA (${this.uTextureMain}, posFL);

    vec2 posFR = posCenter + vecForward / 2.0 + vecRight / 2.0;
    vec4 posFRCornerBack = getCornerCache (posFR, - vecForward);
    vec4 posFRCornerLeft = getCornerCache (posFR, - vecRight);
    vec4 posFRColor = getTextureRGBA (${this.uTextureMain}, posFR);

    vec2 posLeft = posCenter - vecRight;
    vec4 posLeftCornerForward = getCornerCache (posLeft, vecForward);

    vec2 posRight = posCenter + vecRight;
    vec4 posRightCornerForward = getCornerCache (posRight, vecForward);

    vec2 posForward = posCenter + vecForward;
    vec4 posForwardColor = getTextureRGBA (${this.uTextureMain}, posForward);

    float posCenterCornerForwardVal = posCenterCornerForward.a;

    // 由左向右的尖锐
    if (
            match (posCenterCornerForwardVal, 1.0)
        &&  match (posCenterCornerForward.g, 0.0)
        &&  match (posFLCornerBack.a, 1.0)
        &&  match (posFLCornerBack.r, 1.0)
    )
    {
        posCenterCornerForward.a = 0.0;
    };

    // 由右向左的尖锐
    if (
            match (posCenterCornerForwardVal, 1.0)
        &&  match (posCenterCornerForward.r, 0.0)
        &&  match (posFRCornerBack.a, 1.0)
        &&  match (posFRCornerBack.g, 1.0)
    )
    {
        posCenterCornerForward.a = 0.0;
    };

    // 不破坏向前的壁垒 - 偏左
    if (
           match (posFLCornerBack.r, 1.0)
        && match (posFLCornerBack.g, 1.0)
        && match (posLeftCornerForward.a, 1.0)
    ) 
    {
        posCenterCornerForward.a = posCenterCornerForwardVal;
    };
    // 不破坏向前的壁垒 - 中间型
    if (
            match (posFLCornerBack.a, 1.0) 
        &&  match (posFRCornerBack.a, 1.0)
        &&  match (posFLCornerBack.r, 1.0)
        &&  match (posFRCornerBack.g, 1.0)
    ) 
    {
        posCenterCornerForward.a = posCenterCornerForwardVal;
    };
    // 不破坏向前的壁垒 - 偏右
    if (
           match (posFRCornerBack.r, 1.0)
        && match (posFRCornerBack.g, 1.0)
        && match (posRightCornerForward.a, 1.0)
    ) 
    {
        posCenterCornerForward.a = posCenterCornerForwardVal;
    };

    // 不破坏向后的壁垒 - 偏左型
    if (
           match (posLeftCornerForward.a, 1.0)
        && match (posFLCornerBack.a, 1.0)
        && match (posLeftCornerForward.g, 1.0)
        && match (posCenterCornerForward.r, 1.0)
    )
    {
        posCenterCornerForward.a = posCenterCornerForwardVal;
    };
    // 不破坏向后的壁垒 - 中间型
    if (
           match (posCenterCornerForward.r, 1.0)
        && match (posCenterCornerForward.g, 1.0)
        && match (posFLCornerBack.a, 1.0)
        && match (posFRCornerBack.a, 1.0)
    ) 
    {
        posCenterCornerForward.a = posCenterCornerForwardVal;
    };
    // 不破坏向后的壁垒 - 偏右型
    if (
           match (posRightCornerForward.a, 1.0)
        && match (posFRCornerBack.a, 1.0)
        && match (posRightCornerForward.r, 1.0)
        && match (posCenterCornerForward.g, 1.0)
    ) 
    {
        posCenterCornerForward.a = posCenterCornerForwardVal;
    };

    // 不破坏 L 开口向左
    if (
           match (posFRCornerLeft.a, 1.0)
        && match (posCenterCornerForward.r, 1.0)
        && match (posFRCornerLeft.g, 1.0)
        && checkEqual (posFLColor, posForwardColor)
    ) 
    {
        posCenterCornerForward.a = posCenterCornerForwardVal;
    };
    // 不破坏 L 开口向右
    if (
           match (posFLCornerRight.a, 1.0)
        && match (posCenterCornerForward.g, 1.0)
        && match (posFLCornerRight.r, 1.0)
        && checkEqual (posFRColor, posForwardColor)
    ) 
    {
        posCenterCornerForward.a = posCenterCornerForwardVal;
    };

    // 不破坏反弹表现
    // if (
    //        match (posCenterCornerLeft.a, 1.0)
    //     || match (posCenterCornerRight.a, 1.0)
    // )
    // {
    //     posCenterCornerForward.a = posCenterCornerForwardVal;
    // };

    // 不破坏层次表现
    if (match (posCenterCornerBack.a, 1.0)) {
        posCenterCornerForward.a = posCenterCornerForwardVal;
    };

    gl_FragColor = posCenterCornerForward;
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
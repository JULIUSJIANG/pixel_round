import JWebglEnum from "./JWebglEnum";
import JWebglMathVector4 from "./JWebglMathVector4";
import JWebglProgram from "./JWebglProgram";
import JWebglProgramAttributeVec2 from "./JWebglProgramAttributeVec2";
import JWebglProgramAttributeVec4 from "./JWebglProgramAttributeVec4";
import JWEbglProgramDefine from "./JWebglProgramDefine";
import JWebglProgramUniformMat4 from "./JWebglProgramUniformMat4";
import JWebglProgramUniformSampler2D from "./JWebglProgramUniformSampler2D";
import JWebglProgramUniformVec2 from "./JWebglProgramUniformVec2";
import JWebglProgramVaryingVec2 from "./JWebglProgramVaryingVec2";

/**
 * 正式平滑 - 经典款，绝大部分交界处不可导
 */
export default class JWebglProgramTypeSmoothDisplayOrdinary extends JWebglProgram {
    // 经典平滑厚度
    @JWebglProgram.define (JWEbglProgramDefine, `0.3535`)
    dForward: JWEbglProgramDefine;
    // 侧边平滑厚度
    @JWebglProgram.define (JWEbglProgramDefine, `0.4472`)
    dSide: JWEbglProgramDefine;
    // 大倾斜厚度
    @JWebglProgram.define (JWEbglProgramDefine, `0.4743`)
    dL: JWEbglProgramDefine;
    // 小倾斜厚度
    @JWebglProgram.define (JWEbglProgramDefine, `0.1581`)
    dS: JWEbglProgramDefine;

    @JWebglProgram.uniform (JWebglProgramUniformMat4)
    uMvp: JWebglProgramUniformMat4;
    @JWebglProgram.uniform (JWebglProgramUniformSampler2D)
    uTextureMain: JWebglProgramUniformSampler2D;
    @JWebglProgram.uniform (JWebglProgramUniformVec2)
    uTextureSize: JWebglProgramUniformVec2;
    @JWebglProgram.uniform (JWebglProgramUniformSampler2D)
    uTextureCorner: JWebglProgramUniformSampler2D;
    @JWebglProgram.uniform (JWebglProgramUniformSampler2D)
    uTextureEnum: JWebglProgramUniformSampler2D;
    @JWebglProgram.uniform (JWebglProgramUniformSampler2D)
    uTextureColorSelect: JWebglProgramUniformSampler2D;

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

// 获取平滑颜色
vec4 getColorSelectCache (vec2 posTex, vec2 dir) {
    vec2 posCorner = posTex + dir / 4.0;
    return getTextureRGBA (${this.uTextureColorSelect}, posCorner);
}

// 进行平滑
void connect (inout vec4 sum, vec2 uv, vec2 p1, vec2 p2, float tickness, vec4 smoothColor) {
    // 向量: p1 -> p2
    vec2 dir = p2 - p1;
    // 向量: p1 -> p2 顺时针旋转 90 度
    dir = normalize (vec2 (dir.y, -dir.x));
    // 向量: p1 像素点中心 -> uv
    vec2 lp = uv - p1;
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
    vec4 posTexCornerForward = getCornerCache (posTex, vecForward);
    vec4 posTexEnumForward = getEnumCache (posTex, vecForward);
    vec4 colorSmooth = getColorSelectCache (posTex, vecForward);
    vec4 posTexColor = getTextureRGBA (${this.uTextureMain}, posTex);
    
    vec2 vecRight = vec2 (vecForward.y, -vecForward.x);

    vec2 posForward = posTex + vecForward;
    vec2 posBack = posTex - vecForward;

    vec2 posLeft = posTex - vecRight;
    vec2 posRight = posTex + vecRight;

    vec2 posFL = posTex + vecForward / 2.0 - vecRight / 2.0;
    vec4 posFLColor = getTextureRGBA (${this.uTextureMain}, posFL);

    vec2 posFR = posTex + vecForward / 2.0 + vecRight / 2.0;
    vec4 posFRColor = getTextureRGBA (${this.uTextureMain}, posFR);

    vec2 posBL = posTex + vecForward / 2.0 - vecRight / 2.0;
    vec2 posBR = posTex + vecForward / 2.0 + vecRight / 2.0;

    // 需要平滑
    if (match (posTexEnumForward.a, 1.0)) {
        // 向量起始位置
        vec2 posStart = posTex + vecForward / 2.0;
        // 经典平滑
        if (match (posTexEnumForward.r, 0.0) && match (posTexEnumForward.g, 0.0)) {
            connect (colorSum, pos, posStart, posStart + vecRight, ${this.dForward}, colorSmooth);
        };
        // 左倾平滑
        if (match (posTexEnumForward.r, 1.0)) {
            connect (colorSum, pos, posStart, posStart + vecRight / 2.0 * 3.0 + vecForward / 2.0, ${this.dSide}, colorSmooth);
        };
        // 右倾平滑
        if (match (posTexEnumForward.g, 1.0)) {
            connect (colorSum, pos, posStart, posStart + vecRight / 2.0 * 3.0 - vecForward / 2.0, ${this.dSide}, colorSmooth);
        };
        // 大左倾正 y 方向
        vec2 posEndLeft = posStart + vecRight / 2.0 * 2.0 + vecForward / 2.0 * 1.0;
        // 大左倾平滑
        if (match (posTexEnumForward.r, 0.7)) {
            connect (colorSum, pos, posStart, posEndLeft, ${this.dL}, colorSmooth);
        };
        // 小左倾平滑
        if (match (posTexEnumForward.r, 0.3)) {
            connect (colorSum, pos, posStart, posEndLeft, ${this.dS}, colorSmooth);
        };
        // 大右倾正 y 方向
        vec2 posEndRight = posStart + vecRight / 2.0 * 2.0 - vecForward / 2.0 * 1.0;
        // 大右倾平滑
        if (match (posTexEnumForward.g, 0.7)) {
            connect (colorSum, pos, posStart, posEndRight, ${this.dL}, colorSmooth);
        };
        // 小右倾平滑
        if (match (posTexEnumForward.g, 0.3)) {
            connect (colorSum, pos, posStart, posEndRight, ${this.dS}, colorSmooth);
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
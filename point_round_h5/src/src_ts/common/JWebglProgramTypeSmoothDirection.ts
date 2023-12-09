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
 * 替换某些短距平滑为长距平滑
 */
export default class JWebglProgramTypeSmoothDirection extends JWebglProgram {

    @JWebglProgram.uniform (JWebglProgramUniformMat4)
    uMvp: JWebglProgramUniformMat4;
    @JWebglProgram.uniform (JWebglProgramUniformVec2)
    uTextureSize: JWebglProgramUniformVec2;
    @JWebglProgram.uniform (JWebglProgramUniformSampler2D)
    uTextureCorner: JWebglProgramUniformSampler2D;
    @JWebglProgram.uniform (JWebglProgramUniformSampler2D)
    uTextureEnum: JWebglProgramUniformSampler2D;
    @JWebglProgram.uniform (JWebglProgramUniformSampler2D)
    uTextureDirection: JWebglProgramUniformSampler2D;

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

// 获取平滑的缓存数据
vec4 getEnumCache (vec2 posTex, vec2 dir) {
    vec2 posCorner = posTex + dir / 4.0;
    return getTextureRGBA (${this.uTextureEnum}, posCorner);
}

// 获取平滑的缓存数据
vec4 getDirectionCache (vec2 posTex, vec2 dir) {
    vec2 posCorner = posTex + dir / 4.0;
    return getTextureRGBA (${this.uTextureDirection}, posCorner);
}

void main() {
    vec2 pos = ${this.vTexCoord} * ${this.uTextureSize};

    vec2 posCenter = floor (pos) + vec2 (0.5, 0.5);
    vec2 vecForward = vec2 (pos - posCenter) * 4.0;
    vec2 vecRight = vec2 (vecForward.y, - vecForward.x);
    
    vec4 posCenterCornerForward = getCornerCache (posCenter, vecForward);
    vec4 posCenterEnumForward = getEnumCache (posCenter, vecForward);
    vec4 posCenterDirectionForward = getDirectionCache (posCenter, vecForward);

    // 不是平滑角、已经初始化，忽略
    if (posCenterEnumForward.a == 0.0 || posCenterDirectionForward.a == 1.0) {
        gl_FragColor = posCenterDirectionForward;
        return;
    };

    vec2 posFL = posCenter + vecForward / 2.0 - vecRight / 2.0;
    vec4 posFLCornerBack = getCornerCache (posFL, - vecForward);
    vec4 posFLEnumBack = getEnumCache (posFL, - vecForward);
    vec4 posFLDirectionBack = getDirectionCache (posFL, - vecForward);

    vec2 posFR = posCenter + vecForward / 2.0 + vecRight / 2.0;
    vec4 posFRCornerBack = getCornerCache (posFR, - vecForward);
    vec4 posFREnumBack = getEnumCache (posFR, - vecForward);
    vec4 posFRDirectionBack = getDirectionCache (posFR, - vecForward);

    vec2 posLeft = posCenter - vecRight;
    vec4 posLeftCornerBack = getCornerCache (posLeft, - vecForward);
    vec4 posLeftEnumBack = getEnumCache (posLeft, - vecForward);
    vec4 posLeftDirectionBack = getDirectionCache (posLeft, - vecForward);

    vec2 posRight = posCenter + vecRight;
    vec4 posRightCornerBack = getCornerCache (posRight, - vecForward);
    vec4 posRightEnumBack = getEnumCache (posRight, - vecForward);
    vec4 posRightDirectionBack = getDirectionCache (posRight, - vecForward);

    // 经典平滑 - 初始化
    if (posCenterEnumForward.r == 0.0 && posCenterEnumForward.g == 0.0) {
        // 非夹心情况
        if (!(posFLEnumBack.a == 1.0 && posFLEnumBack.r == 0.0 && posFLEnumBack.g == 0.0 && posFREnumBack.a == 1.0 && posFREnumBack.r == 0.0 && posFREnumBack.g == 0.0)) 
        {
            posCenterDirectionForward.a = 1.0;
            if (posFLEnumBack.g == 1.0 || posFREnumBack.r == 1.0) {
                posCenterDirectionForward.rgb = vec3 (1.0, 1.0, 1.0);
            }
            else {
                posCenterDirectionForward.rgb = vec3 (0.0, 0.0, 0.0);
            };
        };
    };

    // 左平滑 - 初始化
    if (posCenterEnumForward.r == 1.0) {
        // 非夹心情况
        if (!(posLeftEnumBack.a == 1.0 && posLeftEnumBack.r == 1.0 && posFREnumBack.a == 1.0 && posFREnumBack.r == 1.0)) 
        {
            posCenterDirectionForward.a = 1.0;
            if (posFREnumBack.a == 1.0 && posFREnumBack.r == 0.0 && posFREnumBack.g == 0.0 || posLeftEnumBack.a == 0.0) {
                posCenterDirectionForward.rgb = vec3 (0.0, 0.0, 0.0);
            }
            else {
                posCenterDirectionForward.rgb = vec3 (1.0, 1.0, 1.0); 
            };
        };
    };

    // 右平滑 - 初始化
    if (posCenterEnumForward.g == 1.0) {
        // 非夹心情况
        if (!(posRightEnumBack.a == 1.0 && posRightEnumBack.g == 1.0 && posFLEnumBack.a == 1.0 && posFLEnumBack.g == 1.0)) 
        {
            posCenterDirectionForward.a = 1.0;
            if (posFLEnumBack.a == 1.0 && posFLEnumBack.r == 0.0 && posFLEnumBack.g == 0.0 || posRightEnumBack.a == 0.0) {
                posCenterDirectionForward.rgb = vec3 (0.0, 0.0, 0.0);
            }
            else {
                posCenterDirectionForward.rgb = vec3 (1.0, 1.0, 1.0);
            };
        };
    };

    // 传染 - 来源左前
    if (posFLDirectionBack.a == 1.0) {
        posCenterDirectionForward.a = 1.0;
        posCenterDirectionForward.rgb = 1.0 - posFLDirectionBack.rgb;
    };
    
    // 传染 - 来源右前
    if (posFRDirectionBack.a == 1.0) {
        posCenterDirectionForward.a = 1.0;
        posCenterDirectionForward.rgb = 1.0 - posFRDirectionBack.rgb;
    };

    gl_FragColor = posCenterDirectionForward;
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
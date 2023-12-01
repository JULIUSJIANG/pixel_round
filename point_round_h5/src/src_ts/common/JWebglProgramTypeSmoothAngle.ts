import JWebglEnum from "./JWebglEnum";
import JWebglMathVector4 from "./JWebglMathVector4";
import JWebglProgram from "./JWebglProgram";
import JWebglProgramAttributeVec2 from "./JWebglProgramAttributeVec2";
import JWebglProgramAttributeVec4 from "./JWebglProgramAttributeVec4";
import JWEbglProgramDefine from "./JWebglProgramDefine";
import JWebglProgramUniformFloat from "./JWebglProgramUniformFloat";
import JWebglProgramUniformMat4 from "./JWebglProgramUniformMat4";
import JWebglProgramUniformSampler2D from "./JWebglProgramUniformSampler2D";
import JWebglProgramUniformVec2 from "./JWebglProgramUniformVec2";
import JWebglProgramVaryingVec2 from "./JWebglProgramVaryingVec2";

/**
 * 让部分折线更加平滑 - 影响的角度
 */
export default class JWebglProgramTypeSmoothAngle extends JWebglProgram {

    @JWebglProgram.define (JWEbglProgramDefine, `0.7071`) // 0.7071067811865476
    dForwardLength: JWEbglProgramDefine;
    @JWebglProgram.define (JWEbglProgramDefine, `0.5`)
    dForwardUnit: JWEbglProgramDefine;

    @JWebglProgram.define (JWEbglProgramDefine, `0.4142`) // 0.4142135623730951
    dForwardLengthSmall: JWEbglProgramDefine;
    @JWebglProgram.define (JWEbglProgramDefine, `0.2928`) // 0.2928932188134525
    dForwardUnitSmall: JWEbglProgramDefine;

    @JWebglProgram.define (JWEbglProgramDefine, `1.118`) // 1.118033988749895
    dSideLength: JWEbglProgramDefine;
    @JWebglProgram.define (JWEbglProgramDefine, `0.5`)
    dSideUnit: JWEbglProgramDefine;

    @JWebglProgram.uniform (JWebglProgramUniformMat4)
    uMvp: JWebglProgramUniformMat4;
    @JWebglProgram.uniform (JWebglProgramUniformVec2)
    uTextureSize: JWebglProgramUniformVec2;
    @JWebglProgram.uniform (JWebglProgramUniformSampler2D)
    uTextureMain: JWebglProgramUniformSampler2D;
    @JWebglProgram.uniform (JWebglProgramUniformSampler2D)
    uTextureCorner: JWebglProgramUniformSampler2D;
    @JWebglProgram.uniform (JWebglProgramUniformSampler2D)
    uTextureEnum: JWebglProgramUniformSampler2D;
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
    vec4 posCenterCornerForward = getCornerCache (posCenter, vecForward);
    vec4 posCenterCornerLeft = getCornerCache (posCenter, - vecRight);
    vec4 posCenterEnumForward = getEnumCache (posCenter, vecForward);
    vec4 posCenterEnumLeft = getEnumCache (posCenter, - vecRight);

    vec2 posFL = posCenter + vecForward / 2.0 - vecRight / 2.0;
    vec4 posFLColor = getTextureRGBA (${this.uTextureMain}, posFL);

    vec2 posFR = posCenter + vecForward / 2.0 + vecRight / 2.0;
    vec4 posFRColor = getTextureRGBA (${this.uTextureMain}, posFR);

    vec2 posBL = posCenter - vecForward / 2.0 - vecRight / 2.0;
    vec4 posBLColor = getTextureRGBA (${this.uTextureMain}, posBL);

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
                // 前方颜色
                vec4 colorForward = posFRColor;
                float posCenterCornerForwardL = posCenterCornerForward.r;
                // 处于反向
                if (${this.uRight} < 0.0) {
                    posCenterCornerForwardL = posCenterCornerForward.g;
                };
                if (match (posCenterCornerForwardL, 1.0)) {
                    colorForward = posFLColor;
                };

                // 左方颜色
                vec4 colorLeft = posFLColor;
                float posCenterCornerLeftL = posCenterCornerLeft.r;
                // 处于反向
                if (${this.uRight} < 0.0) {
                    posCenterCornerLeftL = posCenterCornerLeft.g;
                };
                if (match (posCenterCornerLeftL, 1.0)) {
                    colorLeft = posBLColor;
                };

                if (checkEqual (colorForward, colorLeft)) {
                    // 标注为有效
                    colorResult.a = 1.0;
                    // 起始角
                    colorResult.r = 0.25;
                    // 终止角
                    colorResult.g = 1.0;
                };
            };
        };

        // // 是俩侧平滑
        // if (
        //        match (posCenterEnumForward.g, 1.0)
        //     && match (posCenterEnumForward.b, 1.0)
        // )
        // {
        //     // 标注为有效
        //     colorResult.a = 1.0;
        //     // 起始角
        //     colorResult.r = 0.0;
        //     // 终止角
        //     colorResult.g = 1.0;
        // };

        // // 是小平滑
        // if (
        //     match (posCenterEnumForward.r, 1.0)
        // )
        // {
        //     // 标注为有效
        //     colorResult.a = 1.0;
        //     // 起始角
        //     colorResult.r = 0.25;
        //     // 终止角
        //     colorResult.g = 0.75;
        // };

        // 处于反向
        if (${this.uRight} < 0.0) {
            float valR = colorResult.r;
            float valG = colorResult.g;
            colorResult.r = 1.0 - valG;
            colorResult.g = 1.0 - valR;
        };
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
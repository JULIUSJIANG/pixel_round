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

/**
 * 正式平滑
 */
export default class JWebglProgramTypeSmoothStep3CornerRemove extends JWebglProgram {

    @JWebglProgram.uniform (JWebglProgramUniformMat4)
    uMvp: JWebglProgramUniformMat4;
    @JWebglProgram.uniform (JWebglProgramUniformVec2)
    uTextureSize: JWebglProgramUniformVec2;
    @JWebglProgram.uniform (JWebglProgramUniformSampler2D)
    uTextureTickness: JWebglProgramUniformSampler2D;
    @JWebglProgram.uniform (JWebglProgramUniformSampler2D)
    uTextureCorner: JWebglProgramUniformSampler2D;

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

void main() {
    vec2 pos = ${this.vTexCoord} * ${this.uTextureSize};
    vec4 colorSum = getTextureRGBA (${this.uTextureCorner}, pos);
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
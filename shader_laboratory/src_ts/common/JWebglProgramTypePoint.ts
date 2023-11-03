import JWebglColor from "./JWebglColor.js";
import JWebglEnum from "./JWebglEnum.js";
import JWebglMathVector4 from "./JWebglMathVector4.js";
import JWebglProgram from "./JWebglProgram.js";
import JWebglProgramAttributeVec4 from "./JWebglProgramAttributeVec4.js";
import JWebglProgramUniformFloat from "./JWebglProgramUniformFloat.js";
import JWebglProgramUniformMat4 from "./JWebglProgramUniformMat4.js";
import JWebglProgramUniformVec4 from "./JWebglProgramUniformVec4.js";
import JWebglProgramVaryingVec4 from "./JWebglProgramVaryingVec4.js";

export default class JWebglProgramTypePoint extends JWebglProgram {

    @JWebglProgram.uniform (JWebglProgramUniformMat4)
    uMvp: JWebglProgramUniformMat4;

    @JWebglProgram.uniform (JWebglProgramUniformVec4)
    uColor: JWebglProgramUniformVec4;

    @JWebglProgram.uniform (JWebglProgramUniformFloat)
    uSize: JWebglProgramUniformFloat;

    @JWebglProgram.attribute (JWebglProgramAttributeVec4)
    aPosition: JWebglProgramAttributeVec4;

    @JWebglProgram.varying (JWebglProgramVaryingVec4)
    vColor: JWebglProgramVaryingVec4;

    impGetShaderVTxt (): string {
        return `
void main() {
    gl_Position = ${this.uMvp} * ${this.aPosition};
    gl_PointSize = ${this.uSize};
    ${this.vColor} = ${this.uColor};
}
        `;
    }

    impGetnShaderFTxt (): string {
        return `
void main() {
    gl_FragColor = ${this.vColor};
}
        `;
    }

    impGetMode (): JWebglEnum.DrawArraysMode {
        return JWebglEnum.DrawArraysMode.POINTS;
    }

    /**
     * 添加一条线
     * @param posA 
     * @param posB 
     * @param color 
     * @returns 
     */
    add (
        pos: JWebglMathVector4
    )
    {
        let idx = this.addAttributeData (pos);
        this._addIndexData (idx);
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
        pos: JWebglMathVector4
    )
    {
        return this._addAttributeData (
            pos.elements [0], 
            pos.elements [1], 
            pos.elements [2], 
            1,
        );
    }
}
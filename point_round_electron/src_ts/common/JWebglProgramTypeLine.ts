import JWebglColor from "./JWebglColor.js";
import JWebglEnum from "./JWebglEnum.js";
import JWebglMathVector4 from "./JWebglMathVector4.js";
import JWebglProgram from "./JWebglProgram.js";
import JWebglProgramAttributeVec4 from "./JWebglProgramAttributeVec4.js";
import JWebglProgramUniformMat4 from "./JWebglProgramUniformMat4.js";
import JWebglProgramVaryingVec4 from "./JWebglProgramVaryingVec4.js";

export default class JWebglProgramTypeLine extends JWebglProgram {

    @JWebglProgram.uniform (JWebglProgramUniformMat4)
    uMvp: JWebglProgramUniformMat4;

    @JWebglProgram.attribute (JWebglProgramAttributeVec4)
    aPosition: JWebglProgramAttributeVec4;

    @JWebglProgram.attribute (JWebglProgramAttributeVec4)
    aColor: JWebglProgramAttributeVec4;

    @JWebglProgram.varying (JWebglProgramVaryingVec4)
    vColor: JWebglProgramVaryingVec4;

    impGetShaderVTxt (): string {
        return `
void main() {
    gl_Position = ${this.uMvp} * ${this.aPosition};
    ${this.vColor} = ${this.aColor};
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
        return JWebglEnum.DrawArraysMode.LINES;
    }

    /**
     * 添加一条线
     * @param argsPosFrom 
     * @param argsPosTo 
     * @param color 
     * @returns 
     */
    add (
        argsPosFrom: JWebglMathVector4,
        argsPosFromColor: JWebglColor,

        argsPosTo: JWebglMathVector4,
        argsPowToColor: JWebglColor
    )
    {
        let idxFrom = this.addAttributeData (argsPosFrom, argsPosFromColor);
        let idxTo = this.addAttributeData (argsPosTo, argsPowToColor);
        let idx = this._addIndexData (idxFrom, idxTo);
        if () {

        };
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
        color: JWebglColor
    )
    {
        return this._addAttributeData (
            pos.elements [0], 
            pos.elements [1], 
            pos.elements [2], 
            1, 
            
            color.data01 [0], 
            color.data01 [1], 
            color.data01 [2],
            1
        );
    }
}
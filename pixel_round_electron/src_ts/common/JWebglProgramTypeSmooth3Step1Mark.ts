import JWebglEnum from "./JWebglEnum.js";
import JWebglMathVector4 from "./JWebglMathVector4.js";
import JWebglProgram from "./JWebglProgram.js";
import JWebglProgramAttributeVec4 from "./JWebglProgramAttributeVec4.js";
import JWebglProgramUniformMat4 from "./JWebglProgramUniformMat4.js";
import JWebglProgramVaryingVec4 from "./JWebglProgramVaryingVec4.js";

export default class JWebglProgramTypeSmooth3Step1Mark extends JWebglProgram {

    @JWebglProgram.uniform (JWebglProgramUniformMat4)
    uMvp: JWebglProgramUniformMat4;

    @JWebglProgram.attribute (JWebglProgramAttributeVec4)
    aPosition: JWebglProgramAttributeVec4;

    @JWebglProgram.attribute (JWebglProgramAttributeVec4)
    aCorner: JWebglProgramAttributeVec4;

    @JWebglProgram.varying (JWebglProgramVaryingVec4)
    vCorner: JWebglProgramVaryingVec4;

    impGetShaderVTxt (): string {
        return `
void main() {
    gl_Position = ${this.uMvp} * ${this.aPosition};
    ${this.vCorner} = ${this.aCorner};
}
        `;
    }

    impGetnShaderFTxt (): string {
        return `
void main() {
    gl_FragColor = ${this.vCorner};
}
        `;
    }

    impGetMode (): JWebglEnum.DrawArraysMode {
        return JWebglEnum.DrawArraysMode.POINTS;
    }

    /**
     * 添加一个点
     * @param pos 
     */
    add (
        posX: number,
        posY: number,
        posZ: number,

        cornerLT: number,
        cornerRT: number,
        cornerRB: number,
        cornerLB: number
    )
    {
        let idx = this.addAttributeData (
            posX,
            posY,
            posZ,
        
            cornerLT,
            cornerRT,
            cornerRB,
            cornerLB
        );
        this._addIndexData (idx);
    }

    /**
     * 添加顶点数据
     * @param pos 
     * @param cornerLT 
     * @param cornerRT 
     * @param cornerRB 
     * @param cornerLB 
     * @returns 
     */
    private addAttributeData (
        posX: number,
        posY: number,
        posZ: number,

        cornerLT: number,
        cornerRT: number,
        cornerRB: number,
        cornerLB: number
    )
    {
        return this._addAttributeData (
            posX, 
            posY, 
            posZ, 
            1,

            cornerLT,
            cornerRT,
            cornerRB,
            cornerLB
        );
    }
}
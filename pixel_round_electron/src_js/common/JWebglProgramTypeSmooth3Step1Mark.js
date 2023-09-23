var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import JWebglEnum from "./JWebglEnum.js";
import JWebglProgram from "./JWebglProgram.js";
import JWebglProgramAttributeVec4 from "./JWebglProgramAttributeVec4.js";
import JWebglProgramUniformMat4 from "./JWebglProgramUniformMat4.js";
import JWebglProgramVaryingVec4 from "./JWebglProgramVaryingVec4.js";
export default class JWebglProgramTypeSmooth3Step1Mark extends JWebglProgram {
    impGetShaderVTxt() {
        return `
void main() {
    gl_Position = ${this.uMvp} * ${this.aPosition};
    ${this.vCorner} = ${this.aCorner};
}
        `;
    }
    impGetnShaderFTxt() {
        return `
void main() {
    gl_FragColor = ${this.vCorner};
}
        `;
    }
    impGetMode() {
        return JWebglEnum.DrawArraysMode.POINTS;
    }
    /**
     * 添加一个点
     * @param pos
     */
    add(posX, posY, posZ, cornerLT, cornerRT, cornerRB, cornerLB) {
        let idx = this.addAttributeData(posX, posY, posZ, cornerLT, cornerRT, cornerRB, cornerLB);
        this._addIndexData(idx);
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
    addAttributeData(posX, posY, posZ, cornerLT, cornerRT, cornerRB, cornerLB) {
        return this._addAttributeData(posX, posY, posZ, 1, cornerLT, cornerRT, cornerRB, cornerLB);
    }
}
__decorate([
    JWebglProgram.uniform(JWebglProgramUniformMat4)
], JWebglProgramTypeSmooth3Step1Mark.prototype, "uMvp", void 0);
__decorate([
    JWebglProgram.attribute(JWebglProgramAttributeVec4)
], JWebglProgramTypeSmooth3Step1Mark.prototype, "aPosition", void 0);
__decorate([
    JWebglProgram.attribute(JWebglProgramAttributeVec4)
], JWebglProgramTypeSmooth3Step1Mark.prototype, "aCorner", void 0);
__decorate([
    JWebglProgram.varying(JWebglProgramVaryingVec4)
], JWebglProgramTypeSmooth3Step1Mark.prototype, "vCorner", void 0);

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
export default class JWebglProgramTypeTriangle extends JWebglProgram {
    impGetShaderVTxt() {
        return `
void main() {
    gl_Position = ${this.uMvp} * ${this.aPosition};
    ${this.vColor} = ${this.aColor};
}
        `;
    }
    impGetnShaderFTxt() {
        return `
void main() {
    gl_FragColor = ${this.vColor};
}
        `;
    }
    impGetMode() {
        return JWebglEnum.DrawArraysMode.TRIANGLES;
    }
    /**
     * 添加一条线
     * @param posA
     * @param posB
     * @param color
     * @returns
     */
    add(posA, posAColor, posB, posBColor, posC, posCColor) {
        let idxA = this.addAttributeData(posA, posAColor);
        let idxB = this.addAttributeData(posB, posBColor);
        let idxC = this.addAttributeData(posC, posCColor);
        this._addIndexData(idxA, idxB, idxC);
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
    addAttributeData(pos, color) {
        return this._addAttributeData(pos.elements[0], pos.elements[1], pos.elements[2], 1, color.data01[0], color.data01[1], color.data01[2], 1);
    }
}
__decorate([
    JWebglProgram.uniform(JWebglProgramUniformMat4)
], JWebglProgramTypeTriangle.prototype, "uMvp", void 0);
__decorate([
    JWebglProgram.attribute(JWebglProgramAttributeVec4)
], JWebglProgramTypeTriangle.prototype, "aPosition", void 0);
__decorate([
    JWebglProgram.attribute(JWebglProgramAttributeVec4)
], JWebglProgramTypeTriangle.prototype, "aColor", void 0);
__decorate([
    JWebglProgram.varying(JWebglProgramVaryingVec4)
], JWebglProgramTypeTriangle.prototype, "vColor", void 0);

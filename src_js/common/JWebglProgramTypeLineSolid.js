var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import JWebglEnum from "./JWebglEnum.js";
import JWebglMathVector4 from "./JWebglMathVector4.js";
import JWebglProgram from "./JWebglProgram.js";
import JWebglProgramAttributeVec4 from "./JWebglProgramAttributeVec4.js";
import JWebglProgramUniformMat4 from "./JWebglProgramUniformMat4.js";
import JWebglProgramVaryingVec4 from "./JWebglProgramVaryingVec4.js";
export default class JWebglProgramTypeLinesSolid extends JWebglProgram {
    constructor() {
        super(...arguments);
        /**
         * 起始位置
         */
        this._addLinePosFrom = new JWebglMathVector4();
        /**
         * 终点位置
         */
        this._addLinePosTo = new JWebglMathVector4();
    }
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
        return JWebglEnum.DrawArraysMode.LINES;
    }
    /**
     * 添加一条线
     * @param argsPosFrom
     * @param argsPosTo
     * @param color
     * @returns
     */
    addLine(argsPosFrom, argsPosFromColor, argsPosTo, argsPowToColor) {
        // 重合的话，忽略
        if (argsPosFrom.elements[0] == argsPosTo.elements[0] && argsPosFrom.elements[1] == argsPosTo.elements[1] && argsPosFrom.elements[2] == argsPosTo.elements[2]) {
            return;
        }
        ;
        JWebglMathVector4.copy(argsPosFrom, this._addLinePosFrom);
        JWebglMathVector4.copy(argsPosTo, this._addLinePosTo);
        let idxFrom = this.addAttributeData(this._addLinePosFrom, argsPosFromColor);
        let idxTo = this.addAttributeData(this._addLinePosTo, argsPowToColor);
        this._addIndexData(idxFrom, idxTo);
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
], JWebglProgramTypeLinesSolid.prototype, "uMvp", void 0);
__decorate([
    JWebglProgram.attribute(JWebglProgramAttributeVec4)
], JWebglProgramTypeLinesSolid.prototype, "aPosition", void 0);
__decorate([
    JWebglProgram.attribute(JWebglProgramAttributeVec4)
], JWebglProgramTypeLinesSolid.prototype, "aColor", void 0);
__decorate([
    JWebglProgram.varying(JWebglProgramVaryingVec4)
], JWebglProgramTypeLinesSolid.prototype, "vColor", void 0);

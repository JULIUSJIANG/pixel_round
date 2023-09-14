import JWebglProgramAttribute from "./JWebglProgramAttribute.js";
/**
 * 顶点数据 - 向量
 */
export default class JWebglProgramAttributeVec4 extends JWebglProgramAttribute {
    impGetShaderDefine() {
        return `vec4`;
    }
    impGetSize() {
        return 4;
    }
}

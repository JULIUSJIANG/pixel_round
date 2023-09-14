import JWebglProgramAttribute from "./JWebglProgramAttribute.js";
/**
 * 顶点数据 - 浮点数
 */
export default class JWebglProgramAttributeFloat extends JWebglProgramAttribute {
    impGetShaderDefine() {
        return `float`;
    }
    impGetSize() {
        return 1;
    }
}

import JWebglProgramAttribute from "./JWebglProgramAttribute";

/**
 * 顶点数据 - 浮点数
 */
export default class JWebglProgramAttributeFloat extends JWebglProgramAttribute {

    impGetShaderDefine (): string {
        return `float`;
    }

    impGetSize (): number {
        return 1;
    }
}
import JWebglProgramAttribute from "./JWebglProgramAttribute.js";

/**
 * 顶点数据 - 向量
 */
export default class JWebglProgramAttributeVec2 extends JWebglProgramAttribute {

    impGetShaderDefine (): string {
        return `vec2`;
    }

    impGetSize (): number {
        return 2;
    }
}
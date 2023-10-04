export default class JWEbglProgramDefine {
    constructor(program, name, val) {
        this.relProgram = program;
        this.name = name;
        this.val = val;
    }
    /**
     * 直接返回名字，方便插入 shader
     * @returns
     */
    toString() {
        return this.name;
    }
}

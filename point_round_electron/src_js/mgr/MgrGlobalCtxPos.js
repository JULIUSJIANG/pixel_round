/**
 * 坐标上下文
 */
class MgrGlobalCtxPos {
    constructor() {
        /**
         * 在客户端中的位置 x
         */
        this.clientX = 0;
        /**
         * 在客户端中的位置 y
         */
        this.clientY = 0;
    }
    /**
     * 填充数据
     * @param clientX
     * @param clientY
     */
    fill(clientX, clientY) {
        this.clientX = clientX;
        this.clientY = clientY;
    }
}
export default MgrGlobalCtxPos;

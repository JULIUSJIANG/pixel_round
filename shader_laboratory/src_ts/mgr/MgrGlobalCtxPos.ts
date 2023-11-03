/**
 * 坐标上下文
 */
class MgrGlobalCtxPos {
    /**
     * 在客户端中的位置 x
     */
    clientX = 0;

    /**
     * 在客户端中的位置 y
     */
    clientY = 0;

    /**
     * 填充数据
     * @param clientX 
     * @param clientY 
     */
    fill (clientX: number, clientY: number) {
        this.clientX = clientX;
        this.clientY = clientY;
    }
}

export default MgrGlobalCtxPos;
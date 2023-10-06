/**
 * 交互
 */
export default class JWebglTouch {
    constructor() {
        /**
         * 在客户端中的位置
         */
        this.posClient = new Float32Array([0, 0, 0, 0]);
        /**
         * 在 canvas 中的位置
         */
        this.posCanvas = new Float32Array([0, 0, 0, 0]);
        /**
         * 在投影矩阵中的位置
         */
        this.posProj = new Float32Array([0, 0, 0, 0]);
    }
    /**
     * 填充数据
     * @param evt
     */
    fill(evt) {
        let x = evt.clientX;
        let y = evt.clientY;
        this.posClient[0] = x;
        this.posClient[1] = y;
        this.posClient[2] = 0;
        this.posClient[3] = 1;
        let canvas = evt.target;
        let rect = canvas.getBoundingClientRect();
        this.posCanvas[0] = x - rect.left;
        this.posCanvas[1] = rect.bottom - y;
        x = ((x - rect.left) - canvas.height / 2) / (canvas.height / 2);
        y = (canvas.width / 2 - (y - rect.top)) / (canvas.width / 2);
        this.posProj[0] = x;
        this.posProj[1] = y;
        this.posProj[2] = 0;
        this.posProj[3] = 1;
    }
}

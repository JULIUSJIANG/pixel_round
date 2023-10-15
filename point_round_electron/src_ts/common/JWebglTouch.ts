import MgrGlobalCtxPos from "../mgr/MgrGlobalCtxPos.js";
import JWebgl from "./JWebgl.js";

/**
 * 交互
 */
export default class JWebglTouch {
    
    /**
     * 在客户端中的位置
     */
    posClient = new Float32Array ([0, 0, 0, 0]);

    /**
     * 在 canvas 中的位置
     */
    posCanvas = new Float32Array ([0, 0, 0, 0]);

    /**
     * 归属的上下文
     */
    jWebgl: JWebgl;

    constructor (jWebgl: JWebgl) {
        this.jWebgl = jWebgl;
    }

    /**
     * 填充数据
     * @param evt 
     */
    fillByClientPos (clientX: number, clientY: number) {
        let x = clientX;
        let y = clientY;
        this.posClient [0] = x;
        this.posClient [1]= y;
        this.posClient [2] = 0;
        this.posClient [3] = 1;

        let canvas = this.jWebgl.canvasWebgl;
        let rect = canvas.getBoundingClientRect ();

        this.posCanvas [0] = x - rect.left;
        this.posCanvas [1] = rect.bottom - y;
    }
}
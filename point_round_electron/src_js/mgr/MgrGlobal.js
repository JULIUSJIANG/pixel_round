import Eventer from "../common/Eventer.js";
import MgrGlobalCtxPos from "./MgrGlobalCtxPos.js";
class MgrGlobal {
    constructor() {
        /**
         * 事件派发 - 交互开始
         */
        this.evtTouchStart = new Eventer();
        this.evtTouchStartPos = new MgrGlobalCtxPos();
        /**
         * 事件派发 - 交互中
         */
        this.evtTouchMove = new Eventer();
        this.evtTouchMovePos = new MgrGlobalCtxPos();
        /**
         * 事件派发 - 交互结束
         */
        this.evtTouchEnd = new Eventer();
        this.evtTouchEndPos = new MgrGlobalCtxPos();
        /**
         * 事件派发 - 进入
         */
        this.evtEnter = new Eventer();
        /**
         * 事件派发 - 离开
         */
        this.evtExit = new Eventer();
        this._arrUint8 = new Uint8Array(1);
        this._arrFloat32 = new Float32Array(1);
    }
    /**
     * 初始化
     */
    init() {
        this.canvas2d = document.createElement(`canvas`);
        this.canvas2dCtx = this.canvas2d.getContext(`2d`);
        document.onmousedown = (evt) => {
            this.evtTouchStartPos.fill(evt.clientX, evt.clientY);
            this.evtTouchStart.call(null);
        };
        document.onmousemove = (evt) => {
            this.evtTouchMovePos.fill(evt.clientX, evt.clientY);
            this.evtTouchMove.call(null);
        };
        document.onmouseup = (evt) => {
            this.evtTouchEndPos.fill(evt.clientX, evt.clientY);
            this.evtTouchEnd.call(null);
        };
        document.onmouseenter = () => {
            this.evtEnter.call(null);
        };
        document.onmouseleave = () => {
            this.evtExit.call(null);
        };
    }
    /**
     * 获取图片数据
     * @param w
     * @param h
     * @returns
     */
    getImgData(w, h) {
        if (this._imgData == null || this._imgData.width != w || this._imgData.height != h) {
            this._imgData = this.canvas2dCtx.createImageData(w, h);
        }
        ;
        return this._imgData;
    }
    /**
     * uint8 转 base 64
     * @param arrUint8
     * @param w
     * @param h
     * @returns
     */
    arrUint8ToBase64(arrUint8, w, h) {
        this.canvas2d.width = w;
        this.canvas2d.height = h;
        let imgData = this.getImgData(w, h);
        imgData.data.set(arrUint8, 0);
        this.canvas2dCtx.putImageData(imgData, 0, 0);
        return this.canvas2d.toDataURL();
    }
    /**
     * 获取流数据 - 整型
     * @param len
     * @returns
     */
    getArrUint8(len) {
        let size = this._arrUint8.length;
        if (size < len) {
            while (size < len) {
                size *= 2;
            }
            ;
            this._arrUint8 = new Uint8Array(size);
        }
        ;
        return this._arrUint8;
    }
    /**
     * 获取流数据 - 浮点
     * @param len
     * @returns
     */
    getArrFloat32(len) {
        let size = this._arrFloat32.length;
        if (size < len) {
            while (size < len) {
                size *= 2;
            }
            ;
            this._arrFloat32 = new Float32Array(size);
        }
        ;
        return this._arrFloat32;
    }
}
(function (MgrGlobal) {
    /**
     * 全局实例
     */
    MgrGlobal.inst = new MgrGlobal();
})(MgrGlobal || (MgrGlobal = {}));
;
export default MgrGlobal;

import Eventer from "../common/Eventer.js";
import JWebgl from "../common/JWebgl.js";
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
        /**
         * 按下按键
         */
        this.evtKey = new Eventer();
    }
    /**
     * 初始化
     */
    init() {
        this.canvas2d = document.createElement(`canvas`);
        this.canvas2dCtx = this.canvas2d.getContext(`2d`);
        this.canvas3d = document.createElement(`canvas`);
        this.canvas3dCtx = new JWebgl(this.canvas3d);
        this.canvas3dCtx.init();
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
        document.onkeydown = (evt) => {
            this.evtKey.call(evt.code);
        };
    }
    /**
     * 图片数据转字节数据
     * @param img
     * @param w
     * @param h
     * @returns
     */
    imageToUint8Arr(img, w, h) {
        this.canvas2d.width = w;
        this.canvas2d.height = h;
        this.canvas2dCtx.clearRect(0, 0, w, h);
        this.canvas2dCtx.drawImage(img, 0, 0);
        let imgData = this.canvas2dCtx.getImageData(0, 0, w, h);
        return imgData.data;
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
        for (let i = 0; i < imgData.data.length; i++) {
            imgData.data[i] = arrUint8[i];
        }
        ;
        // imgData.data.set (arrUint8, 0);
        this.canvas2dCtx.putImageData(imgData, 0, 0);
        return this.canvas2d.toDataURL();
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

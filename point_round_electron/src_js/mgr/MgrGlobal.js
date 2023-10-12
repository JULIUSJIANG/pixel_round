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
    }
    /**
     * 初始化
     */
    init() {
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
}
(function (MgrGlobal) {
    /**
     * 全局实例
     */
    MgrGlobal.inst = new MgrGlobal();
})(MgrGlobal || (MgrGlobal = {}));
;
export default MgrGlobal;

import Eventer from "../common/Eventer.js";
import MgrGlobalCtxPos from "./MgrGlobalCtxPos.js";

class MgrGlobal {
    /**
     * 事件派发 - 交互开始
     */
    evtTouchStart = new Eventer ();
    evtTouchStartPos = new MgrGlobalCtxPos ();

    /**
     * 事件派发 - 交互中
     */
    evtTouchMove = new Eventer ();
    evtTouchMovePos = new MgrGlobalCtxPos ();

    /**
     * 事件派发 - 交互结束
     */
    evtTouchEnd = new Eventer ();
    evtTouchEndPos = new MgrGlobalCtxPos ();

    /**
     * 事件派发 - 进入
     */
    evtEnter = new Eventer ();
    /**
     * 事件派发 - 离开
     */
    evtExit = new Eventer ();

    /**
     * 初始化
     */
    init () {
        document.onmousedown = (evt: MouseEvent) => {
            this.evtTouchStartPos.fill (evt.clientX, evt.clientY);
            this.evtTouchStart.call (null);
        };
        document.onmousemove = (evt: MouseEvent) => {
            this.evtTouchMovePos.fill (evt.clientX, evt.clientY);
            this.evtTouchMove.call (null);
        };
        document.onmouseup = (evt: MouseEvent) => {
            this.evtTouchEndPos.fill (evt.clientX, evt.clientY);
            this.evtTouchEnd.call (null);
        };

        document.onmouseenter = () => {
            this.evtEnter.call (null);
        };
        document.onmouseleave = () => {
            this.evtExit.call (null);
        };
    }
}

namespace MgrGlobal {
    /**
     * 全局实例
     */
    export const inst = new MgrGlobal ();
};

export default MgrGlobal;
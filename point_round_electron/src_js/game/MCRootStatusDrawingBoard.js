import IndexGlobal from "../IndexGlobal.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import DomDrawingBoardLeft from "../ui/DomDrawingBoardLeft.js";
import DomDrawingBoardRightEmpty from "../ui/DomDrawingBoardRightEmpty.js";
import DomDrawingBoardRightPaint from "../ui/DomDrawingBoardRightPaint.js";
import MCRootStatus from "./MCRootStatus.js";
/**
 * 根状态机 - 状态 - 画板模式
 */
class MCRootStatusDrawingBoard extends MCRootStatus {
    onDisplay() {
        let instDisplay;
        // 有可用图片
        if (this.getCurrentCache()) {
            instDisplay = ReactComponentExtend.instantiateComponent(DomDrawingBoardRightPaint, null);
        }
        else {
            instDisplay = ReactComponentExtend.instantiateComponent(DomDrawingBoardRightEmpty, null);
        }
        ;
        return ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_HEIGHT]: MgrDomDefine.STYLE_WIDTH_PERCENTAGE_0,
                [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW
            }
        }, ReactComponentExtend.instantiateComponent(DomDrawingBoardLeft, null), instDisplay);
    }
    /**
     * 获取当前的缓存
     * @returns
     */
    getCurrentCache() {
        return IndexGlobal.inst.dbMapIdToImg.get(MgrData.inst.get(MgrDataItem.DB_CURRENT_IMG));
    }
}
export default MCRootStatusDrawingBoard;

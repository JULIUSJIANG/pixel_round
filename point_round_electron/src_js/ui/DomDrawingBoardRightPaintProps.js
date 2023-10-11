import IndexGlobal from "../IndexGlobal.js";
import NodeModules from "../NodeModules.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
export default class DomDrawingBoardRightPaintProps extends ReactComponentExtend {
    render() {
        return ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_FLEX_GROW]: 0,
                [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.CONFIG_TXT_BG_COLOR,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN,
            }
        }, ReactComponentExtend.instantiateTag(NodeModules.antd.Button, {
            onClick: () => {
                let listImgData = MgrData.inst.get(MgrDataItem.DB_LIST_IMG_DATA);
                let targetIdx;
                for (let i = 0; i < listImgData.length; i++) {
                    let imgData = listImgData[i];
                    if (imgData.id == MgrData.inst.get(MgrDataItem.DB_CURRENT_IMG)) {
                        targetIdx = i;
                        break;
                    }
                    ;
                }
                ;
                // 删除该索引上的单位
                IndexGlobal.inst.dbDelete(targetIdx);
                // 尽量维持选择状态
                targetIdx = Math.min(targetIdx, listImgData.length - 1);
                if (0 <= targetIdx) {
                    MgrData.inst.set(MgrDataItem.DB_CURRENT_IMG, listImgData[targetIdx].id);
                }
                ;
                MgrData.inst.callDataChange();
            },
            style: {
                [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
            }
        }, `删除`));
    }
}

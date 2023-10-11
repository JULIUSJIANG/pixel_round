import IndexGlobal from "../IndexGlobal.js";
import NodeModules from "../NodeModules.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
export default class DomDrawingBoardRightPaintProps extends ReactComponentExtend {
    constructor() {
        super(...arguments);
        this.listChildren = new Array();
    }
    render() {
        this.listChildren.length = 0;
        for (let i = 0; i < IndexGlobal.inst.mcRoot.statusDrawingBoard.opListStatus.length; i++) {
            let opListStatusI = IndexGlobal.inst.mcRoot.statusDrawingBoard.opListStatus[i];
            let propsBtn = {
                style: {
                    [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                },
                onClick: () => {
                    if (opListStatusI == IndexGlobal.inst.mcRoot.statusDrawingBoard.opCurrStatus) {
                        return;
                    }
                    ;
                    IndexGlobal.inst.mcRoot.statusDrawingBoard.opEnter(opListStatusI);
                    MgrData.inst.callDataChange();
                }
            };
            if (opListStatusI == IndexGlobal.inst.mcRoot.statusDrawingBoard.opCurrStatus) {
                propsBtn[MgrDomDefine.PROPS_TYPE] = MgrDomDefine.PROPS_TYPE_PRIMARY;
            }
            ;
            this.listChildren.push(ReactComponentExtend.instantiateTag(NodeModules.antd.Button, propsBtn, opListStatusI.name));
        }
        ;
        return ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_FLEX_GROW]: 0,
                [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.CONFIG_TXT_BG_COLOR,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN,
            }
        }, ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW,
            },
        }, 
        // 板块 - 操作
        ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW,
            }
        }, ...this.listChildren), 
        // 分割线
        ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_WIDTH]: MgrDomDefine.CONFIG_TXT_SPACING,
                [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.STYLE_COLOR_WHITE,
            }
        }), 
        // 板块 - 颜色
        ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW,
                [MgrDomDefine.STYLE_ALIGN_ITEMS]: MgrDomDefine.STYLE_ALIGN_ITEMS_CENTER,
                [MgrDomDefine.STYLE_JUSTIFY_CONTENT]: MgrDomDefine.STYLE_JUSTIFY_CONTENT_CENTER,
            }
        }, ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                [MgrDomDefine.STYLE_COLOR]: MgrDomDefine.STYLE_COLOR_WHITE,
                [MgrDomDefine.STYLE_FONT_SIZE]: MgrDomDefine.STYLE_FONT_SIZE_14,
            }
        }, `画笔颜色`), ReactComponentExtend.instantiateTag(NodeModules.antd.ColorPicker, {
            showText: true,
            style: {
                [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
            },
            [MgrDomDefine.PROPS_VALUE]: `${MgrData.inst.get(MgrDataItem.DB_COLOR)}`,
            onChangeComplete: (val) => {
                val = val.toHex();
                MgrData.inst.set(MgrDataItem.DB_COLOR, val);
                MgrData.inst.callDataChange();
            }
        })), ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_WIDTH]: MgrDomDefine.STYLE_WIDTH_PERCENTAGE_0,
                [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW_REVERSE,
            }
        }, 
        // 板块 - 删除
        ReactComponentExtend.instantiateTag(NodeModules.antd.Button, {
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
        }, `删除当前文档`))));
    }
}

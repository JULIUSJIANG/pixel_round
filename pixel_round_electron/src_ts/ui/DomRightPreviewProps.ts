import IndexGlobal from "../IndexGlobal.js";
import NodeModules from "../NodeModules.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import DomRightPreviewColorTable from "./DomRightPreviewColorTable.js";

export default class DomRightPreviewProps extends ReactComponentExtend <number> {


    render (): ReactComponentExtendInstance {


        return ReactComponentExtend.instantiateTag (
            MgrDomDefine.TAG_DIV,
            {
                style: {
                    [MgrDomDefine.STYLE_FLEX_GROW]: 0,
                    [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                    [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                    [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.CONFIG_TXT_BG_COLOR,

                    [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                    [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN,
                }
            },

            ReactComponentExtend.instantiateComponent (DomRightPreviewColorTable, null),
            ReactComponentExtend.instantiateTag (
                NodeModules.antd.Button,
                {
                    onClick: () => {
                        let listImgData = MgrData.inst.get (MgrDataItem.LIST_IMG_DATA);
                        let targetIdx: number;
                        for (let i = 0; i < listImgData.length; i++) {
                            let imgData = listImgData [i];
                            if (imgData.id == MgrData.inst.get (MgrDataItem.CURRENT_IMG)) {
                                targetIdx = i;
                                break;
                            };
                        };
                        listImgData.splice (targetIdx, 1);
                        targetIdx = Math.min (targetIdx, listImgData.length - 1);
                        if (0 <= targetIdx) {
                            IndexGlobal.inst.detailMachine.currStatus.onImg (listImgData [targetIdx].id);
                        }
                        else {
                            IndexGlobal.inst.detailMachine.currStatus.onCreate ();
                        };
                    },
                    style: {
                        [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                        [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                    }
                },
    
                `删除`
            )
        );
    }
}
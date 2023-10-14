import IndexGlobal from "../IndexGlobal.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import DomExperimentLeftGlobal from "./DomExperimentLeftGlobal.js";
import DomExperimentLeftList from "./DomExperimentLeftList.js";
import FileColumnRS from "./FileColumnRS.js";
export default class DomExperimentLeft extends ReactComponentExtend {
    render() {
        let rsCurrent = FileColumnRS.mapIdToInst.get(MgrData.inst.get(MgrDataItem.COLUMN_COUNT));
        const imgSize = IndexGlobal.IMG_MINI_SIZE + MgrDomDefine.CONFIG_NUMBER_SPACING * 2;
        const width = (MgrDomDefine.CONFIG_NUMBER_HALF_SPACING + MgrDomDefine.CONFIG_NUMBER_SPACING) * 2 + MgrDomDefine.CONFIG_NUMBER_SPACING * 3 + imgSize * rsCurrent.count + MgrDomDefine.CONFIG_NUMBER_SPACING * (rsCurrent.count - 1);
        return ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_FLEX]: `${width}px`,
                [MgrDomDefine.STYLE_FLEX_GROW]: 0,
                [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.CONFIG_TXT_BG_COLOR,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN
            }
        }, ReactComponentExtend.instantiateComponent(DomExperimentLeftList, null), ReactComponentExtend.instantiateComponent(DomExperimentLeftGlobal, null));
    }
}

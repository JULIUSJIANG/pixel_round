import IndexGlobal from "../IndexGlobal.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import DomInputNumber from "./DomInputNumber.js";
import DomExperimentRightPreviewImgBeforeWebglCutted from "./DomExperimentRightPreviewImgBeforeWebglCutted.js";
import DomExperimentRightPreviewImgBeforeWebglOrigin from "./DomExperimentRightPreviewImgBeforeWebglOrigin.js";
class DomExperimentRightPreviewImgBefore extends ReactComponentExtend {
    render() {
        let listImgData = MgrData.inst.get(MgrDataItem.LIST_IMG_DATA);
        let listImgDataInst;
        for (let i = 0; i < listImgData.length; i++) {
            let listImgDataI = listImgData[i];
            if (listImgDataI.id == MgrData.inst.get(MgrDataItem.CURRENT_IMG)) {
                listImgDataInst = listImgDataI;
                break;
            }
            ;
        }
        ;
        return ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_WIDTH]: MgrDomDefine.STYLE_WIDTH_PERCENTAGE_0,
                [MgrDomDefine.STYLE_FLEX_GROW]: 0.5,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN
            }
        }, ReactComponentExtend.instantiateComponent(DomExperimentRightPreviewImgBeforeWebglOrigin, this.props), ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_HEIGHT]: MgrDomDefine.STYLE_WIDTH_PERCENTAGE_0,
                [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN
            }
        }, ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW
            },
        }, ReactComponentExtend.instantiateComponent(DomInputNumber, DomInputNumber.Args.create(`左内边距`, listImgDataInst.paddingLeft, (val) => {
            IndexGlobal.mcExp().statusPreview.imgMachine.currStatus.onValPaddingLeft(Math.floor(val));
        }, null, null)), ReactComponentExtend.instantiateComponent(DomInputNumber, DomInputNumber.Args.create(`右内边距`, listImgDataInst.paddingRight, (val) => {
            IndexGlobal.mcExp().statusPreview.imgMachine.currStatus.onValPaddingRight(Math.floor(val));
        }, null, null))), ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW
            },
        }, ReactComponentExtend.instantiateComponent(DomInputNumber, DomInputNumber.Args.create(`上内边距`, listImgDataInst.paddingTop, (val) => {
            IndexGlobal.mcExp().statusPreview.imgMachine.currStatus.onValPaddingTop(Math.floor(val));
        }, null, null)), ReactComponentExtend.instantiateComponent(DomInputNumber, DomInputNumber.Args.create(`下内边距`, listImgDataInst.paddingBottom, (val) => {
            IndexGlobal.mcExp().statusPreview.imgMachine.currStatus.onValPaddingBottom(Math.floor(val));
        }, null, null))), ReactComponentExtend.instantiateComponent(DomExperimentRightPreviewImgBeforeWebglCutted, this.props), ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW
            },
        }, ReactComponentExtend.instantiateComponent(DomInputNumber, DomInputNumber.Args.create(`颗粒宽度`, listImgDataInst.pixelWidth, (val) => {
            listImgDataInst.pixelWidth = Math.floor(val);
            IndexGlobal.mcExp().statusPreview.imgMachine.currStatus.onValPixelWidth(Math.floor(val));
        }, 1, null)), ReactComponentExtend.instantiateComponent(DomInputNumber, DomInputNumber.Args.create(`颗粒高度`, listImgDataInst.pixelHeight, (val) => {
            IndexGlobal.mcExp().statusPreview.imgMachine.currStatus.onValPixelHeight(Math.floor(val));
        }, 1, null)))));
    }
}
export default DomExperimentRightPreviewImgBefore;

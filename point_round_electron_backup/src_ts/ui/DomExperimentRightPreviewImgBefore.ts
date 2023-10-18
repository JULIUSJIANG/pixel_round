import IndexGlobal from "../IndexGlobal.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import DomInputNumberHor from "./DomInputNumberHor.js";
import DomExperimentRightPreviewImgBeforeCutted from "./DomExperimentRightPreviewImgBeforeCutted.js";
import DomExperimentRightPreviewImgBeforeOrigin from "./DomExperimentRightPreviewImgBeforeOrigin.js";
import ViewRelativeRateRS from "./ViewRelativeRateRS.js";

class DomExperimentRightPreviewImgBefore extends ReactComponentExtend <number> {

    render (): ReactComponentExtendInstance {
        let relativeRS = ViewRelativeRateRS.mapIdToInst.get (MgrData.inst.get (MgrDataItem.VIEW_RELATIVE_RATE));
        let listImgDataInst = IndexGlobal.inst.expMapIdToImg.get (MgrData.inst.get (MgrDataItem.EXP_CURRENT_IMG));

        return ReactComponentExtend.instantiateTag (
            MgrDomDefine.TAG_DIV,
            {
                style: {
                    [MgrDomDefine.STYLE_WIDTH]: MgrDomDefine.STYLE_WIDTH_PERCENTAGE_0,
                    [MgrDomDefine.STYLE_FLEX_GROW]: relativeRS.rateLeft,

                    [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                    [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN
                }
            },

            ReactComponentExtend.instantiateComponent (
                DomExperimentRightPreviewImgBeforeOrigin,
                this.props
            ),

            ReactComponentExtend.instantiateTag (
                MgrDomDefine.TAG_DIV,
                {
                    style: {
                        [MgrDomDefine.STYLE_HEIGHT]: MgrDomDefine.STYLE_WIDTH_PERCENTAGE_0,
                        [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                        
                        [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                        [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN
                    }
                },

                ReactComponentExtend.instantiateTag (
                    MgrDomDefine.TAG_DIV,
                    {
                        style: {
                            [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                            [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW
                        },
                    },
    
                    ReactComponentExtend.instantiateComponent (DomInputNumberHor, DomInputNumberHor.Args.create (
                        `左内边距`, 
                        listImgDataInst.expImgData.paddingLeft,
                        (val) => {
                            IndexGlobal.mcExp ().detailStatusPreview.imgMachine.currStatus.onValPaddingLeft (Math.floor (val));
                        },
                        null,
                        null
                    )),
                    ReactComponentExtend.instantiateComponent (DomInputNumberHor, DomInputNumberHor.Args.create (
                        `右内边距`, 
                        listImgDataInst.expImgData.paddingRight,
                        (val) => {
                            IndexGlobal.mcExp ().detailStatusPreview.imgMachine.currStatus.onValPaddingRight (Math.floor (val));
                        },
                        null,
                        null
                    )),
                ),
                ReactComponentExtend.instantiateTag (
                    MgrDomDefine.TAG_DIV,
                    {
                        style: {
                            [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                            [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW
                        },
                    },
    
                    ReactComponentExtend.instantiateComponent (DomInputNumberHor, DomInputNumberHor.Args.create (
                        `上内边距`,
                        listImgDataInst.expImgData.paddingTop,
                        (val) => {
                            IndexGlobal.mcExp ().detailStatusPreview.imgMachine.currStatus.onValPaddingTop (Math.floor (val));
                        },
                        null,
                        null
                    )),
                    ReactComponentExtend.instantiateComponent (DomInputNumberHor, DomInputNumberHor.Args.create (
                        `下内边距`, 
                        listImgDataInst.expImgData.paddingBottom,
                        (val) => {
                            IndexGlobal.mcExp ().detailStatusPreview.imgMachine.currStatus.onValPaddingBottom (Math.floor (val));
                        },
                        null,
                        null
                    )),
                ),
                ReactComponentExtend.instantiateComponent (
                    DomExperimentRightPreviewImgBeforeCutted,
                    this.props
                ),
                ReactComponentExtend.instantiateTag (
                    MgrDomDefine.TAG_DIV,
                    {
                        style: {
                            [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                            [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW
                        },
                    },
    
                    ReactComponentExtend.instantiateComponent (DomInputNumberHor, DomInputNumberHor.Args.create (
                        `颗粒宽度`, 
                        listImgDataInst.expImgData.pixelWidth,
                        (val) => {
                            listImgDataInst.expImgData.pixelWidth = Math.floor (val);
                            IndexGlobal.mcExp ().detailStatusPreview.imgMachine.currStatus.onValPixelWidth (Math.floor (val));
                        },
                        1,
                        null
                    )),
                    ReactComponentExtend.instantiateComponent (DomInputNumberHor, DomInputNumberHor.Args.create (
                        `颗粒高度`,
                        listImgDataInst.expImgData.pixelHeight, 
                        (val) => {
                            IndexGlobal.mcExp ().detailStatusPreview.imgMachine.currStatus.onValPixelHeight (Math.floor (val));
                        },
                        1,
                        null
                    )),
                ),
            ),
        );
    }
}

export default DomExperimentRightPreviewImgBefore;
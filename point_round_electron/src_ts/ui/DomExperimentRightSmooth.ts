import IndexGlobal from "../IndexGlobal.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import MgrRes from "../mgr/MgrRes.js";
import DomImageSmooth from "./DomImageSmooth.js";
import DomImageSmoothRS from "./DomImageSmoothRS.js";

class DomExperimentRightSmooth extends ReactComponentExtend <number> {

    render (): ReactComponentExtendInstance {
        let dataSrc = IndexGlobal.mcExp ().statusPreview;
        let res = MgrRes.inst.getImg (dataSrc.imgMachine.dataInst.dataOrigin);
        let resImg = res.image;
        if (res.currStatus == res.statusLoading) {
            resImg = null;
        };
        let domImageSmoothArgs = DomImageSmooth.Args.create (
            DomImageSmoothRS.exp,
            resImg,

            1,
            1,

            dataSrc.imgMachine.dataInst.paddingTop,
            dataSrc.imgMachine.dataInst.paddingRight,
            dataSrc.imgMachine.dataInst.paddingBottom,
            dataSrc.imgMachine.dataInst.paddingLeft,

            dataSrc.imgMachine.dataInst.pixelWidth,
            dataSrc.imgMachine.dataInst.pixelHeight,
        );
        return ReactComponentExtend.instantiateTag (
            MgrDomDefine.TAG_DIV,
            {
                style: {
                    [MgrDomDefine.STYLE_WIDTH]: MgrDomDefine.STYLE_WIDTH_PERCENTAGE_0,
                    [MgrDomDefine.STYLE_FLEX_GROW]: 1,

                    [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                    [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN
                }
            },

            ReactComponentExtend.instantiateComponent (DomImageSmooth, domImageSmoothArgs)
        )
    }
}

export default DomExperimentRightSmooth;
import IndexGlobal from "../IndexGlobal.js";
import NodeModules from "../NodeModules.js";
import JWebgl from "../common/JWebgl.js";
import JWebglColor from "../common/JWebglColor.js";
import JWebglMathMatrix4 from "../common/JWebglMathMatrix4.js";
import JWebglMathVector4 from "../common/JWebglMathVector4.js";
import ObjectPoolType from "../common/ObjectPoolType.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import MgrRes from "../mgr/MgrRes.js";
import MgrResAssetsImage from "../mgr/MgrResAssetsImage.js";
import DomInputNumber from "./DomInputNumber.js";
import DomRightPreviewImgBeforeWebglCutted from "./DomRightPreviewImgBeforeWebglCutted.js";
import DomRightPreviewImgBeforeWebglOrigin from "./DomRightPreviewImgBeforeWebglOrigin.js";

class DomRightPreviewImgBefore extends ReactComponentExtend <DomRightPreviewImgBefore.Args> {
    
    finishedImg: MgrResAssetsImage;

    render (): ReactComponentExtendInstance {
        let listImgData = MgrData.inst.get (MgrDataItem.LIST_IMG_DATA);
        let listImgDataInst: MgrDataItem.ImgData;
        for (let i = 0; i < listImgData.length; i++) {
            let listImgDataI = listImgData [i];
            if (listImgDataI.id == MgrData.inst.get (MgrDataItem.CURRENT_IMG)) {
                listImgDataInst = listImgDataI;
                break;
            };
        };

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

            ReactComponentExtend.instantiateComponent (
                DomRightPreviewImgBeforeWebglOrigin,
                this.props
            ),
            ReactComponentExtend.instantiateComponent (
                DomRightPreviewImgBeforeWebglCutted,
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

                ReactComponentExtend.instantiateComponent (DomInputNumber, DomInputNumber.Args.create (
                    `左内边距`, 
                    listImgDataInst.paddingLeft,
                    (val) => {
                        listImgDataInst.paddingLeft = Math.floor (val);
                        MgrData.inst.callDataChange ();
                    },
                    null,
                    null
                )),
                ReactComponentExtend.instantiateComponent (DomInputNumber, DomInputNumber.Args.create (
                    `右内边距`, 
                    listImgDataInst.paddingRight,
                    (val) => {
                        listImgDataInst.paddingRight = Math.floor (val);
                        MgrData.inst.callDataChange ();
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

                ReactComponentExtend.instantiateComponent (DomInputNumber, DomInputNumber.Args.create (
                    `上内边距`,
                    listImgDataInst.paddingTop,
                    (val) => {
                        listImgDataInst.paddingTop = Math.floor (val);
                        MgrData.inst.callDataChange ();
                    },
                    null,
                    null
                )),
                ReactComponentExtend.instantiateComponent (DomInputNumber, DomInputNumber.Args.create (
                    `下内边距`, 
                    listImgDataInst.paddingBottom,
                    (val) => {
                        listImgDataInst.paddingBottom = Math.floor (val);
                        MgrData.inst.callDataChange ();
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

                ReactComponentExtend.instantiateComponent (DomInputNumber, DomInputNumber.Args.create (
                    `颗粒宽`, 
                    listImgDataInst.pixelWidth,
                    (val) => {
                        listImgDataInst.pixelWidth = Math.floor (val);
                        MgrData.inst.callDataChange ();
                    },
                    1,
                    null
                )),
                ReactComponentExtend.instantiateComponent (DomInputNumber, DomInputNumber.Args.create (
                    `颗粒高`,
                    listImgDataInst.pixelHeight, 
                    (val) => {
                        listImgDataInst.pixelHeight = Math.floor (val);
                        MgrData.inst.callDataChange ();
                    },
                    1,
                    null
                )),
            ),
        );
    }
}

namespace DomRightPreviewImgBefore {
    export class Args {
        static poolType = new ObjectPoolType <Args> ({
            instantiate: () => new Args,
            onPop: null,
            onPush: null
        });
    }
}

export default DomRightPreviewImgBefore;
import IndexGlobal from "../IndexGlobal.js";
import objectPool from "../common/ObjectPool.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import DomExperimentLeftListImg from "./DomExperimentLeftListImg.js";
import FileColumnRS from "./FileColumnRS.js";

export default class DomExperimentLeftList extends ReactComponentExtend <number> {

    listChildren = new Array <ReactComponentExtendInstance> ();

    listChildrenContainer = new Array <ReactComponentExtendInstance> ();

    render (): ReactComponentExtendInstance {
        let rsCurrent = FileColumnRS.mapIdToInst.get (MgrData.inst.get (MgrDataItem.COLUMN_COUNT));
        this.listChildren.length = 0;
        let listImgData = MgrData.inst.get (MgrDataItem.EXP_LIST_IMG_DATA);
        for (let i = 0; i < listImgData.length; i+= rsCurrent.count) {
            let containerProps = {
                style: {
                    [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX
                }
            };
            if (i != 0) {
                containerProps.style [MgrDomDefine.STYLE_MARGIN_TOP] = MgrDomDefine.CONFIG_TXT_SPACING;
            };
            this.listChildrenContainer.length = 0;
            for (let j = 0; j < rsCurrent.count; j++) {
                let idx = i + j;
                if (listImgData.length <= idx) {
                    this.listChildrenContainer.push (ReactComponentExtend.instantiateTag (MgrDomDefine.TAG_DIV, {
                        style: {
                            [MgrDomDefine.STYLE_WIDTH]: `${IndexGlobal.IMG_MINI_SIZE + MgrDomDefine.CONFIG_NUMBER_SPACING * 2}px`,
                            [MgrDomDefine.STYLE_FLEX_GROW]: 0,
                            [MgrDomDefine.STYLE_MARGIN_LEFT]: MgrDomDefine.CONFIG_TXT_SPACING
                        }
                    }));
                    continue;
                };
                let imgData = listImgData [i + j];
                let args = objectPool.pop (DomExperimentLeftListImg.Args.poolType);
                args.init (imgData, i, j);
                this.listChildrenContainer.push (ReactComponentExtend.instantiateComponent (DomExperimentLeftListImg, args));
            };
            this.listChildren.push (ReactComponentExtend.instantiateTag (
                MgrDomDefine.TAG_DIV,
                containerProps,

                ...this.listChildrenContainer
            ));
        };

        return ReactComponentExtend.instantiateTag (
            MgrDomDefine.TAG_DIV,
            {
                style: {
                    [MgrDomDefine.STYLE_HEIGHT]: MgrDomDefine.STYLE_WIDTH_PERCENTAGE_0,
                    [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                    [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                    [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                    [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.STYLE_COLOR_WHITE,

                    [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                    [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN
                }
            },

            // 滚动视图的遮罩
            ReactComponentExtend.instantiateTag (
                MgrDomDefine.TAG_DIV,
                {
                    style: {
                        [MgrDomDefine.STYLE_HEIGHT]: MgrDomDefine.STYLE_HEIGHT_PERCENTAGE_0,
                        [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                        [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,

                        [MgrDomDefine.STYLE_OVERFLOW_X]: MgrDomDefine.STYLE_OVERFLOW_X_HIDDEN,
                        [MgrDomDefine.STYLE_OVERFLOW_Y]: MgrDomDefine.STYLE_OVERFLOW_Y_SCROLL
                    }
                },

                // 滚动的列表
                ReactComponentExtend.instantiateTag (
                    MgrDomDefine.TAG_DIV,
                    {
                        style: {
                            [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                            [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN,

                            [MgrDomDefine.STYLE_MARGIN_RIGHT]: MgrDomDefine.CONFIG_TXT_SPACING
                        }
                    },

                    ...this.listChildren
                )
            )
        )
    }
}
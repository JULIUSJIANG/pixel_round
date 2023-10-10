import IndexGlobal from "../IndexGlobal.js";
import NodeModules from "../NodeModules.js";
import ObjectPoolType from "../common/ObjectPoolType.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import MgrRes from "../mgr/MgrRes.js";

class DomExperimentLeftListImg extends ReactComponentExtend <DomExperimentLeftListImg.Args> {

    render (): ReactComponentExtendInstance {
        let img = MgrRes.inst.getImg (this.props.imgData.dataOrigin);
        let imgInst: ReactComponentExtendInstance;
        if (img.currStatus == img.statusFinished) {
            let imgWidth = IndexGlobal.IMG_MINI_SIZE;
            let imgHeight = IndexGlobal.IMG_MINI_SIZE;
            if (img.image.width < img.image.height) {
                imgWidth = img.image.width / img.image.height * imgHeight;
            };
            if (img.image.height < img.image.width) {
                imgHeight = img.image.height / img.image.width * imgWidth;
            };
            let marginX = (IndexGlobal.IMG_MINI_SIZE + MgrDomDefine.CONFIG_NUMBER_SPACING * 2  - imgWidth) / 2;
            let marginY = (IndexGlobal.IMG_MINI_SIZE + MgrDomDefine.CONFIG_NUMBER_SPACING * 2  - imgHeight) / 2;
            imgInst = ReactComponentExtend.instantiateTag(
                MgrDomDefine.TAG_IMG,
                {
                    style: {
                        [MgrDomDefine.STYLE_WIDTH]: `${imgWidth}px`,
                        [MgrDomDefine.STYLE_HEIGHT]: `${imgHeight}px`,
                        [MgrDomDefine.STYLE_MARGIN_TOP]: `${marginY}px`,
                        [MgrDomDefine.STYLE_MARGIN_RIGHT]: `${marginX}px`,
                        [MgrDomDefine.STYLE_MARGIN_BOTTOM]: `${marginY}px`,
                        [MgrDomDefine.STYLE_MARGIN_LEFT]: `${marginX}px`,
                        "imageRendering": `pixelated`,
                    },
                    src: img.image.src
                }
            )
        };
        let eleSize = IndexGlobal.IMG_MINI_SIZE + MgrDomDefine.CONFIG_NUMBER_SPACING * 2;
        let props = {
            onClick: () => {
                IndexGlobal.mcExp ().currStatus.onImg (this.props.imgData.id);
            },
            style: {
                [MgrDomDefine.STYLE_WIDTH]: 0,
                [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                [MgrDomDefine.STYLE_HEIGHT]: `${IndexGlobal.IMG_MINI_SIZE + MgrDomDefine.CONFIG_NUMBER_SPACING * 2}px`,
            }
        };
        if (this.props.j != 0) {
            props.style [MgrDomDefine.STYLE_MARGIN_LEFT] = MgrDomDefine.CONFIG_TXT_SPACING;
        };
        if (IndexGlobal.mcExp ().currStatus == IndexGlobal.mcExp ().statusPreview && this.props.imgData.id == MgrData.inst.get (MgrDataItem.CURRENT_IMG)) {
            props [MgrDomDefine.PROPS_TYPE] = MgrDomDefine.PROPS_TYPE_PRIMARY;
        }
        else {
            props.style [MgrDomDefine.STYLE_BACKGROUND_COLOR] = MgrDomDefine.CONFIG_TXT_BG_COLOR;
        };
        return ReactComponentExtend.instantiateTag (
            NodeModules.antd.Button,
            props,

            ReactComponentExtend.instantiateTag (
                MgrDomDefine.TAG_DIV,
                {
                    style: {
                        [MgrDomDefine.STYLE_WIDTH]: 0,
                        [MgrDomDefine.STYLE_HEIGHT]: 0,
                        [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.STYLE_MARGIN_AUTO,
                    }
                },

                ReactComponentExtend.instantiateTag (
                    MgrDomDefine.TAG_DIV,
                    {
                        style: {
                            [MgrDomDefine.STYLE_HEIGHT]: `${eleSize}px`,
                            [MgrDomDefine.STYLE_WIDTH]: `${eleSize}px`,
                            // [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.CONFIG_TXT_BG_COLOR,
                            [MgrDomDefine.STYLE_POSITION]: MgrDomDefine.STYLE_POSITION_RELATIVE,
                            [MgrDomDefine.STYLE_LEFT]: `${-eleSize / 2}px`,
                            [MgrDomDefine.STYLE_TOP]: `${-(IndexGlobal.IMG_MINI_SIZE / 2 + MgrDomDefine.CONFIG_NUMBER_SPACING)}px`,
                        }
                    },
                    imgInst
                )
            )
        );
    }
}

namespace DomExperimentLeftListImg {
    export class Args {

        imgData: MgrDataItem.ImgData;

        i: number;

        j: number;

        init (imgData: MgrDataItem.ImgData, i: number, j: number) {
            this.imgData = imgData;
            this.i = i;
            this.j = j;
        }

        static poolType = new ObjectPoolType <Args> ({
            instantiate: () => new Args,
            onPop: null,
            onPush: null
        });
    }
}

export default DomExperimentLeftListImg;
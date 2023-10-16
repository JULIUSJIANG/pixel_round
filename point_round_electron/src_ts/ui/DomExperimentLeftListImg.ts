import IndexGlobal from "../IndexGlobal.js";
import NodeModules from "../NodeModules.js";
import ObjectPoolType from "../common/ObjectPoolType.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import ExpImg from "../game/ExpImg.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import MgrRes from "../mgr/MgrRes.js";

const EVT_NAME_DRAG_START = `dragstart`;
const EVT_NAME_DRAG_ING = `drag`;
const EVT_NAME_DRAG_END = `dragend`;

const EVT_NAME_DRAG_ENTER = `dragenter`;
const EVT_NAME_DRAG_OVER = `dragover`;
const EVT_NAME_DRAG_LEAVE = `dragleave`;

class DomExperimentLeftListImg extends ReactComponentExtend <DomExperimentLeftListImg.Args> {

    /**
     * 3d canvas 引用器
     */
    ref = NodeModules.react.createRef();

    isListened = false;

    reactComponentExtendOnInit (): void {
        let tag = this.ref.current as HTMLDivElement;
        tag.addEventListener (
            EVT_NAME_DRAG_START, 
            (event) => {
                IndexGlobal.mcExp ().dragCurrStatus.onStart (this.relDbImg);
            }
        );
        tag.addEventListener (
            EVT_NAME_DRAG_ING, 
            (event) => {

            }
        );
        tag.addEventListener (
            EVT_NAME_DRAG_END, 
            (event) => {
                IndexGlobal.mcExp ().dragCurrStatus.onEnd ();
            }
        );
        tag.addEventListener (
            EVT_NAME_DRAG_ENTER, 
            (event) => {
                IndexGlobal.mcExp ().dragCurrStatus.onTargetEnter (this.relDbImg);
            }
        );
        tag.addEventListener (
            EVT_NAME_DRAG_OVER, 
            (event) => {
                event.preventDefault();
            }
        );
        tag.addEventListener (
            EVT_NAME_DRAG_LEAVE, 
            (event) => {
                IndexGlobal.mcExp ().dragCurrStatus.onTargetLeave ();
            }
        );
    }

    /**
     * 数据标识
     */
    relDbImg: ExpImg;

    reactComponentExtendOnDraw (): void {
        this.relDbImg = this.props.imgData;
    }

    render (): ReactComponentExtendInstance {
        // 处理容器参数
        let eleSize = IndexGlobal.IMG_MINI_SIZE + MgrDomDefine.CONFIG_NUMBER_SPACING * 2;
        let props = {
            onClick: () => {
                IndexGlobal.inst.expSelect (this.props.imgData.expImgData.id);
                IndexGlobal.mcExp ().detailCurrStatus.onImg ();
            },
            style: {
                [MgrDomDefine.STYLE_WIDTH]: `${IndexGlobal.IMG_MINI_SIZE + MgrDomDefine.CONFIG_NUMBER_SPACING * 2}px`,
                [MgrDomDefine.STYLE_FLEX_GROW]: 0,
                [MgrDomDefine.STYLE_HEIGHT]: `${IndexGlobal.IMG_MINI_SIZE + MgrDomDefine.CONFIG_NUMBER_SPACING * 2}px`,
            },
        };
        if (this.props.j != 0) {
            props.style [MgrDomDefine.STYLE_MARGIN_LEFT] = MgrDomDefine.CONFIG_TXT_SPACING;
        };
        if (IndexGlobal.mcExp ().detailCurrStatus == IndexGlobal.mcExp ().detailStatusPreview && this.props.imgData.maskCurrStatus.onGetData().expImgData.id == MgrData.inst.get (MgrDataItem.EXP_CURRENT_IMG)) {
            props [MgrDomDefine.PROPS_TYPE] = MgrDomDefine.PROPS_TYPE_PRIMARY;
        }
        else {
            props.style [MgrDomDefine.STYLE_BACKGROUND_COLOR] = MgrDomDefine.CONFIG_TXT_BG_COLOR;
        };

        let imgWidth = IndexGlobal.IMG_MINI_SIZE;
        let imgHeight = IndexGlobal.IMG_MINI_SIZE;
        if (this.props.imgData.expImgData.width < this.props.imgData.expImgData.height) {
            imgWidth = this.props.imgData.expImgData.width / this.props.imgData.expImgData.height * imgHeight;
        };
        if (this.props.imgData.expImgData.height < this.props.imgData.expImgData.width) {
            imgHeight = this.props.imgData.expImgData.height / this.props.imgData.expImgData.width * imgWidth;
        };
        let marginX = (IndexGlobal.IMG_MINI_SIZE + MgrDomDefine.CONFIG_NUMBER_SPACING * 2  - imgWidth) / 2;
        let marginY = (IndexGlobal.IMG_MINI_SIZE + MgrDomDefine.CONFIG_NUMBER_SPACING * 2  - imgHeight) / 2;
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
                            [MgrDomDefine.STYLE_POSITION]: MgrDomDefine.STYLE_POSITION_RELATIVE,
                            [MgrDomDefine.STYLE_LEFT]: `${-eleSize / 2}px`,
                            [MgrDomDefine.STYLE_TOP]: `${-(IndexGlobal.IMG_MINI_SIZE / 2 + MgrDomDefine.CONFIG_NUMBER_SPACING)}px`,
                        }
                    },
                    ReactComponentExtend.instantiateTag(
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
                            src: this.props.imgData.expImgData.dataOrigin,
                            ref: this.ref,
                        }
                    )
                )
            )
        );
    }
}

namespace DomExperimentLeftListImg {
    export class Args {

        imgData: ExpImg;

        i: number;

        j: number;

        init (imgData: ExpImg, i: number, j: number) {
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
import IndexGlobal from "../IndexGlobal.js";
import NodeModules from "../NodeModules.js";
import ObjectPoolType from "../common/ObjectPoolType.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import DBImg from "../game/DBImg.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";

const EVT_NAME_DRAG_START = `dragstart`;
const EVT_NAME_DRAG_ING = `drag`;
const EVT_NAME_DRAG_END = `dragend`;
const EVT_NAME_DRAG_ENTER = `dragenter`;
const EVT_NAME_DRAG_OVER = `dragover`;
const EVT_NAME_DRAG_LEAVE = `dragleave`;

class DomDrawingBoardLeftListImg extends ReactComponentExtend <DomDrawingBoardLeftListImg.Args> {

    ref = NodeModules.react.createRef ();

    reactComponentExtendOnInit (): void {
        let tag = this.ref.current as HTMLDivElement;
        tag.addEventListener (
            EVT_NAME_DRAG_START, 
            (event) => {
                IndexGlobal.mcDB ().dragCurrStatus.onStart (this.relDbImg);
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
                IndexGlobal.mcDB ().dragCurrStatus.onEnd ();
            }
        );
        
        tag.addEventListener (
            EVT_NAME_DRAG_ENTER, 
            (event) => {
                IndexGlobal.mcDB ().dragCurrStatus.onTargetEnter (this.relDbImg);
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
                IndexGlobal.mcDB ().dragCurrStatus.onTargetEnterLeave ();
            }
        );
    }

    /**
     * 数据标识
     */
    relDbImg: DBImg;

    reactComponentExtendOnDraw (): void {
        this.relDbImg = this.props.dbImg;
    }

    render (): ReactComponentExtendInstance {
        // 处理容器参数
        let eleSize = IndexGlobal.IMG_MINI_SIZE + MgrDomDefine.CONFIG_NUMBER_SPACING * 2;
        let props = {
            onClick: () => {
                MgrData.inst.set (MgrDataItem.DB_CURRENT_IMG, this.props.dbImg.dbImgData.id);
                MgrData.inst.callDataChange ();
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
        if (MgrData.inst.get (MgrDataItem.DB_CURRENT_IMG) == this.props.dbImg.maskCurrStatus.onGetData().dbImgData.id) {
            props [MgrDomDefine.PROPS_TYPE] = MgrDomDefine.PROPS_TYPE_PRIMARY;
        }
        else {
            props.style [MgrDomDefine.STYLE_BACKGROUND_COLOR] = MgrDomDefine.CONFIG_TXT_BG_COLOR;
        };

        // 处理图片参数
        let imgWidth = IndexGlobal.IMG_MINI_SIZE;
        let imgHeight = IndexGlobal.IMG_MINI_SIZE;
        if (this.props.dbImg.dbImgData.width < this.props.dbImg.dbImgData.height) {
            imgWidth = this.props.dbImg.dbImgData.width / this.props.dbImg.dbImgData.height * imgHeight;
        };
        if (this.props.dbImg.dbImgData.height < this.props.dbImg.dbImgData.width) {
            imgHeight = this.props.dbImg.dbImgData.height / this.props.dbImg.dbImgData.width * imgWidth;
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
                            src: this.props.dbImg.dbImgData.dataOrigin,
                            ref: this.ref,
                        }
                    )
                )
            )
        );
    }
}

namespace DomDrawingBoardLeftListImg {
    export class Args {

        dbImg: DBImg;

        i: number;

        j: number;

        init (dbImg: DBImg, i: number, j: number) {
            this.dbImg = dbImg;
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

export default DomDrawingBoardLeftListImg;
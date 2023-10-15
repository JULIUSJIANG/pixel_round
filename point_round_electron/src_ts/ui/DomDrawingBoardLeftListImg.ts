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

            }
        );
        tag.addEventListener (
            EVT_NAME_DRAG_ENTER, 
            (event) => {

            }
        );
        tag.addEventListener (
            EVT_NAME_DRAG_OVER, 
            (event) => {

            }
        );
        tag.addEventListener (
            EVT_NAME_DRAG_LEAVE, 
            (event) => {

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
        let imgInst: ReactComponentExtendInstance;
        // 加载完成再说
        if (this.props.dbImg.initCurrStatus == this.props.dbImg.initStatusFinished) {
            let image = this.props.dbImg.imgLoaded;
            let imgWidth = IndexGlobal.IMG_MINI_SIZE;
            let imgHeight = IndexGlobal.IMG_MINI_SIZE;
            if (image.width < image.height) {
                imgWidth = image.width / image.height * imgHeight;
            };
            if (image.height < image.width) {
                imgHeight = image.height / image.width * imgWidth;
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
                    src: image.src,
                    draggable: `false`,
                }
            )
        };
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
            draggable: `true`,
            ref: this.ref,
        };
        if (this.props.j != 0) {
            props.style [MgrDomDefine.STYLE_MARGIN_LEFT] = MgrDomDefine.CONFIG_TXT_SPACING;
        };
        if (MgrData.inst.get (MgrDataItem.DB_CURRENT_IMG) == this.props.dbImg.dbImgData.id) {
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
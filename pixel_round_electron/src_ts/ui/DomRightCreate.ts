import IndexGlobal from "../IndexGlobal.js";
import NodeModules from "../NodeModules.js";
import JWebgl from "../common/JWebgl.js";
import JWebglMathMatrix4 from "../common/JWebglMathMatrix4.js";
import JWebglMathVector4 from "../common/JWebglMathVector4.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";

export default class DomRightCreate extends ReactComponentExtend<number> {

    /**
     * 3d canvas 引用器
     */
    canvasWebglRef = NodeModules.react.createRef();

    jWebgl: JWebgl;

    mat4M: JWebglMathMatrix4 = new JWebglMathMatrix4();

    mat4V: JWebglMathMatrix4 = new JWebglMathMatrix4();

    mat4P: JWebglMathMatrix4 = new JWebglMathMatrix4();

    reactComponentExtendOnInit(): void {
        this.jWebgl = new JWebgl(this.canvasWebglRef.current);
        this.jWebgl.init();
        this.mat4M.setIdentity();
        this.mat4V.setLookAt(
            0, 0, 1,
            0, 0, 0,
            0, 1, 0
        );
    }

    reactComponentExtendOnDraw(): void {
        if (IndexGlobal.inst.createMachine.img == null) {
            return;
        };

        // 清除画面
        this.jWebgl.useFbo (null);
        this.jWebgl.clear ();
        let img = IndexGlobal.inst.createMachine.img.image;

        this.mat4P.setOrtho (
            -img.width / 2, img.width / 2,
            -img.height / 2, img.height / 2,
            0, 2
        );
        JWebglMathMatrix4.multiplayMat4List (
            this.mat4P,
            this.mat4V,
            this.mat4M,
            this.jWebgl.mat4Mvp
        );

        this.jWebgl.programImg.uMvp.fill (this.jWebgl.mat4Mvp);
        this.jWebgl.programImg.uSampler.fillByImg (this.jWebgl.getImg (IndexGlobal.inst.createMachine.img.src));
        this.jWebgl.programImg.add (
            JWebglMathVector4.centerO,
            JWebglMathVector4.axisZStart,
            JWebglMathVector4.axisYEnd,
            img.width,
            img.height
        );
        this.jWebgl.programImg.draw ();
    }

    render(): ReactComponentExtendInstance {
        let canvasWidth = 1;
        let canvasHeight = 1;
        if (IndexGlobal.inst.createMachine.img != null) {
            canvasWidth = IndexGlobal.inst.createMachine.img.image.width * IndexGlobal.PIXEL_TEX_TO_SCREEN;
            canvasHeight = IndexGlobal.inst.createMachine.img.image.height * IndexGlobal.PIXEL_TEX_TO_SCREEN;
        };
        return ReactComponentExtend.instantiateTag(
            MgrDomDefine.TAG_DIV,
            {
                style: {
                    [MgrDomDefine.STYLE_WIDTH]: MgrDomDefine.STYLE_WIDTH_PERCENTAGE_0,
                    [MgrDomDefine.STYLE_FLEX_GROW]: 1,

                    [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                    [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                    [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.CONFIG_TXT_BG_COLOR,

                    [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                    [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN,
                }
            },

            ReactComponentExtend.instantiateTag(
                MgrDomDefine.TAG_DIV,
                {
                    style: {
                        [MgrDomDefine.STYLE_HEIGHT]: MgrDomDefine.STYLE_WIDTH_PERCENTAGE_0,
                        [MgrDomDefine.STYLE_FLEX_GROW]: 1,

                        [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                        [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN
                    }
                },

                // 滚动视图的遮罩
                ReactComponentExtend.instantiateTag(
                    MgrDomDefine.TAG_DIV,
                    {
                        style: {
                            [MgrDomDefine.STYLE_HEIGHT]: MgrDomDefine.STYLE_HEIGHT_PERCENTAGE_0,
                            [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                            [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                            [MgrDomDefine.STYLE_PADDING_RIGHT]: MgrDomDefine.CONFIG_TXT_SPACING,
                            [MgrDomDefine.STYLE_PADDING_BOTTOM]: MgrDomDefine.CONFIG_TXT_SPACING,

                            [MgrDomDefine.STYLE_OVERFLOW_X]: MgrDomDefine.STYLE_OVERFLOW_X_SCROLL,
                            [MgrDomDefine.STYLE_OVERFLOW_Y]: MgrDomDefine.STYLE_OVERFLOW_Y_SCROLL
                        }
                    },

                    // 滚动的列表
                    ReactComponentExtend.instantiateTag(
                        MgrDomDefine.TAG_DIV,
                        {
                            style: {
                                [MgrDomDefine.STYLE_WIDTH]: `${canvasWidth}px`,
                                [MgrDomDefine.STYLE_HEIGHT]: `${canvasHeight}px`,
                                [MgrDomDefine.STYLE_FLEX_GROW]: 0,
                                [MgrDomDefine.STYLE_DISPLAY]: IndexGlobal.inst.createMachine.img == null ? MgrDomDefine.STYLE_DISPLAY_NONE : MgrDomDefine.STYLE_DISPLAY_BLOCK
                            }
                        },

                        ReactComponentExtend.instantiateTag(
                            MgrDomDefine.TAG_DIV,
                            {
                                style: {
                                    [MgrDomDefine.STYLE_WIDTH]: 0,
                                    [MgrDomDefine.STYLE_HEIGHT]: 0,
                                    [MgrDomDefine.STYLE_POSITION]: MgrDomDefine.STYLE_POSITION_RELATIVE,
                                    [MgrDomDefine.STYLE_LEFT]: 0,
                                    [MgrDomDefine.STYLE_TOP]: 0,
                                }
                            },

                            ReactComponentExtend.instantiateTag(
                                MgrDomDefine.TAG_CANVAS,
                                {
                                    ref: this.canvasWebglRef,
                                    width: canvasWidth * IndexGlobal.ANTINA,
                                    height: canvasHeight * IndexGlobal.ANTINA,
                                    style: {
                                        [MgrDomDefine.STYLE_WIDTH]: `${canvasWidth}px`,
                                        [MgrDomDefine.STYLE_HEIGHT]: `${canvasHeight}px`,
                                        [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_BLOCK
                                    }
                                }
                            )
                        )
                    )
                )
            ),
            ReactComponentExtend.instantiateTag(
                MgrDomDefine.TAG_DIV,
                {
                    style: {
                        [MgrDomDefine.STYLE_FLEX_GROW]: 0,
                        [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING
                    }
                },

                ReactComponentExtend.instantiateTag(
                    NodeModules.antd.Upload.Dragger,
                    {
                        showUploadList: false,
                        beforeUpload: (file) => {
                            if (!file.type.match(/image/g)) {
                                NodeModules.antd.message.error(`${file.name} 不是图片，请选择图片文件`);
                                return false;
                            };
                            return true;
                        },
                        onChange: (info) => {
                            if (info.file.status == `uploading`) {
                                IndexGlobal.inst.createMachine.currStatus.onUploading(info.file.uid);
                            };
                            if (info.file.status == `done`) {
                                const reader = new FileReader();
                                reader.addEventListener('load', () => {
                                    let dataBase64 = reader.result as string;
                                    IndexGlobal.inst.createMachine.currStatus.onDone(info.file.uid, dataBase64);
                                });
                                reader.readAsDataURL(info.file.originFileObj);
                            };
                        },
                    },

                    ReactComponentExtend.instantiateTag(
                        MgrDomDefine.TAG_DIV,
                        {
                            style: {
                                [MgrDomDefine.STYLE_COLOR]: MgrDomDefine.STYLE_COLOR_WHITE
                            }
                        },

                        IndexGlobal.inst.createMachine.currStatus.onDraggerTxt()
                    )
                )
            ),
            ReactComponentExtend.instantiateTag(
                NodeModules.antd.Button,
                {
                    style: {
                        [MgrDomDefine.STYLE_FLEX_GROW]: 0,
                        [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING
                    },
                    onClick: () => {
                        if (IndexGlobal.inst.createMachine.img == null) {
                            return NodeModules.antd.message.error (`请先选择图片文件`);
                        };
                        if (IndexGlobal.inst.createMachine.currStatus != IndexGlobal.inst.createMachine.statusIdle) {
                            return NodeModules.antd.message.error (`文件加载中，请稍后`);
                        };
                        let id = MgrData.inst.get (MgrDataItem.LIST_SEED);
                        id++;
                        let imgData: MgrDataItem.ImgData = {
                            id: id,
                            dataOrigin: IndexGlobal.inst.createMachine.img.src,
                            paddingTop: 0,
                            paddingRight: 0,
                            paddingBottom: 0,
                            paddingLeft: 0,
                            pixelWidth: 1,
                            pixelHeight: 1
                        };
                        MgrData.inst.get (MgrDataItem.LIST_IMG_DATA).push (imgData);
                        MgrData.inst.set (MgrDataItem.LIST_SEED, id);
                        IndexGlobal.inst.detailMachine.currStatus.onImg (id);
                    }
                },

                `确认创建`
            )
        );
    }
}
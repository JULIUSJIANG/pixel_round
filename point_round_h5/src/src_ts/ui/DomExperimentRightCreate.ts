import IndexGlobal from "../IndexGlobal";
import NodeModules from "../NodeModules";
import JWebgl from "../common/JWebgl";
import JWebglMathMatrix4 from "../common/JWebglMathMatrix4";
import JWebglMathVector4 from "../common/JWebglMathVector4";
import ReactComponentExtend from "../common/ReactComponentExtend";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance";
import MgrData from "../mgr/MgrData";
import MgrDataItem from "../mgr/MgrDataItem";
import MgrDomDefine from "../mgr/MgrDomDefine";

export default class DomExperimentRightCreate extends ReactComponentExtend<number> {

    /**
     * 3d canvas 引用器
     */
    canvasWebglRef = NodeModules.react.createRef<HTMLCanvasElement>();

    /**
     * 绘制用的上下文
     */
    jWebgl: JWebgl;

    reactComponentExtendOnInit(): void {
        this.jWebgl = new JWebgl(this.canvasWebglRef.current);
        this.jWebgl.init();
        this.jWebgl.mat4V.setLookAt(
            0, 0, 1,
            0, 0, 0,
            0, 1, 0
        );
        this.jWebgl.mat4P.setOrtho (
            -1, 1,
            -1, 1,
             0, 2
        );
        this.jWebgl.refreshMat4Mvp ();
    }

    reactComponentExtendOnRelease (): void {
        this.jWebgl.release ();
    }

    reactComponentExtendOnDraw(): void {
        if (IndexGlobal.mcExpCreate ().img == null) {
            return;
        };

        // 清除画面
        this.jWebgl.useFbo (null);
        this.jWebgl.clear ();
        this.jWebgl.programImg.uMvp.fill (this.jWebgl.mat4Mvp);
        this.jWebgl.programImg.uTexture.fillByImg (this.jWebgl.getImg (IndexGlobal.mcExpCreate ().img.src));
        this.jWebgl.programImg.add (
            JWebglMathVector4.centerO,
            JWebglMathVector4.axisZStart,
            JWebglMathVector4.axisYEnd,
            2,
            2
        );
        this.jWebgl.programImg.draw ();
    }

    render(): ReactComponentExtendInstance {
        let canvasWidth = 1;
        let canvasHeight = 1;
        if (IndexGlobal.mcExpCreate ().img != null) {
            canvasWidth = IndexGlobal.mcExpCreate ().img.image.width * IndexGlobal.PIXEL_TEX_TO_SCREEN;
            canvasHeight = IndexGlobal.mcExpCreate ().img.image.height * IndexGlobal.PIXEL_TEX_TO_SCREEN;
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
                                [MgrDomDefine.STYLE_DISPLAY]: IndexGlobal.mcExpCreate ().img == null ? MgrDomDefine.STYLE_DISPLAY_NONE : MgrDomDefine.STYLE_DISPLAY_BLOCK
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
                            IndexGlobal.mcExpCreate ().currStatus.onUploading(file.uid);
                            const reader = new FileReader();
                            reader.addEventListener('load', () => {
                                let dataBase64 = reader.result as string;
                                IndexGlobal.mcExpCreate ().currStatus.onDone(file.uid, dataBase64);
                            });
                            reader.readAsDataURL(file);
                            return true;
                        },
                        onChange: (info) => {

                        },
                    },

                    ReactComponentExtend.instantiateTag(
                        MgrDomDefine.TAG_DIV,
                        {
                            style: {
                                [MgrDomDefine.STYLE_COLOR]: MgrDomDefine.STYLE_COLOR_WHITE
                            }
                        },

                        IndexGlobal.mcExpCreate ().currStatus.onDraggerTxt()
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
                        if (IndexGlobal.mcExpCreate ().img == null) {
                            return NodeModules.antd.message.error (`请先选择图片文件`);
                        };
                        if (IndexGlobal.mcExpCreate ().currStatus != IndexGlobal.mcExpCreate ().statusIdle) {
                            return NodeModules.antd.message.error (`文件加载中，请稍后`);
                        };
                        let dataSrc = IndexGlobal.mcExpCreate ().img.image;
                        let id = IndexGlobal.inst.expCreate (dataSrc.src, dataSrc.width, dataSrc.height);
                        IndexGlobal.inst.expSelect (id);
                        IndexGlobal.mcExp ().detailCurrStatus.onImg ();
                        MgrData.inst.callDataChange ();
                    }
                },

                `确认添加`
            )
        );
    }
}
import IndexGlobal from "../IndexGlobal";
import NodeModules from "../NodeModules";
import ReactComponentExtend from "../common/ReactComponentExtend";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance";
import MgrData from "../mgr/MgrData";
import MgrDomDefine from "../mgr/MgrDomDefine";
import MgrRes from "../mgr/MgrRes";
import MgrResAssetsImage from "../mgr/MgrResAssetsImage";

export default class DomDrawingBoardLeftGlobal extends ReactComponentExtend <number> {

    render (): ReactComponentExtendInstance {
        let propsAdd = {
            onClick: () => {
                let idGen = IndexGlobal.inst.dbCreate (IndexGlobal.DB_SIZE_NEW, IndexGlobal.DB_SIZE_NEW);
                IndexGlobal.inst.dbSelect (idGen);
                MgrData.inst.callDataChange ();
            },
            style: {
                [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
            }
        };
        return ReactComponentExtend.instantiateTag (
            MgrDomDefine.TAG_DIV,
            {
                style: {
                    [MgrDomDefine.STYLE_FLEX_GROW]: 0,

                    [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                    [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN,
                }
            },

            ReactComponentExtend.instantiateTag (
                NodeModules.antd.Button,
                propsAdd,
    
                `添加空白画板`
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
                            let dataBase64: string;
                            let img: MgrResAssetsImage;
                            Promise.resolve ()
                                .then (() => {
                                    return new Promise ((resolve) => {
                                        const reader = new FileReader();
                                        reader.addEventListener('load', () => {
                                            dataBase64 = reader.result as string;
                                            resolve (null);
                                        });
                                        reader.readAsDataURL(file);
                                    });
                                })
                                .then (() => {
                                    return new Promise ((resolve) => {
                                        img = MgrRes.inst.getImg (dataBase64);
                                        if (img.currStatus == img.statusFinished) {
                                            resolve (null);
                                        }
                                        else {
                                            let listenIdLoadFinished = img.evterFinished.on (() => {
                                                img.evterFinished.off (listenIdLoadFinished);
                                                resolve (null);
                                            });
                                        };
                                    });
                                })
                                .then (() => {
                                    MgrData.inst.callDataChange ();
                                    if (IndexGlobal.SizeBan (img.image.width, img.image.height)) {
                                        return;
                                    };
                                    let recDbId = IndexGlobal.inst.dbCreate (img.image.width, img.image.height);
                                    let recDb = IndexGlobal.inst.dbMapIdToImg.get (recDbId);
                                    recDb.dbImgData.dataOrigin = dataBase64;
                                    IndexGlobal.inst.dbSelect (recDbId);
                                });
                            return false;
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
    
                        `拖放已有图片`
                    )
                )
            )
        );
    }
}
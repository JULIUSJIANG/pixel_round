import IndexGlobal from "../IndexGlobal";
import NodeModules from "../NodeModules";
import ReactComponentExtend from "../common/ReactComponentExtend";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance";
import MgrData from "../mgr/MgrData";
import MgrDataItem from "../mgr/MgrDataItem";
import MgrDomDefine from "../mgr/MgrDomDefine";
import MgrGlobal from "../mgr/MgrGlobal";
import DomImageSmooth from "./DomImageSmooth";

export default class DomExperimentRightPreviewProps extends ReactComponentExtend <number> {

    render (): ReactComponentExtendInstance {

        return ReactComponentExtend.instantiateTag (
            MgrDomDefine.TAG_DIV,
            {
                style: {
                    [MgrDomDefine.STYLE_FLEX_GROW]: 0,
                    [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                    [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                    [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.CONFIG_TXT_BG_COLOR,

                    [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                    [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW,
                }
            },

            ReactComponentExtend.instantiateTag (
                NodeModules.antd.Button,
                {
                    style: {
                        [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                        [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                    },
                    onClick: () => {
                        let recExp = IndexGlobal.inst.expCurrent ();
                        let recDbId = IndexGlobal.inst.dbCreate (recExp.uint8ArgsSmooth.cacheTexWidth, recExp.uint8ArgsSmooth.cacheTexHeight);
                        let fbo = MgrGlobal.inst.canvas3dCtx.getFbo (recExp.uint8ArgsSmooth.cacheTexWidth, recExp.uint8ArgsSmooth.cacheTexHeight);
                        let tex = MgrGlobal.inst.canvas3dCtx.createTexture ();
                        DomImageSmooth.Args.drawImgPadding (recExp.uint8ArgsSmooth, MgrGlobal.inst.canvas3dCtx, fbo, tex);
                        let recDb = IndexGlobal.inst.dbMapIdToImg.get (recDbId);
                        recDb.dbImgData.dataOrigin = fbo.toBase64 ();
                        MgrGlobal.inst.canvas3dCtx.destroyFbo (fbo);
                        MgrGlobal.inst.canvas3dCtx.destroyTex (tex);
                        IndexGlobal.inst.mcRoot.enter (IndexGlobal.inst.mcRoot.statusDrawingBoard);
                        IndexGlobal.inst.dbSelect (recDbId);
                        MgrData.inst.callDataChange ();
                    },                    
                },

                `把图片添加到画板`
            ),

            ReactComponentExtend.instantiateTag (
                NodeModules.antd.Popconfirm,
                {
                    title: "该操作不可撤销，请谨慎操作",
                    okText: "确定",
                    cancelText: "取消",
                    onConfirm: () => {
                        let targetIdx: number;
                        for (let i = 0; i < IndexGlobal.inst.expListImg.length; i++) {
                            let imgData = IndexGlobal.inst.expListImg [i];
                            if (imgData.expImgData.id == MgrData.inst.get (MgrDataItem.EXP_CURRENT_IMG)) {
                                targetIdx = i;
                                break;
                            };
                        };
                        IndexGlobal.inst.expDelete (targetIdx);
                        targetIdx = Math.min (targetIdx, IndexGlobal.inst.expListImg.length - 1);
                        if (0 <= targetIdx) {
                            IndexGlobal.inst.expSelect (IndexGlobal.inst.expListImg [targetIdx].expImgData.id);
                            IndexGlobal.mcExp ().detailCurrStatus.onImg ();
                        }
                        else {
                            IndexGlobal.mcExp ().detailCurrStatus.onCreate ();
                        };
                        MgrData.inst.callDataChange ();
                    },
                    onCancel: () => {

                    },
                },
                ReactComponentExtend.instantiateTag (
                    NodeModules.antd.Button,
                    {
                        onClick: () => {
                            
                        },
                        style: {
                            [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                        }
                    },
        
                    `删除当前文档`
                )
            ),
        );
    }
}
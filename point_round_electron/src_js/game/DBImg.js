import JWebglEnum from "../common/JWebglEnum.js";
import DBImgInitStatusFinished from "./DBImgInitStatusFinished.js";
import DBImgInitStatusIdle from "./DBImgInitStatusIdle.js";
import DBImgSrcStatusFinished from "./DBImgSrcStatusFinished.js";
import DBImgSrcStatusLoading from "./DBImgSrcStatusLoading.js";
/**
 * 画板数据的缓存
 */
export default class DBImg {
    constructor(dbImgData) {
        this.dbImgData = dbImgData;
        this.imgLoading = new Image();
        this.imgLoaded = new Image();
        this.initStatusIdle = new DBImgInitStatusIdle(this);
        this.initStatusFinished = new DBImgInitStatusFinished(this);
        this.initEnter(this.initStatusIdle);
        this.srcStatusLoading = new DBImgSrcStatusLoading(this);
        this.srcStatusFinished = new DBImgSrcStatusFinished(this);
        this.srcEnter(this.srcStatusLoading);
    }
    /**
     * 切换状态
     * @param status
     */
    initEnter(status) {
        let rec = this.initCurrStatus;
        this.initCurrStatus = status;
        if (rec) {
            rec.onExit();
        }
        ;
        this.initCurrStatus.onEnter();
    }
    /**
     * 切换状态
     * @param status
     */
    srcEnter(status) {
        let rec = this.srcCurrStatus;
        this.srcCurrStatus = status;
        if (rec) {
            rec.onExit();
        }
        ;
        this.srcCurrStatus.onEnter();
    }
    /**
     * 载入数据
     * @param arrUint8
     * @param w
     * @param h
     */
    loadUrl(url) {
        // 加载中，且和加载中的目标一致，那么忽略
        if (this.srcCurrStatus == this.srcStatusLoading && this.imgLoading.src == url) {
            return;
        }
        ;
        // 加载完毕，且和加载完毕的一致，那么忽略
        if (this.srcCurrStatus == this.srcStatusFinished && this.imgLoaded.src == url) {
            return;
        }
        ;
        this.dbImgData.dataOrigin = url;
        this.srcCurrStatus.onSrcChanged();
    }
    /**
     * 初始化
     * @param jWebgl
     */
    initForJWebgl(jWebgl) {
        if (jWebgl != this._jwebgl) {
            this._jwebgl = jWebgl;
            this.texture = this._jwebgl.canvasWebglCtx.createTexture();
        }
        ;
        this._jwebgl.canvasWebglCtx.pixelStorei(JWebglEnum.PixelStoreIPName.UNPACK_FLIP_Y_WEBGL, 1);
        this._jwebgl.canvasWebglCtx.activeTexture(JWebglEnum.ActiveTexture.TEXTURE0);
        this._jwebgl.canvasWebglCtx.bindTexture(JWebglEnum.BindTexture.TEXTURE_2D, this.texture);
        this._jwebgl.canvasWebglCtx.texParameteri(JWebglEnum.BindTexture.TEXTURE_2D, JWebglEnum.TexParameteriPName.TEXTURE_MIN_FILTER, JWebglEnum.TexParameteriParam.NEAREST);
        this._jwebgl.canvasWebglCtx.texParameteri(JWebglEnum.BindTexture.TEXTURE_2D, JWebglEnum.TexParameteriPName.TEXTURE_MAG_FILTER, JWebglEnum.TexParameteriParam.NEAREST);
        this._jwebgl.canvasWebglCtx.texParameteri(JWebglEnum.BindTexture.TEXTURE_2D, JWebglEnum.TexParameteriPName.TEXTURE_WRAP_S, JWebglEnum.TexParameteriParam.CLAMP_TO_EDGE);
        this._jwebgl.canvasWebglCtx.texParameteri(JWebglEnum.BindTexture.TEXTURE_2D, JWebglEnum.TexParameteriPName.TEXTURE_WRAP_T, JWebglEnum.TexParameteriParam.CLAMP_TO_EDGE);
        this._jwebgl.canvasWebglCtx.texImage2D(JWebglEnum.BindTexture.TEXTURE_2D, 0, JWebglEnum.TexImage2DFormat.RGBA, JWebglEnum.TexImage2DFormat.RGBA, JWebglEnum.VertexAttriPointerType.UNSIGNED_BYTE, this.imgLoaded);
    }
}

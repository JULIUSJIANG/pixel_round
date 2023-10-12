import JWebgl from "../common/JWebgl.js";
import JWebglEnum from "../common/JWebglEnum.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import DBImgInitStatus from "./DBImgInitStatus.js";
import DBImgInitStatusFinished from "./DBImgInitStatusFinished.js";
import DBImgInitStatusIdle from "./DBImgInitStatusIdle.js";
import DBImgSrcStatus from "./DBImgSrcStatus.js";
import DBImgSrcStatusFinished from "./DBImgSrcStatusFinished.js";
import DBImgSrcStatusLoading from "./DBImgSrcStatusLoading.js";

/**
 * 画板数据的缓存
 */
export default class DBImg {

    /**
     * 标识
     */
    dbImgData: MgrDataItem.DBImgData;

    /**
     * 处于加载中的图片标签
     */
    imgLoading: HTMLImageElement;
    /**
     * 最新一个已加载完的图片
     */
    imgLoaded: HTMLImageElement;

    constructor (dbImgData: MgrDataItem.DBImgData) {
        this.dbImgData = dbImgData;
        this.imgLoading = new Image ();
        this.imgLoaded = new Image ();

        this.initStatusIdle = new DBImgInitStatusIdle (this);
        this.initStatusFinished = new DBImgInitStatusFinished (this);
        this.initEnter (this.initStatusIdle);

        this.srcStatusLoading = new DBImgSrcStatusLoading (this);
        this.srcStatusFinished = new DBImgSrcStatusFinished (this);
        this.srcEnter (this.srcStatusLoading);
    }

    /**
     * 状态 - 尚未初始化
     */
    initStatusIdle: DBImgInitStatusIdle;
    /**
     * 状态 - 初始化完毕
     */
    initStatusFinished: DBImgInitStatusFinished;

    /**
     * 当前状态
     */
    initCurrStatus: DBImgInitStatus;

    /**
     * 切换状态
     * @param status 
     */
    initEnter (status: DBImgInitStatus) {
        let rec = this.initCurrStatus;
        this.initCurrStatus = status;
        if (rec) {
            rec.onExit ();
        };
        this.initCurrStatus.onEnter ();
    }

    /**
     * 状态 - 加载中
     */
    srcStatusLoading: DBImgSrcStatusLoading;
    /**
     * 状态 - 已完成
     */
    srcStatusFinished: DBImgSrcStatusFinished;

    /**
     * 当前状态
     */
    srcCurrStatus: DBImgSrcStatus;

    /**
     * 切换状态
     * @param status 
     */
    srcEnter (status: DBImgSrcStatus) {
        let rec = this.srcCurrStatus;
        this.srcCurrStatus = status;
        if (rec) {
            rec.onExit ();
        };
        this.srcCurrStatus.onEnter ();
    }

    /**
     * 载入数据
     * @param arrUint8 
     * @param w 
     * @param h 
     */
    loadUrl (url: string) {
        // 加载中，且和加载中的目标一致，那么忽略
        if (this.srcCurrStatus == this.srcStatusLoading && this.imgLoading.src == url) {
            return;
        };
        // 加载完毕，且和加载完毕的一致，那么忽略
        if (this.srcCurrStatus == this.srcStatusFinished && this.imgLoaded.src == url) {
            return;
        };
        this.dbImgData.dataOrigin = url;
        this.srcCurrStatus.onSrcChanged ();
    }

    /**
     * 最新针对的上下文
     */
    private _jwebgl: JWebgl;
    /**
     * 对应的纹理
     */
    texture: WebGLTexture;
    /**
     * 初始化
     * @param jWebgl 
     */
    initForJWebgl (jWebgl: JWebgl) {
        if (jWebgl != this._jwebgl) {
            this._jwebgl = jWebgl;
            this.texture = this._jwebgl.canvasWebglCtx.createTexture ();
        };
        this._jwebgl.canvasWebglCtx.pixelStorei (JWebglEnum.PixelStoreIPName.UNPACK_FLIP_Y_WEBGL, 1);
        this._jwebgl.canvasWebglCtx.activeTexture (JWebglEnum.ActiveTexture.TEXTURE0);
        this._jwebgl.canvasWebglCtx.bindTexture (JWebglEnum.BindTexture.TEXTURE_2D, this.texture);
        this._jwebgl.canvasWebglCtx.texParameteri (JWebglEnum.BindTexture.TEXTURE_2D, JWebglEnum.TexParameteriPName.TEXTURE_MIN_FILTER, JWebglEnum.TexParameteriParam.NEAREST);
        this._jwebgl.canvasWebglCtx.texParameteri (JWebglEnum.BindTexture.TEXTURE_2D, JWebglEnum.TexParameteriPName.TEXTURE_MAG_FILTER, JWebglEnum.TexParameteriParam.NEAREST);
        this._jwebgl.canvasWebglCtx.texParameteri (JWebglEnum.BindTexture.TEXTURE_2D, JWebglEnum.TexParameteriPName.TEXTURE_WRAP_S, JWebglEnum.TexParameteriParam.CLAMP_TO_EDGE);
        this._jwebgl.canvasWebglCtx.texParameteri (JWebglEnum.BindTexture.TEXTURE_2D, JWebglEnum.TexParameteriPName.TEXTURE_WRAP_T, JWebglEnum.TexParameteriParam.CLAMP_TO_EDGE);
        this._jwebgl.canvasWebglCtx.texImage2D (JWebglEnum.BindTexture.TEXTURE_2D, 0, JWebglEnum.TexImage2DFormat.RGBA, JWebglEnum.TexImage2DFormat.RGBA, JWebglEnum.VertexAttriPointerType.UNSIGNED_BYTE, this.imgLoaded);
    }
}
import JWebglDefine from "./JWebglDefine.js";
/**
 * 其实就是 JWebglDefine 基础上的分类
 */
JWebglDefine.POLYGON_OFFSET_FILL;
var JWebglEnum;
(function (JWebglEnum) {
    /**
     * 深度缓冲区的绑定
     */
    let FramebufferRenderbufferAttachment;
    (function (FramebufferRenderbufferAttachment) {
        FramebufferRenderbufferAttachment[FramebufferRenderbufferAttachment["DEPTH_ATTACHMENT"] = JWebglDefine.DEPTH_ATTACHMENT] = "DEPTH_ATTACHMENT";
    })(FramebufferRenderbufferAttachment = JWebglEnum.FramebufferRenderbufferAttachment || (JWebglEnum.FramebufferRenderbufferAttachment = {}));
    ;
    /**
     * 帧缓冲区的绑定
     */
    let FramebufferTexture2DAttachment;
    (function (FramebufferTexture2DAttachment) {
        FramebufferTexture2DAttachment[FramebufferTexture2DAttachment["COLOR_ATTACHMENT0"] = JWebglDefine.COLOR_ATTACHMENT0] = "COLOR_ATTACHMENT0";
    })(FramebufferTexture2DAttachment = JWebglEnum.FramebufferTexture2DAttachment || (JWebglEnum.FramebufferTexture2DAttachment = {}));
    ;
    /**
     * 帧缓冲区
     */
    let BindFramebufferTarget;
    (function (BindFramebufferTarget) {
        BindFramebufferTarget[BindFramebufferTarget["FRAMEBUFFER"] = JWebglDefine.FRAMEBUFFER] = "FRAMEBUFFER";
    })(BindFramebufferTarget = JWebglEnum.BindFramebufferTarget || (JWebglEnum.BindFramebufferTarget = {}));
    ;
    /**
     * 渲染缓冲区格式
     */
    let RenderbufferStorageInternalFormat;
    (function (RenderbufferStorageInternalFormat) {
        RenderbufferStorageInternalFormat[RenderbufferStorageInternalFormat["DEPTH_COMPONENT16"] = JWebglDefine.DEPTH_COMPONENT16] = "DEPTH_COMPONENT16";
    })(RenderbufferStorageInternalFormat = JWebglEnum.RenderbufferStorageInternalFormat || (JWebglEnum.RenderbufferStorageInternalFormat = {}));
    ;
    /**
     * 渲染缓冲区
     */
    let BindRenderbuffer;
    (function (BindRenderbuffer) {
        BindRenderbuffer[BindRenderbuffer["RENDERBUFFER"] = JWebglDefine.RENDERBUFFER] = "RENDERBUFFER";
    })(BindRenderbuffer = JWebglEnum.BindRenderbuffer || (JWebglEnum.BindRenderbuffer = {}));
    ;
    /**
     * 透明度混合
     */
    let BlendFunc;
    (function (BlendFunc) {
        BlendFunc[BlendFunc["ZERO"] = JWebglDefine.ZERO] = "ZERO";
        BlendFunc[BlendFunc["ONE"] = JWebglDefine.ONE] = "ONE";
        BlendFunc[BlendFunc["SRC_COLOR"] = JWebglDefine.SRC_COLOR] = "SRC_COLOR";
        BlendFunc[BlendFunc["ONE_MINUS_SRC_COLOR"] = JWebglDefine.ONE_MINUS_SRC_COLOR] = "ONE_MINUS_SRC_COLOR";
        BlendFunc[BlendFunc["SRC_ALPHA"] = JWebglDefine.SRC_ALPHA] = "SRC_ALPHA";
        BlendFunc[BlendFunc["ONE_MINUS_SRC_ALPHA"] = JWebglDefine.ONE_MINUS_SRC_ALPHA] = "ONE_MINUS_SRC_ALPHA";
        BlendFunc[BlendFunc["DST_ALPHA"] = JWebglDefine.DST_ALPHA] = "DST_ALPHA";
        BlendFunc[BlendFunc["ONE_MINUS_DST_ALPHA"] = JWebglDefine.ONE_MINUS_DST_ALPHA] = "ONE_MINUS_DST_ALPHA";
        BlendFunc[BlendFunc["DST_COLOR"] = JWebglDefine.DST_COLOR] = "DST_COLOR";
        BlendFunc[BlendFunc["ONE_MINUS_DST_COLOR"] = JWebglDefine.ONE_MINUS_DST_COLOR] = "ONE_MINUS_DST_COLOR";
        BlendFunc[BlendFunc["SRC_ALPHA_SATURATE"] = JWebglDefine.SRC_ALPHA_SATURATE] = "SRC_ALPHA_SATURATE";
    })(BlendFunc = JWebglEnum.BlendFunc || (JWebglEnum.BlendFunc = {}));
    ;
    /**
     * 开启程序功能
     */
    let EnableCap;
    (function (EnableCap) {
        EnableCap[EnableCap["DEPTH_TEST"] = JWebglDefine.DEPTH_TEST] = "DEPTH_TEST";
        EnableCap[EnableCap["BLEND"] = JWebglDefine.BLEND] = "BLEND";
        EnableCap[EnableCap["POLYGON_OFFSET_FILL"] = JWebglDefine.POLYGON_OFFSET_FILL] = "POLYGON_OFFSET_FILL";
    })(EnableCap = JWebglEnum.EnableCap || (JWebglEnum.EnableCap = {}));
    ;
    /**
     * 格式
     */
    let TexImage2DFormat;
    (function (TexImage2DFormat) {
        TexImage2DFormat[TexImage2DFormat["RGB"] = JWebglDefine.RGB] = "RGB";
        TexImage2DFormat[TexImage2DFormat["RGBA"] = JWebglDefine.RGBA] = "RGBA";
        TexImage2DFormat[TexImage2DFormat["ALPHA"] = JWebglDefine.ALPHA] = "ALPHA";
        TexImage2DFormat[TexImage2DFormat["LUMINANCE"] = JWebglDefine.LUMINANCE] = "LUMINANCE";
        TexImage2DFormat[TexImage2DFormat["LUMINANCE_ALPHA"] = JWebglDefine.LUMINANCE_ALPHA] = "LUMINANCE_ALPHA";
    })(TexImage2DFormat = JWebglEnum.TexImage2DFormat || (JWebglEnum.TexImage2DFormat = {}));
    ;
    /**
     * 纹理属性值
     */
    let TexParameteriParam;
    (function (TexParameteriParam) {
        TexParameteriParam[TexParameteriParam["LINEAR"] = JWebglDefine.LINEAR] = "LINEAR";
        TexParameteriParam[TexParameteriParam["NEAREST"] = JWebglDefine.NEAREST] = "NEAREST";
        TexParameteriParam[TexParameteriParam["REPEAT"] = JWebglDefine.REPEAT] = "REPEAT";
        TexParameteriParam[TexParameteriParam["MIRRORED_REPEAT"] = JWebglDefine.MIRRORED_REPEAT] = "MIRRORED_REPEAT";
        TexParameteriParam[TexParameteriParam["CLAMP_TO_EDGE"] = JWebglDefine.CLAMP_TO_EDGE] = "CLAMP_TO_EDGE";
    })(TexParameteriParam = JWebglEnum.TexParameteriParam || (JWebglEnum.TexParameteriParam = {}));
    ;
    /**
     * 设置纹理属性
     */
    let TexParameteriPName;
    (function (TexParameteriPName) {
        TexParameteriPName[TexParameteriPName["TEXTURE_MIN_FILTER"] = JWebglDefine.TEXTURE_MIN_FILTER] = "TEXTURE_MIN_FILTER";
        TexParameteriPName[TexParameteriPName["TEXTURE_MAG_FILTER"] = JWebglDefine.TEXTURE_MAG_FILTER] = "TEXTURE_MAG_FILTER";
        TexParameteriPName[TexParameteriPName["TEXTURE_WRAP_S"] = JWebglDefine.TEXTURE_WRAP_S] = "TEXTURE_WRAP_S";
        TexParameteriPName[TexParameteriPName["TEXTURE_WRAP_T"] = JWebglDefine.TEXTURE_WRAP_T] = "TEXTURE_WRAP_T";
    })(TexParameteriPName = JWebglEnum.TexParameteriPName || (JWebglEnum.TexParameteriPName = {}));
    ;
    /**
     * 绑定纹理
     */
    let BindTexture;
    (function (BindTexture) {
        BindTexture[BindTexture["TEXTURE_2D"] = JWebglDefine.TEXTURE_2D] = "TEXTURE_2D";
        BindTexture[BindTexture["TEXTURE_CUBE_MAP"] = JWebglDefine.TEXTURE_CUBE_MAP] = "TEXTURE_CUBE_MAP";
    })(BindTexture = JWebglEnum.BindTexture || (JWebglEnum.BindTexture = {}));
    ;
    /**
     * 纹理槽位
     */
    let ActiveTexture;
    (function (ActiveTexture) {
        ActiveTexture[ActiveTexture["TEXTURE0"] = JWebglDefine.TEXTURE0] = "TEXTURE0";
    })(ActiveTexture = JWebglEnum.ActiveTexture || (JWebglEnum.ActiveTexture = {}));
    ;
    /**
     * 纹理的预处理
     */
    let PixelStoreIPName;
    (function (PixelStoreIPName) {
        PixelStoreIPName[PixelStoreIPName["UNPACK_FLIP_Y_WEBGL"] = JWebglDefine.UNPACK_FLIP_Y_WEBGL] = "UNPACK_FLIP_Y_WEBGL";
        PixelStoreIPName[PixelStoreIPName["UNPACK_PREMULTIPLY_ALPHA_WEBGL"] = JWebglDefine.UNPACK_PREMULTIPLY_ALPHA_WEBGL] = "UNPACK_PREMULTIPLY_ALPHA_WEBGL";
    })(PixelStoreIPName = JWebglEnum.PixelStoreIPName || (JWebglEnum.PixelStoreIPName = {}));
    /**
     * 数据类型
     */
    let VertexAttriPointerType;
    (function (VertexAttriPointerType) {
        VertexAttriPointerType[VertexAttriPointerType["BYTE"] = JWebglDefine.BYTE] = "BYTE";
        VertexAttriPointerType[VertexAttriPointerType["UNSIGNED_BYTE"] = JWebglDefine.UNSIGNED_BYTE] = "UNSIGNED_BYTE";
        VertexAttriPointerType[VertexAttriPointerType["SHORT"] = JWebglDefine.SHORT] = "SHORT";
        VertexAttriPointerType[VertexAttriPointerType["UNSIGNED_SHORT"] = JWebglDefine.UNSIGNED_SHORT] = "UNSIGNED_SHORT";
        VertexAttriPointerType[VertexAttriPointerType["INT"] = JWebglDefine.INT] = "INT";
        VertexAttriPointerType[VertexAttriPointerType["UNSIGNED_INT"] = JWebglDefine.UNSIGNED_INT] = "UNSIGNED_INT";
        VertexAttriPointerType[VertexAttriPointerType["FLOAT"] = JWebglDefine.FLOAT] = "FLOAT";
        VertexAttriPointerType[VertexAttriPointerType["UNSIGNED_SHORT_5_6_5"] = JWebglDefine.UNSIGNED_SHORT_5_6_5] = "UNSIGNED_SHORT_5_6_5";
        VertexAttriPointerType[VertexAttriPointerType["UNSIGNED_SHORT_4_4_4_4"] = JWebglDefine.UNSIGNED_SHORT_4_4_4_4] = "UNSIGNED_SHORT_4_4_4_4";
        VertexAttriPointerType[VertexAttriPointerType["UNSIGNED_SHORT_5_5_5_1"] = JWebglDefine.UNSIGNED_SHORT_5_5_5_1] = "UNSIGNED_SHORT_5_5_5_1";
    })(VertexAttriPointerType = JWebglEnum.VertexAttriPointerType || (JWebglEnum.VertexAttriPointerType = {}));
    ;
    /**
     * 缓冲区用途
     */
    let BufferDataUsage;
    (function (BufferDataUsage) {
        BufferDataUsage[BufferDataUsage["STATIC_DRAW"] = JWebglDefine.STATIC_DRAW] = "STATIC_DRAW";
        BufferDataUsage[BufferDataUsage["STREAM_DRAW"] = JWebglDefine.STREAM_DRAW] = "STREAM_DRAW";
        BufferDataUsage[BufferDataUsage["DYNAMIC_DRAW"] = JWebglDefine.DYNAMIC_DRAW] = "DYNAMIC_DRAW";
    })(BufferDataUsage = JWebglEnum.BufferDataUsage || (JWebglEnum.BufferDataUsage = {}));
    ;
    /**
     * 缓冲区类型
     */
    let BindBufferTarget;
    (function (BindBufferTarget) {
        BindBufferTarget[BindBufferTarget["ARRAY_BUFFER"] = JWebglDefine.ARRAY_BUFFER] = "ARRAY_BUFFER";
        BindBufferTarget[BindBufferTarget["ELEMENT_ARRAY_BUFFER"] = JWebglDefine.ELEMENT_ARRAY_BUFFER] = "ELEMENT_ARRAY_BUFFER";
    })(BindBufferTarget = JWebglEnum.BindBufferTarget || (JWebglEnum.BindBufferTarget = {}));
    ;
    /**
     * 着色器类型
     */
    let CreateShaderType;
    (function (CreateShaderType) {
        CreateShaderType[CreateShaderType["VERTEX_SHADER"] = JWebglDefine.VERTEX_SHADER] = "VERTEX_SHADER";
        CreateShaderType[CreateShaderType["FRAGMENT_SHADER"] = JWebglDefine.FRAGMENT_SHADER] = "FRAGMENT_SHADER";
    })(CreateShaderType = JWebglEnum.CreateShaderType || (JWebglEnum.CreateShaderType = {}));
    ;
    /**
     * 着色器情况
     */
    let GetShaderParameterPName;
    (function (GetShaderParameterPName) {
        GetShaderParameterPName[GetShaderParameterPName["COMPILE_STATUS"] = JWebglDefine.COMPILE_STATUS] = "COMPILE_STATUS";
    })(GetShaderParameterPName = JWebglEnum.GetShaderParameterPName || (JWebglEnum.GetShaderParameterPName = {}));
    ;
    /**
     * 着色程序情况
     */
    let GetProgramParameterPName;
    (function (GetProgramParameterPName) {
        GetProgramParameterPName[GetProgramParameterPName["LINK_STATUS"] = JWebglDefine.LINK_STATUS] = "LINK_STATUS";
    })(GetProgramParameterPName = JWebglEnum.GetProgramParameterPName || (JWebglEnum.GetProgramParameterPName = {}));
    ;
    /**
     * 绘制集合
     */
    let DrawArraysMode;
    (function (DrawArraysMode) {
        DrawArraysMode[DrawArraysMode["POINTS"] = JWebglDefine.POINTS] = "POINTS";
        DrawArraysMode[DrawArraysMode["LINES"] = JWebglDefine.LINES] = "LINES";
        DrawArraysMode[DrawArraysMode["LINE_LOOP"] = JWebglDefine.LINE_LOOP] = "LINE_LOOP";
        DrawArraysMode[DrawArraysMode["LINE_STRIP"] = JWebglDefine.LINE_STRIP] = "LINE_STRIP";
        DrawArraysMode[DrawArraysMode["TRIANGLES"] = JWebglDefine.TRIANGLES] = "TRIANGLES";
        DrawArraysMode[DrawArraysMode["TRIANGLE_STRIP"] = JWebglDefine.TRIANGLE_STRIP] = "TRIANGLE_STRIP";
        DrawArraysMode[DrawArraysMode["TRIANGLE_FAN"] = JWebglDefine.TRIANGLE_FAN] = "TRIANGLE_FAN";
    })(DrawArraysMode = JWebglEnum.DrawArraysMode || (JWebglEnum.DrawArraysMode = {}));
    /**
     * 缓冲区
     */
    let ClearMask;
    (function (ClearMask) {
        ClearMask[ClearMask["COLOR_BUFFER_BIT"] = JWebglDefine.COLOR_BUFFER_BIT] = "COLOR_BUFFER_BIT";
        ClearMask[ClearMask["DEPTH_BUFFER_BIT"] = JWebglDefine.DEPTH_BUFFER_BIT] = "DEPTH_BUFFER_BIT";
        ClearMask[ClearMask["STENCIL_BUFFER_BIT"] = JWebglDefine.STENCIL_BUFFER_BIT] = "STENCIL_BUFFER_BIT";
    })(ClearMask = JWebglEnum.ClearMask || (JWebglEnum.ClearMask = {}));
    /**
     * y 轴上的对齐
     */
    let TextBaseLine;
    (function (TextBaseLine) {
        TextBaseLine["MIDDLE"] = "middle";
        TextBaseLine["TOP"] = "top";
        TextBaseLine["Bottom"] = "bottom";
    })(TextBaseLine = JWebglEnum.TextBaseLine || (JWebglEnum.TextBaseLine = {}));
    /**
     * x 轴上的对齐
     */
    let TextAlign;
    (function (TextAlign) {
        TextAlign["CENTER"] = "center";
        TextAlign["LEFT"] = "left";
        TextAlign["RIGHT"] = "right";
    })(TextAlign = JWebglEnum.TextAlign || (JWebglEnum.TextAlign = {}));
})(JWebglEnum || (JWebglEnum = {}));
export default JWebglEnum;

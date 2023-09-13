import JWebglDefine from "./JWebglDefine.js";

/**
 * 其实就是 JWebglDefine 基础上的分类
 */
JWebglDefine.POLYGON_OFFSET_FILL
namespace JWebglEnum {
    /**
     * 深度缓冲区的绑定
     */
    export enum FramebufferRenderbufferAttachment {
        DEPTH_ATTACHMENT = JWebglDefine.DEPTH_ATTACHMENT
    };
    /**
     * 帧缓冲区的绑定
     */
    export enum FramebufferTexture2DAttachment {
        COLOR_ATTACHMENT0 = JWebglDefine.COLOR_ATTACHMENT0
    };
    /**
     * 帧缓冲区
     */
    export enum BindFramebufferTarget {
        FRAMEBUFFER = JWebglDefine.FRAMEBUFFER
    };
    /**
     * 渲染缓冲区格式
     */
    export enum RenderbufferStorageInternalFormat {
        DEPTH_COMPONENT16 = JWebglDefine.DEPTH_COMPONENT16
    };
    /**
     * 渲染缓冲区
     */
    export enum BindRenderbuffer {
        RENDERBUFFER = JWebglDefine.RENDERBUFFER,
    };
    /**
     * 透明度混合
     */
    export enum BlendFunc {
        ZERO = JWebglDefine.ZERO,
        ONE = JWebglDefine.ONE,
        SRC_COLOR = JWebglDefine.SRC_COLOR,
        ONE_MINUS_SRC_COLOR = JWebglDefine.ONE_MINUS_SRC_COLOR,
        SRC_ALPHA = JWebglDefine.SRC_ALPHA,
        ONE_MINUS_SRC_ALPHA = JWebglDefine.ONE_MINUS_SRC_ALPHA,
        DST_ALPHA = JWebglDefine.DST_ALPHA,
        ONE_MINUS_DST_ALPHA = JWebglDefine.ONE_MINUS_DST_ALPHA,
        DST_COLOR = JWebglDefine.DST_COLOR,
        ONE_MINUS_DST_COLOR = JWebglDefine.ONE_MINUS_DST_COLOR,
        SRC_ALPHA_SATURATE = JWebglDefine.SRC_ALPHA_SATURATE
    };
    /**
     * 开启程序功能
     */
    export enum EnableCap {
        DEPTH_TEST = JWebglDefine.DEPTH_TEST,
        BLEND = JWebglDefine.BLEND,
        POLYGON_OFFSET_FILL = JWebglDefine.POLYGON_OFFSET_FILL
    };
    /**
     * 格式
     */
    export enum TexImage2DFormat {
        RGB = JWebglDefine.RGB,
        RGBA = JWebglDefine.RGBA,
        ALPHA = JWebglDefine.ALPHA,
        LUMINANCE = JWebglDefine.LUMINANCE,
        LUMINANCE_ALPHA = JWebglDefine.LUMINANCE_ALPHA
    };
    /**
     * 纹理属性值
     */
    export enum TexParameteriParam {
        LINEAR = JWebglDefine.LINEAR,
        NEAREST = JWebglDefine.NEAREST,
        REPEAT = JWebglDefine.REPEAT,
        MIRRORED_REPEAT = JWebglDefine.MIRRORED_REPEAT,
        CLAMP_TO_EDGE = JWebglDefine.CLAMP_TO_EDGE
    };
    /**
     * 设置纹理属性
     */
    export enum TexParameteriPName {
        TEXTURE_MIN_FILTER = JWebglDefine.TEXTURE_MIN_FILTER,
        TEXTURE_MAG_FILTER = JWebglDefine.TEXTURE_MAG_FILTER,
        TEXTURE_WRAP_S = JWebglDefine.TEXTURE_WRAP_S,
        TEXTURE_WRAP_T = JWebglDefine.TEXTURE_WRAP_T
    };
    /**
     * 绑定纹理
     */
    export enum BindTexture {
        TEXTURE_2D = JWebglDefine.TEXTURE_2D,
        TEXTURE_CUBE_MAP = JWebglDefine.TEXTURE_CUBE_MAP
    };
    /**
     * 纹理槽位
     */
    export enum ActiveTexture {
        TEXTURE0 = JWebglDefine.TEXTURE0
    };
    /**
     * 纹理的预处理
     */
    export enum PixelStoreIPName {
        UNPACK_FLIP_Y_WEBGL = JWebglDefine.UNPACK_FLIP_Y_WEBGL,
        UNPACK_PREMULTIPLY_ALPHA_WEBGL = JWebglDefine.UNPACK_PREMULTIPLY_ALPHA_WEBGL
    }
    /**
     * 数据类型
     */
    export enum VertexAttriPointerType {
        BYTE = JWebglDefine.BYTE,
        UNSIGNED_BYTE = JWebglDefine.UNSIGNED_BYTE,
        SHORT = JWebglDefine.SHORT,
        UNSIGNED_SHORT = JWebglDefine.UNSIGNED_SHORT,
        INT = JWebglDefine.INT,
        UNSIGNED_INT = JWebglDefine.UNSIGNED_INT,
        FLOAT = JWebglDefine.FLOAT,
        UNSIGNED_SHORT_5_6_5 = JWebglDefine.UNSIGNED_SHORT_5_6_5,
        UNSIGNED_SHORT_4_4_4_4 = JWebglDefine.UNSIGNED_SHORT_4_4_4_4,
        UNSIGNED_SHORT_5_5_5_1 = JWebglDefine.UNSIGNED_SHORT_5_5_5_1,
    };
    /**
     * 缓冲区用途
     */
    export enum BufferDataUsage {
        STATIC_DRAW = JWebglDefine.STATIC_DRAW,
        STREAM_DRAW = JWebglDefine.STREAM_DRAW,
        DYNAMIC_DRAW = JWebglDefine.DYNAMIC_DRAW,
    };
    /**
     * 缓冲区类型
     */
    export enum BindBufferTarget {
        ARRAY_BUFFER = JWebglDefine.ARRAY_BUFFER,
        ELEMENT_ARRAY_BUFFER = JWebglDefine.ELEMENT_ARRAY_BUFFER,
    };
    /**
     * 着色器类型
     */
    export enum CreateShaderType {
        VERTEX_SHADER = JWebglDefine.VERTEX_SHADER,
        FRAGMENT_SHADER = JWebglDefine.FRAGMENT_SHADER,
    };
    /**
     * 着色器情况
     */
    export enum GetShaderParameterPName {
        COMPILE_STATUS = JWebglDefine.COMPILE_STATUS,
    };
    /**
     * 着色程序情况
     */
    export enum GetProgramParameterPName {
        LINK_STATUS = JWebglDefine.LINK_STATUS,
    };
    /**
     * 绘制集合
     */
    export enum DrawArraysMode {
        POINTS = JWebglDefine.POINTS,
        LINES = JWebglDefine.LINES,
        LINE_LOOP = JWebglDefine.LINE_LOOP,
        LINE_STRIP = JWebglDefine.LINE_STRIP,
        TRIANGLES = JWebglDefine.TRIANGLES,
        TRIANGLE_STRIP = JWebglDefine.TRIANGLE_STRIP,
        TRIANGLE_FAN = JWebglDefine.TRIANGLE_FAN,
    }
    /**
     * 缓冲区
     */
    export enum ClearMask {
        COLOR_BUFFER_BIT = JWebglDefine.COLOR_BUFFER_BIT,
        DEPTH_BUFFER_BIT = JWebglDefine.DEPTH_BUFFER_BIT,
        STENCIL_BUFFER_BIT = JWebglDefine.STENCIL_BUFFER_BIT,
    }

    /**
     * y 轴上的对齐
     */
    export enum TextBaseLine {
        MIDDLE = "middle",
        TOP = "top",
        Bottom = "bottom"
    }

    /**
     * x 轴上的对齐
     */
    export enum TextAlign {
        CENTER = "center",
        LEFT = "left",
        RIGHT = "right"
    }
}

export default JWebglEnum;
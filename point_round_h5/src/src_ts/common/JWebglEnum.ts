import JWebglConst from "./JWebglConst";

/**
 * 其实就是 JWebglDefine 基础上的分类
 */
namespace JWebglEnum {
    export enum TexImage2DType {
        UNSIGNED_BYTE = JWebglConst.UNSIGNED_BYTE
    }

    export enum TexImage2DTarget {
        TEXTURE_2D = JWebglConst.TEXTURE_2D
    }

    /**
     * 读取的格式
     */
    export enum ReadPixelsFormat {
        RGBA = JWebglConst.RGBA
    };
    /**
     * 读取的类型
     */
    export enum ReadPixelType {
        FLOAT = JWebglConst.FLOAT,
        UNSIGNED_BYTE = JWebglConst.UNSIGNED_BYTE
    };
    /**
     * 深度缓冲区的绑定
     */
    export enum FramebufferRenderbufferAttachment {
        DEPTH_ATTACHMENT = JWebglConst.DEPTH_ATTACHMENT
    };
    /**
     * 帧缓冲区的绑定
     */
    export enum FramebufferTexture2DAttachment {
        COLOR_ATTACHMENT0 = JWebglConst.COLOR_ATTACHMENT0
    };
    /**
     * 帧缓冲区
     */
    export enum BindFramebufferTarget {
        FRAMEBUFFER = JWebglConst.FRAMEBUFFER
    };
    /**
     * 渲染缓冲区格式
     */
    export enum RenderbufferStorageInternalFormat {
        DEPTH_COMPONENT16 = JWebglConst.DEPTH_COMPONENT16
    };
    /**
     * 渲染缓冲区
     */
    export enum BindRenderbuffer {
        RENDERBUFFER = JWebglConst.RENDERBUFFER,
    };
    /**
     * 透明度混合
     */
    export enum BlendFunc {
        ZERO = JWebglConst.ZERO,
        ONE = JWebglConst.ONE,
        SRC_COLOR = JWebglConst.SRC_COLOR,
        ONE_MINUS_SRC_COLOR = JWebglConst.ONE_MINUS_SRC_COLOR,
        SRC_ALPHA = JWebglConst.SRC_ALPHA,
        ONE_MINUS_SRC_ALPHA = JWebglConst.ONE_MINUS_SRC_ALPHA,
        DST_ALPHA = JWebglConst.DST_ALPHA,
        ONE_MINUS_DST_ALPHA = JWebglConst.ONE_MINUS_DST_ALPHA,
        DST_COLOR = JWebglConst.DST_COLOR,
        ONE_MINUS_DST_COLOR = JWebglConst.ONE_MINUS_DST_COLOR,
        SRC_ALPHA_SATURATE = JWebglConst.SRC_ALPHA_SATURATE
    };
    /**
     * 开启程序功能
     */
    export enum EnableCap {
        DEPTH_TEST = JWebglConst.DEPTH_TEST,
        BLEND = JWebglConst.BLEND,
        POLYGON_OFFSET_FILL = JWebglConst.POLYGON_OFFSET_FILL
    };
    /**
     * 格式
     */
    export enum TexImage2DFormat {
        RGB = JWebglConst.RGB,
        RGBA = JWebglConst.RGBA,
        ALPHA = JWebglConst.ALPHA,
        LUMINANCE = JWebglConst.LUMINANCE,
        LUMINANCE_ALPHA = JWebglConst.LUMINANCE_ALPHA
    };
    /**
     * 纹理参数目标
     */
    export enum TexParameteriParamTarget {
        TEXTURE_2D = JWebglConst.TEXTURE_2D
    };
    /**
     * 纹理属性值
     */
    export enum TexParameteriParam {
        LINEAR = JWebglConst.LINEAR,
        NEAREST = JWebglConst.NEAREST,
        REPEAT = JWebglConst.REPEAT,
        MIRRORED_REPEAT = JWebglConst.MIRRORED_REPEAT,
        CLAMP_TO_EDGE = JWebglConst.CLAMP_TO_EDGE
    };
    /**
     * 设置纹理属性
     */
    export enum TexParameteriPName {
        TEXTURE_MIN_FILTER = JWebglConst.TEXTURE_MIN_FILTER,
        TEXTURE_MAG_FILTER = JWebglConst.TEXTURE_MAG_FILTER,
        TEXTURE_WRAP_S = JWebglConst.TEXTURE_WRAP_S,
        TEXTURE_WRAP_T = JWebglConst.TEXTURE_WRAP_T
    };
    /**
     * 绑定纹理
     */
    export enum BindTexture {
        TEXTURE_2D = JWebglConst.TEXTURE_2D,
        TEXTURE_CUBE_MAP = JWebglConst.TEXTURE_CUBE_MAP
    };
    /**
     * 纹理槽位
     */
    export enum ActiveTexture {
        TEXTURE0 = JWebglConst.TEXTURE0
    };
    /**
     * 纹理的预处理
     */
    export enum PixelStoreIPName {
        UNPACK_FLIP_Y_WEBGL = JWebglConst.UNPACK_FLIP_Y_WEBGL,
        UNPACK_PREMULTIPLY_ALPHA_WEBGL = JWebglConst.UNPACK_PREMULTIPLY_ALPHA_WEBGL
    }
    /**
     * 数据类型
     */
    export enum VertexAttriPointerType {
        BYTE = JWebglConst.BYTE,
        UNSIGNED_BYTE = JWebglConst.UNSIGNED_BYTE,
        SHORT = JWebglConst.SHORT,
        UNSIGNED_SHORT = JWebglConst.UNSIGNED_SHORT,
        INT = JWebglConst.INT,
        UNSIGNED_INT = JWebglConst.UNSIGNED_INT,
        FLOAT = JWebglConst.FLOAT,
        UNSIGNED_SHORT_5_6_5 = JWebglConst.UNSIGNED_SHORT_5_6_5,
        UNSIGNED_SHORT_4_4_4_4 = JWebglConst.UNSIGNED_SHORT_4_4_4_4,
        UNSIGNED_SHORT_5_5_5_1 = JWebglConst.UNSIGNED_SHORT_5_5_5_1,
    };
    /**
     * 缓冲区用途
     */
    export enum BufferDataUsage {
        STATIC_DRAW = JWebglConst.STATIC_DRAW,
        STREAM_DRAW = JWebglConst.STREAM_DRAW,
        DYNAMIC_DRAW = JWebglConst.DYNAMIC_DRAW,
    };
    /**
     * 缓冲区类型
     */
    export enum BindBufferTarget {
        ARRAY_BUFFER = JWebglConst.ARRAY_BUFFER,
        ELEMENT_ARRAY_BUFFER = JWebglConst.ELEMENT_ARRAY_BUFFER,
    };
    /**
     * 着色器类型
     */
    export enum CreateShaderType {
        VERTEX_SHADER = JWebglConst.VERTEX_SHADER,
        FRAGMENT_SHADER = JWebglConst.FRAGMENT_SHADER,
    };
    /**
     * 着色器情况
     */
    export enum GetShaderParameterPName {
        COMPILE_STATUS = JWebglConst.COMPILE_STATUS,
    };
    /**
     * 着色程序情况
     */
    export enum GetProgramParameterPName {
        LINK_STATUS = JWebglConst.LINK_STATUS,
    };
    /**
     * 绘制集合
     */
    export enum DrawArraysMode {
        POINTS = JWebglConst.POINTS,
        LINES = JWebglConst.LINES,
        LINE_LOOP = JWebglConst.LINE_LOOP,
        LINE_STRIP = JWebglConst.LINE_STRIP,
        TRIANGLES = JWebglConst.TRIANGLES,
        TRIANGLE_STRIP = JWebglConst.TRIANGLE_STRIP,
        TRIANGLE_FAN = JWebglConst.TRIANGLE_FAN,
    }
    /**
     * 缓冲区
     */
    export enum ClearMask {
        COLOR_BUFFER_BIT = JWebglConst.COLOR_BUFFER_BIT,
        DEPTH_BUFFER_BIT = JWebglConst.DEPTH_BUFFER_BIT,
        STENCIL_BUFFER_BIT = JWebglConst.STENCIL_BUFFER_BIT,
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
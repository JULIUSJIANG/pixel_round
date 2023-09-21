/**
 * 组件里面经常用到的常量都放在该文件
 */
class MgrDomDefine {
}
(function (MgrDomDefine) {
    //【标签名】
    MgrDomDefine.TAG_DIV = "div";
    MgrDomDefine.TAG_PRE = "pre";
    MgrDomDefine.TAG_CANVAS = "canvas";
    MgrDomDefine.TAG_SPAN = "span";
    MgrDomDefine.TAG_INPUT = "input";
    MgrDomDefine.TAG_IMG = "img";
    //【样式名以及具体值】
    MgrDomDefine.STYLE_TEXT_ALIGN = "textAlign";
    MgrDomDefine.STYLE_TEXT_ALIGN_CENTER = "center";
    MgrDomDefine.STYLE_WIDTH = "width";
    MgrDomDefine.STYLE_WIDTH_PERCENTAGE_0 = "0%";
    MgrDomDefine.STYLE_WIDTH_PERCENTAGE_100 = "100%";
    MgrDomDefine.STYLE_WIDTH_FIT_CONTENT = "fit-content";
    MgrDomDefine.STYLE_TOP = "top";
    MgrDomDefine.STYLE_RIGHT = "right";
    MgrDomDefine.STYLE_BOTTOM = "bottom";
    MgrDomDefine.STYLE_LEFT = "left";
    MgrDomDefine.STYLE_POSITION = "position";
    MgrDomDefine.STYLE_POSITION_ABSOLUTE = "absolute";
    MgrDomDefine.STYLE_POSITION_RELATIVE = "relative";
    MgrDomDefine.STYLE_HEIGHT = "height";
    MgrDomDefine.STYLE_HEIGHT_PERCENTAGE_0 = "0%";
    MgrDomDefine.STYLE_HEIGHT_PERCENTAGE_100 = "100%";
    MgrDomDefine.STYLE_DISPLAY = "display";
    MgrDomDefine.STYLE_DISPLAY_FLEX = "flex";
    MgrDomDefine.STYLE_DISPLAY_BLOCK = "block";
    MgrDomDefine.STYLE_DISPLAY_INLINE_BLOCK = "inline-block";
    MgrDomDefine.STYLE_DISPLAY_NONE = "none";
    MgrDomDefine.STYLE_FLEX_DIRECTION = "flexDirection";
    MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN = "column";
    MgrDomDefine.STYLE_FLEX_DIRECTION_ROW = "row";
    MgrDomDefine.STYLE_FLEX_GROW = "flexGrow";
    MgrDomDefine.STYLE_BACKGROUND_COLOR = "backgroundColor";
    MgrDomDefine.STYLE_BACKGROUND_COLOR_WHITE = "white";
    MgrDomDefine.STYLE_BACKGROUND_COLOR_BLACK = "black";
    MgrDomDefine.STYLE_MARGIN = "margin";
    MgrDomDefine.STYLE_MARGIN_AUTO = "auto";
    MgrDomDefine.STYLE_MARGIN_TOP = "marginTop";
    MgrDomDefine.STYLE_MARGIN_RIGHT = "marginRight";
    MgrDomDefine.STYLE_MARGIN_BOTTOM = "marginBottom";
    MgrDomDefine.STYLE_MARGIN_LEFT = "marginLeft";
    MgrDomDefine.STYLE_PADDING = "padding";
    MgrDomDefine.STYLE_PADDING_RIGHT = "paddingRight";
    MgrDomDefine.STYLE_PADDING_BOTTOM = "paddingBottom";
    MgrDomDefine.STYLE_FLEX = "flex";
    MgrDomDefine.STYLE_OVERFLOW_X = "overflowX";
    MgrDomDefine.STYLE_OVERFLOW_X_HIDDEN = "hidden";
    MgrDomDefine.STYLE_OVERFLOW_X_SCROLL = "scroll";
    MgrDomDefine.STYLE_OVERFLOW_Y = "overflowY";
    MgrDomDefine.STYLE_OVERFLOW_Y_HIDDEN = "hidden";
    MgrDomDefine.STYLE_OVERFLOW_Y_SCROLL = "scroll";
    MgrDomDefine.STYLE_ALIGN_ITEMS = "alignItems";
    MgrDomDefine.STYLE_ALIGN_ITEMS_CENTER = "center";
    MgrDomDefine.STYLE_JUSTIFY_CONTENT = "justifyContent";
    MgrDomDefine.STYLE_JUSTIFY_CONTENT_CENTER = "center";
    MgrDomDefine.STYLE_FONT_SIZE = "fontSize";
    MgrDomDefine.STYLE_FONT_SIZE_14 = "14px";
    MgrDomDefine.STYLE_FONT_FAMILY = "fontFamily";
    MgrDomDefine.STYLE_FONT_FAMILY_YAHEI = "Microsoft YaHei";
    MgrDomDefine.STYLE_COLOR = "color";
    MgrDomDefine.STYLE_COLOR_WHITE = "white";
    //【其他的属性名】
    MgrDomDefine.PROPS_CLASS_NAME = "className";
    MgrDomDefine.PROPS_VALUE = "value";
    MgrDomDefine.PROPS_ON_CHANGE = "onChange";
    MgrDomDefine.PROPS_TYPE = "type";
    MgrDomDefine.PROPS_TYPE_PRIMARY = "primary";
    //【样式中各元素需要统一的值放这里】
    /**
     * 外边距 - 数字形式
     */
    MgrDomDefine.CONFIG_NUMBER_SPACING = 8;
    /**
     * 外边距 - 文本形式
     */
    MgrDomDefine.CONFIG_TXT_SPACING = `${MgrDomDefine.CONFIG_NUMBER_SPACING}px`;
    /**
     * 外边距 - 一半
     */
    MgrDomDefine.CONFIG_NUMBER_HALF_SPACING = MgrDomDefine.CONFIG_NUMBER_SPACING / 2;
    /**
     * 外边距 - 一半
     */
    MgrDomDefine.CONFIG_TXT_HALF_SPACING = `${MgrDomDefine.CONFIG_NUMBER_SPACING / 2}px`;
    /**
     * 外边距 - 2 倍
     */
    MgrDomDefine.CONFIG_TXT_DOUBLE_SPACING = `${MgrDomDefine.CONFIG_NUMBER_SPACING * 2}px`;
    /**
     * 分块的背景颜色
     */
    MgrDomDefine.CONFIG_TXT_BG_COLOR = "#00000088";
})(MgrDomDefine || (MgrDomDefine = {}));
export default MgrDomDefine;

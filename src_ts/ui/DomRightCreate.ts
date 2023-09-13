import IndexGlobal from "../IndexGlobal.js";
import NodeModules from "../NodeModules.js";
import JWebgl from "../common/JWebgl.js";
import JWebglColor from "../common/JWebglColor.js";
import JWebglEnum from "../common/JWebglEnum.js";
import JWebglMathMatrix4 from "../common/JWebglMathMatrix4.js";
import JWebglMathVector4 from "../common/JWebglMathVector4.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";

export default class DomRightCreate extends ReactComponentExtend<number> {

    /**
     * 3d canvas 引用器
     */
    canvasWebglRef = NodeModules.react.createRef();
    /**
     * 2d canvas 上下文
     */
    canvas2dRef = NodeModules.react.createRef();

    jWebgl: JWebgl;

    mat4M: JWebglMathMatrix4 = new JWebglMathMatrix4();

    mat4V: JWebglMathMatrix4 = new JWebglMathMatrix4();

    mat4P: JWebglMathMatrix4 = new JWebglMathMatrix4();

    reactComponentExtendOnInit(): void {
        this.testB (`./resources/pixel_test_1.png`);
        return;
        this.jWebgl = new JWebgl(this.canvasWebglRef.current);
        this.jWebgl.init();
        this.mat4M.setIdentity();
        this.mat4V.setLookAt(
            0, 0, 1,
            0, 0, 0,
            0, 1, 0
        );

        // this.testB (`./resources/pixel_test_1.png`);
    }

    reactComponentExtendOnDraw(): void {
        return;
        if (IndexGlobal.inst.createMachine.img == null) {
            return;
        };

        // 清除画面
        this.jWebgl.canvasWebglCtx.viewport(0, 0, this.jWebgl.canvasWebgl.width, this.jWebgl.canvasWebgl.height);
        this.jWebgl.canvasWebglCtx.clear(this.jWebgl.canvasWebglCtx.COLOR_BUFFER_BIT | this.jWebgl.canvasWebglCtx.DEPTH_BUFFER_BIT);

        this.mat4P.setOrtho (
            -IndexGlobal.inst.createMachine.canvasWidth / 2, IndexGlobal.inst.createMachine.canvasWidth / 2,
            -IndexGlobal.inst.createMachine.canvasHeight / 2, IndexGlobal.inst.createMachine.canvasHeight / 2,
            0, 2
        );
        JWebglMathMatrix4.multiplayMat4List (
            this.mat4P,
            this.mat4V,
            this.mat4M,
            this.jWebgl.mat4Mvp
        );

        this.jWebgl.programTriangle.uMvp.fill (this.jWebgl.mat4Mvp);
        this.jWebgl.programTriangle.add (
            new JWebglMathVector4 (-IndexGlobal.inst.createMachine.canvasWidth / 2, -IndexGlobal.inst.createMachine.canvasHeight / 2, 0),
            JWebglColor.COLOR_RED,
            new JWebglMathVector4 (IndexGlobal.inst.createMachine.canvasWidth / 2, -IndexGlobal.inst.createMachine.canvasHeight / 2, 0),
            JWebglColor.COLOR_GREEN,
            new JWebglMathVector4 (IndexGlobal.inst.createMachine.canvasWidth / 2, IndexGlobal.inst.createMachine.canvasHeight / 2, 0),
            JWebglColor.COLOR_BLUE
        );
        // this.jWebgl.programTriangle.add (
        //     new JWebglMathVector4 (-IndexGlobal.inst.createMachine.canvasWidth / 2, -IndexGlobal.inst.createMachine.canvasHeight / 2, 0),
        //     JWebglColor.COLOR_RED,
        //     new JWebglMathVector4 (IndexGlobal.inst.createMachine.canvasWidth / 2, IndexGlobal.inst.createMachine.canvasHeight / 2, 0),
        //     JWebglColor.COLOR_BLUE,
        //     new JWebglMathVector4 (-IndexGlobal.inst.createMachine.canvasWidth / 2, IndexGlobal.inst.createMachine.canvasHeight / 2, 0),
        //     JWebglColor.COLOR_WHITE,
        // );
        this.jWebgl.programTriangle.draw ();

        // let img = this.jWebgl.getImg (IndexGlobal.inst.createMachine.img.src);
        // this.jWebgl.programImg.uSampler.fill (img);

        // this.jWebgl.programImg.add (
        //     JWebglMathVector4.centerO,
        //     JWebglMathVector4.axisZStart,
        //     JWebglMathVector4.axisYEnd,
        //     IndexGlobal.inst.createMachine.canvasWidth,
        //     IndexGlobal.inst.createMachine.canvasHeight
        // );

        // let mat = new JWebglMathMatrix4 ();
        // mat.setIdentity ();
        // this.jWebgl.programImg.uMvp.fill (mat);
    }

    testA() {
        let img = new Image();
        img.onload = () => {
            // 清除画面
            this.jWebgl.canvasWebglCtx.viewport(0, 0, this.jWebgl.canvasWebgl.width, this.jWebgl.canvasWebgl.height);
            this.jWebgl.canvasWebglCtx.clear(this.jWebgl.canvasWebglCtx.COLOR_BUFFER_BIT | this.jWebgl.canvasWebglCtx.DEPTH_BUFFER_BIT);
            this.jWebgl.canvasWebglCtx.useProgram(this.jWebgl.programImg.program);

            // 顶点数据
            let dataAttribute = new Float32Array([
                -0.5, 0.5, 0.0, 1.0,
                -0.5, -0.5, 0.0, 0.0,
                0.5, 0.5, 1.0, 1.0,
                0.5, -0.5, 1.0, 0.0
            ]);
            this.jWebgl.canvasWebglCtx.bindBuffer(this.jWebgl.canvasWebglCtx.ARRAY_BUFFER, this.jWebgl._attributeBuffer);
            this.jWebgl.canvasWebglCtx.bufferData(this.jWebgl.canvasWebglCtx.ARRAY_BUFFER, dataAttribute, this.jWebgl.canvasWebglCtx.STATIC_DRAW);

            this.jWebgl.canvasWebglCtx.vertexAttribPointer(this.jWebgl.programImg.aPosition.location, 2, this.jWebgl.canvasWebglCtx.FLOAT, false, dataAttribute.BYTES_PER_ELEMENT * 4, dataAttribute.BYTES_PER_ELEMENT * 0);
            this.jWebgl.canvasWebglCtx.enableVertexAttribArray(this.jWebgl.programImg.aPosition.location);

            this.jWebgl.canvasWebglCtx.vertexAttribPointer(this.jWebgl.programImg.aTexCoord.location, 2, this.jWebgl.canvasWebglCtx.FLOAT, false, dataAttribute.BYTES_PER_ELEMENT * 4, dataAttribute.BYTES_PER_ELEMENT * 2);
            this.jWebgl.canvasWebglCtx.enableVertexAttribArray(this.jWebgl.programImg.aTexCoord.location);

            // 公共数据
            let texture = this.jWebgl.canvasWebglCtx.createTexture();
            if (!texture) {
                this.jWebgl.error(`创建纹理失败`);
            };
            this.jWebgl.canvasWebglCtx.pixelStorei(JWebglEnum.PixelStoreIPName.UNPACK_FLIP_Y_WEBGL, 1);
            this.jWebgl.canvasWebglCtx.activeTexture(JWebglEnum.ActiveTexture.TEXTURE0);
            this.jWebgl.canvasWebglCtx.bindTexture(JWebglEnum.BindTexture.TEXTURE_2D, texture);
            this.jWebgl.canvasWebglCtx.texParameteri(JWebglEnum.BindTexture.TEXTURE_2D, JWebglEnum.TexParameteriPName.TEXTURE_MIN_FILTER, JWebglEnum.TexParameteriParam.NEAREST);
            this.jWebgl.canvasWebglCtx.texParameteri(JWebglEnum.BindTexture.TEXTURE_2D, JWebglEnum.TexParameteriPName.TEXTURE_MAG_FILTER, JWebglEnum.TexParameteriParam.NEAREST);
            this.jWebgl.canvasWebglCtx.texImage2D(JWebglEnum.BindTexture.TEXTURE_2D, 0, JWebglEnum.TexImage2DFormat.RGBA, JWebglEnum.TexImage2DFormat.RGBA, JWebglEnum.VertexAttriPointerType.UNSIGNED_BYTE, img);
            this.jWebgl.canvasWebglCtx.uniform1i(this.jWebgl.programImg.uSampler.location, 0);

            // 正式绘制
            this.jWebgl.canvasWebglCtx.drawArrays(JWebglEnum.DrawArraysMode.TRIANGLE_STRIP, 0, 4);
        };
        img.src = `./resources/sky.jpg`;
    }

    testB (url: string) {
        console.log (`testB`);
        /**
         * Create a shader object
         * @param gl GL context
         * @param type the type of the shader object to be created
         * @param source shader program (string)
         * @return created shader object, or null if the creation has failed.
         */
        function loadShader(gl, type, source) {
            // Create shader object
            var shader = gl.createShader(type);
            if (shader == null) {
                console.log('unable to create shader');
                return null;
            }

            // Set the shader program
            gl.shaderSource(shader, source);

            // Compile the shader
            gl.compileShader(shader);

            // Check the result of compilation
            var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if (!compiled) {
                var error = gl.getShaderInfoLog(shader);
                console.log('Failed to compile shader: ' + error);
                gl.deleteShader(shader);
                return null;
            }

            return shader;
        }
        /**
         * Create a program object and make current
         * @param gl GL context
         * @param vshader a vertex shader program (string)
         * @param fshader a fragment shader program (string)
         * @return true, if the program object was created and successfully made current 
         */
        function initShaders(gl, vshader, fshader) {
            var program = createProgram(gl, vshader, fshader);
            if (!program) {
                console.log('Failed to create program');
                return false;
            }

            gl.useProgram(program);
            gl.program = program;

            return true;
        }

        /**
         * Create the linked program object
         * @param gl GL context
         * @param vshader a vertex shader program (string)
         * @param fshader a fragment shader program (string)
         * @return created program object, or null if the creation has failed
         */
        function createProgram(gl, vshader, fshader) {
            // Create shader object
            var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
            var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
            if (!vertexShader || !fragmentShader) {
                return null;
            }

            // Create a program object
            var program = gl.createProgram();
            if (!program) {
                return null;
            }

            // Attach the shader objects
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);

            // Link the program object
            gl.linkProgram(program);

            // Check the result of linking
            var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
            if (!linked) {
                var error = gl.getProgramInfoLog(program);
                console.log('Failed to link program: ' + error);
                gl.deleteProgram(program);
                gl.deleteShader(fragmentShader);
                gl.deleteShader(vertexShader);
                return null;
            }
            return program;
        }
        // TexturedQuad.js (c) 2012 matsuda and kanda
        // Vertex shader program
        var VSHADER_SOURCE =
            'attribute vec4 a_Position;\n' +
            'attribute vec2 a_TexCoord;\n' +
            'varying vec2 v_TexCoord;\n' +
            'void main() {\n' +
            '  gl_Position = a_Position;\n' +
            '  v_TexCoord = a_TexCoord;\n' +
            '}\n';

        // Fragment shader program
        var FSHADER_SOURCE =
            '#ifdef GL_ES\n' +
            'precision mediump float;\n' +
            '#endif\n' +
            'uniform sampler2D u_Sampler;\n' +
            'varying vec2 v_TexCoord;\n' +
            'void main() {\n' +
            '  gl_FragColor = texture2D(u_Sampler, v_TexCoord) + vec4 (v_TexCoord, 0.0, 1.0);\n' +
            '}\n';

        function main() {
            // Retrieve <canvas> element
            var canvas = document.getElementsByTagName('canvas')[0];

            // Get the rendering context for WebGL
            var gl = canvas.getContext(`webgl`);
            if (!gl) {
                console.log('Failed to get the rendering context for WebGL');
                return;
            }

            // Initialize shaders
            if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
                console.log('Failed to intialize shaders.');
                return;
            }

            // Set the vertex information
            var n = initVertexBuffers(gl);
            if (n < 0) {
                console.log('Failed to set the vertex information');
                return;
            }

            // Specify the color for clearing <canvas>
            gl.clearColor(0.0, 0.0, 0.0, 0.0);

            // Set texture
            if (!initTextures(gl, n)) {
                console.log('Failed to intialize the texture.');
                return;
            }
        }

        function initVertexBuffers(gl) {
            var verticesTexCoords = new Float32Array([
                // Vertex coordinates, texture coordinate
                -0.5, 0.5, 0.0, 1.0,
                -0.5, -0.5, 0.0, 0.0,
                0.5, 0.5, 1.0, 1.0,
                0.5, -0.5, 1.0, 0.0,
            ]);
            var n = 4; // The number of vertices

            // Create the buffer object
            var vertexTexCoordBuffer = gl.createBuffer();
            if (!vertexTexCoordBuffer) {
                console.log('Failed to create the buffer object');
                return -1;
            }

            // Bind the buffer object to target
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

            var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
            //Get the storage location of a_Position, assign and enable buffer
            var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
            if (a_Position < 0) {
                console.log('Failed to get the storage location of a_Position');
                return -1;
            }
            gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
            gl.enableVertexAttribArray(a_Position);  // Enable the assignment of the buffer object

            // Get the storage location of a_TexCoord
            var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
            if (a_TexCoord < 0) {
                console.log('Failed to get the storage location of a_TexCoord');
                return -1;
            }
            // Assign the buffer object to a_TexCoord variable
            gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
            gl.enableVertexAttribArray(a_TexCoord);  // Enable the assignment of the buffer object

            return n;
        }

        function initTextures(gl, n) {
            var texture = gl.createTexture();   // Create a texture object
            if (!texture) {
                console.log('Failed to create the texture object');
                return false;
            }

            // Get the storage location of u_Sampler
            var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
            if (!u_Sampler) {
                console.log('Failed to get the storage location of u_Sampler');
                return false;
            }
            var image = new Image();  // Create the image object
            if (!image) {
                console.log('Failed to create the image object');
                return false;
            }
            // Register the event handler to be called on loading an image
            image.onload = function () { loadTexture(gl, n, texture, u_Sampler, image); };
            // Tell the browser to load an image
            image.src = url;

            return true;
        }

        function loadTexture(gl, n, texture, u_Sampler, image) {
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
            // Enable texture unit0
            gl.activeTexture(gl.TEXTURE0);
            // Bind the texture object to the target
            gl.bindTexture(gl.TEXTURE_2D, texture);

            // Set the texture parameters
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            // Set the texture image
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

            // Set the texture unit 0 to the sampler
            gl.uniform1i(u_Sampler, 0);

            gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
        }

        main();
    }

    render(): ReactComponentExtendInstance {
        let child: ReactComponentExtendInstance;
        if (IndexGlobal.inst.createMachine.img != null) {
            child = ReactComponentExtend.instantiateTag(
                MgrDomDefine.TAG_IMG,
                {
                    src: IndexGlobal.inst.createMachine.img.src
                }
            )
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

                            [MgrDomDefine.STYLE_OVERFLOW_X]: MgrDomDefine.STYLE_OVERFLOW_X_SCROLL,
                            [MgrDomDefine.STYLE_OVERFLOW_Y]: MgrDomDefine.STYLE_OVERFLOW_Y_SCROLL
                        }
                    },

                    // 滚动的列表
                    ReactComponentExtend.instantiateTag(
                        MgrDomDefine.TAG_DIV,
                        {
                            style: {
                                [MgrDomDefine.STYLE_WIDTH]: `${IndexGlobal.inst.createMachine.canvasWidth}px`,
                                [MgrDomDefine.STYLE_HEIGHT]: `${IndexGlobal.inst.createMachine.canvasHeight}px`,
                                [MgrDomDefine.STYLE_FLEX_GROW]: 0,
                                [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.STYLE_BACKGROUND_COLOR_BLACK,
                                // [MgrDomDefine.STYLE_DISPLAY]: IndexGlobal.inst.createMachine.img == null ? MgrDomDefine.STYLE_DISPLAY_NONE : MgrDomDefine.STYLE_DISPLAY_BLOCK
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
                                    width: IndexGlobal.inst.createMachine.canvasWidth,
                                    height: IndexGlobal.inst.createMachine.canvasHeight,
                                    style: {
                                        [MgrDomDefine.STYLE_WIDTH]: `${IndexGlobal.inst.createMachine.canvasWidth}px`,
                                        [MgrDomDefine.STYLE_HEIGHT]: `${IndexGlobal.inst.createMachine.canvasHeight}px`,
                                        [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_BLOCK
                                    }
                                }
                            )
                        ),

                        // ReactComponentExtend.instantiateTag(
                        //     MgrDomDefine.TAG_DIV,
                        //     {
                        //         style: {
                        //             [MgrDomDefine.STYLE_WIDTH]: 0,
                        //             [MgrDomDefine.STYLE_HEIGHT]: 0,
                        //             [MgrDomDefine.STYLE_POSITION]: MgrDomDefine.STYLE_POSITION_RELATIVE,
                        //             [MgrDomDefine.STYLE_LEFT]: 0,
                        //             [MgrDomDefine.STYLE_TOP]: 0,
                        //         }
                        //     },
// 
                        //     ReactComponentExtend.instantiateTag(
                        //         MgrDomDefine.TAG_CANVAS,
                        //         {
                        //             ref: this.canvas2dRef,
                        //             width: IndexGlobal.inst.createMachine.canvasWidth,
                        //             height: IndexGlobal.inst.createMachine.canvasHeight,
                        //             style: {
                        //                 [MgrDomDefine.STYLE_WIDTH]: `${IndexGlobal.inst.createMachine.canvasWidth}px`,
                        //                 [MgrDomDefine.STYLE_HEIGHT]: `${IndexGlobal.inst.createMachine.canvasHeight}px`,
                        //                 [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_BLOCK
                        //             }
                        //         }
                        //     )
                        // )
                    ),
                    child
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
                                NodeModules.antd.message.error(`${file.name} 不是图片文件`);
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
                    }
                },

                `确认创建`
            )
        );
    }
}
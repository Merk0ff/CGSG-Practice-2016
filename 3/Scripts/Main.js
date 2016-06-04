/**
 * Created by pd6 on 04.06.2016.
 */

var gl;
var SquareSize;
var DeltaRotX = 0;
var DeltaRotY = 0;
var DeltaRotZ = 0;

var squareVertexPositionBuffer;
var cubeVertexPositionBuffer;
var cubeVertexTextureCoordBuffer;
var cubeVertexIndexBuffer;

var Texture;

var shaderProgramMandl;
var shaderProgramMandlCube;

var rttFramebuffer;
var rttTexture;

var mvMatrix = mat4.create();
var pMatrix = mat4.create();


function handleLoadedTexture(Texture) {
    gl.bindTexture(gl.TEXTURE_2D, Texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, Texture.image);
    gl.texParameteri(gl.Texture_2D, gl.Texture_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.Texture_2D, gl.Texture_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

function initTexture() {
    Texture = gl.createTexture();
    Texture.image = new Image();
    Texture.image.onload = function () {
        handleLoadedTexture(Texture)
    }

    Texture.image.src = "CGSG.gif";
}


function initTextureFramebuffer() {
    rttFramebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, rttFramebuffer);
    rttFramebuffer.width = 512;
    rttFramebuffer.height = 512;

    rttTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, rttTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.Texture_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.Texture_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, rttFramebuffer.width, rttFramebuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    var renderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, rttFramebuffer.width, rttFramebuffer.height);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, rttTexture, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}


function getShader(gl, type, file) {
    var xmlhttp = new XMLHttpRequest();
    var str = "";

    xmlhttp.open('GET', file, false);
    xmlhttp.send(null);
    str = xmlhttp.responseText;

    var shader;
    if (type == "frag") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (type == "vert") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function initShaders() {
    var fragmentShader = getShader(gl, "frag", "Shaders/shader.frag");
    var vertexShader = getShader(gl, "vert", "Shaders/shader.vert");

    shaderProgramMandl = gl.createProgram();
    gl.attachShader(shaderProgramMandl, vertexShader);
    gl.attachShader(shaderProgramMandl, fragmentShader);
    gl.linkProgram(shaderProgramMandl);

    if (!gl.getProgramParameter(shaderProgramMandl, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgramMandl);

    shaderProgramMandl.vertexPositionAttribute = gl.getAttribLocation(shaderProgramMandl, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgramMandl.vertexPositionAttribute);

    shaderProgramMandl.pMatrixUniform = gl.getUniformLocation(shaderProgramMandl, "uPMatrix");
    shaderProgramMandl.mvMatrixUniform = gl.getUniformLocation(shaderProgramMandl, "uMVMatrix");
    shaderProgramMandl.samplerUniform = gl.getUniformLocation(shaderProgramMandl, "uSampler");
    shaderProgramMandl.SquareSize = gl.getUniformLocation(shaderProgramMandl, "Size");
    shaderProgramMandl.MouseX = gl.getUniformLocation(shaderProgramMandl, "MouseX");
    shaderProgramMandl.MouseY = gl.getUniformLocation(shaderProgramMandl, "MouseY");

    // Second shader
    var fragmentShader2 = getShader(gl, "frag", "Shaders/cube.frag");
    var vertexShader2 = getShader(gl, "vert", "Shaders/cube.vert");

    shaderProgramMandlCube = gl.createProgram();
    gl.attachShader(shaderProgramMandlCube, vertexShader2);
    gl.attachShader(shaderProgramMandlCube, fragmentShader2);
    gl.linkProgram(shaderProgramMandlCube);

    if (!gl.getProgramParameter(shaderProgramMandlCube, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgramMandlCube);

    shaderProgramMandlCube.vertexPositionAttribute = gl.getAttribLocation(shaderProgramMandlCube, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgramMandlCube.vertexPositionAttribute);
    shaderProgramMandlCube.TextureCoordAttribute = gl.getAttribLocation(shaderProgramMandlCube, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgramMandlCube.TextureCoordAttribute);

    shaderProgramMandlCube.pMatrixUniform = gl.getUniformLocation(shaderProgramMandlCube, "uPMatrix");
    shaderProgramMandlCube.mvMatrixUniform = gl.getUniformLocation(shaderProgramMandlCube, "uMVMatrix");
    shaderProgramMandlCube.samplerUniform = gl.getUniformLocation(shaderProgramMandlCube, "uSampler");
}


function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgramMandl.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgramMandl.mvMatrixUniform, false, mvMatrix);
    gl.uniform1f(shaderProgramMandl.SquareSize, SquareSize);
    gl.uniform1f(shaderProgramMandl.MouseX, MousX);
    gl.uniform1f(shaderProgramMandl.MouseY, MousY);
}

function initBuffers() {
    cubeVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    var vertices = [
        // Front face
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, -1.0, -1.0,

        // Top face
        -1.0, 1.0, -1.0,
        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0, 1.0,
        -1.0, -1.0, 1.0,

        // Right face
        1.0, -1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, 1.0, 1.0,
        1.0, -1.0, 1.0,

        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0,
        -1.0, 1.0, 1.0,
        -1.0, 1.0, -1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    cubeVertexPositionBuffer.itemSize = 3;
    cubeVertexPositionBuffer.numItems = 24;

    cubeVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
    var TextureCoords = [
        // Front face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        // Back face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Top face
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,

        // Bottom face
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,

        // Right face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Left face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(TextureCoords), gl.STATIC_DRAW);
    cubeVertexTextureCoordBuffer.itemSize = 2;
    cubeVertexTextureCoordBuffer.numItems = 24;

    cubeVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    var cubeVertexIndices = [
        0, 1, 2, 0, 2, 3,    // Front face
        4, 5, 6, 4, 6, 7,    // Back face
        8, 9, 10, 8, 10, 11,  // Top face
        12, 13, 14, 12, 14, 15, // Bottom face
        16, 17, 18, 16, 18, 19, // Right face
        20, 21, 22, 20, 22, 23  // Left face
    ];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
    cubeVertexIndexBuffer.itemSize = 1;
    cubeVertexIndexBuffer.numItems = 36;

    squareVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    var vertices = [
        1.0, 1.0, 0.0,
        -1.0, 1.0, 0.0,
        1.0, -1.0, 0.0,
        -1.0, -1.0, 0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    squareVertexPositionBuffer.itemSize = 3;
    squareVertexPositionBuffer.numItems = 4;
}

function drawScene() {
    gl.useProgram(shaderProgramMandl);
    gl.bindFramebuffer(gl.FRAMEBUFFER, rttFramebuffer);
    gl.viewport(0, 0, rttFramebuffer.width, rttFramebuffer.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, 1.66, 0.1, 100.0, pMatrix);
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, [0.0, 0.0, -1.0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgramMandl.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);

    gl.bindTexture(gl.TEXTURE_2D, rttTexture);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);


    gl.useProgram(shaderProgramMandlCube);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, [0.0, 0.0, -5.0]);
    mat4.rotate(mvMatrix, degToRad(DeltaRotX), [1, 0, 0]);
    mat4.rotate(mvMatrix, degToRad(DeltaRotY), [0, 1, 0]);
    mat4.rotate(mvMatrix, degToRad(DeltaRotZ), [0, 0, 1]);
    DeltaRotX += 1;
    DeltaRotY += 0.5;
    DeltaRotZ += 0.3;

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgramMandlCube.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgramMandlCube.TextureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, rttTexture);
    gl.uniform1i(shaderProgramMandlCube.samplerUniform, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    gl.uniformMatrix4fv(shaderProgramMandlCube.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgramMandlCube.mvMatrixUniform, false, mvMatrix);
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function tick() {
    window.requestAnimationFrame(tick);
    drawScene();
}

function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

function webGLStart() {
    var canvas = document.getElementById("lesson01-canvas");
    initGL(canvas);
    initTextureFramebuffer();
    initShaders();
    initBuffers();
    initTexture();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    drawScene();
    tick();
}


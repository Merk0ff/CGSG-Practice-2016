attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float MouseX;
uniform float MouseY;
uniform float Zoom;

varying vec2 cord;
varying vec2 vTextureCoord;

void main(void) {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    cord = vec2(aVertexPosition.x, aVertexPosition.y);
    cord -= vec2(-0.2 + MouseX / 1000.0, -MouseY / 1000.0);
    cord *= Zoom;
    vTextureCoord = aTextureCoord;
}

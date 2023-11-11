attribute vec2 aVertexPosition;
uniform mat3 uProjectionMat;
uniform mat3 uModelMat;
attribute vec2 aVertexTextureCoord;
varying vec2 vTextureCoord;

void main() {
    vec3 pos = uProjectionMat * uModelMat * vec3(aVertexPosition, 1);
    gl_Position = vec4(pos.xy / pos.z, 0, 1);
    vTextureCoord = aVertexTextureCoord;
}
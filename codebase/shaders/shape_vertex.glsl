attribute vec2 aPosition;

uniform mat4 uMatrix;

void main( ) {
  gl_Position = uMatrix * vec4(aPosition, 0, 1);
}

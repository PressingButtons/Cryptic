attribute vec2 aPosition;
attribute vec2 aTextCoord;

uniform vec2 uTextSize;
uniform mat4 uMatrix;
uniform vec4 uColor;

varying vec2 vTextCoord;
varying vec4 vColor;

void main( ) {
  gl_Position = uMatrix * vec4(aPosition, 0, 1);
  vTextCoord =  vec2(aTextCoord/uTextSize); //much like position, get relative percentages for coordinates
  vColor = uColor;
  //vColor = vec4(1,1,1,1);
}

attribute vec2 aPosition;
attribute vec2 aTextCoord;
attribute vec4 aColor;

uniform vec2 uResolution;
uniform vec2 uTextSize;

varying vec2 vTextCoord;
varying vec4 vColor;

void main( ) {
  vec2 dbl = (aPosition/uResolution) * 2.0; //double the size
  vec2 clipSpace = dbl - 1.0; //now position is in clipspace context (0 maps -1 to resolution width maps 1)
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  vTextCoord = vec2(aTextCoord/uTextSize); //much like position, get relative percentages for coordinates
  vColor = aColor;
  vColor = vec4(1,1,1,1);
}

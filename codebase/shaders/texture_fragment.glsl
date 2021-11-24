precision mediump float;

varying vec2 vTextCoord;
varying vec4 vColor;

uniform sampler2D uTexture;

void main(void) {
  gl_FragColor = texture2D(uTexture, vTextCoord) * vColor;
  //gl_FragColor = vColor;
}

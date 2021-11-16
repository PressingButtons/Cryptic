let resW = 16, resH = 9;

export const fitToScreen = ( ) => {
  let canvas = $('canvas')[0];
  let w, h;
  if(window.innerWidth/window.innerHeight > resW/resH) {
    w = resW * window.innerHeight / resH;
    h = window.innerHeight;
  } else {
    w = window.innerWidth;
    h = resH * window.innerWidth / resW;
  }
  canvas.width = w;
  canvas.height = h;
}

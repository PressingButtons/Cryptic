const mat4 = glMatrix.mat4;

const resetMatrix = matrix => {
  matrix.set([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ])
}

const Camera = function(canvas) {
  let pMatrix = mat4.create( ); //perspective
  let oMatrix = mat4.create( ); //orthogonal -(projection);
  let outMatrix = mat4.create( );
  let properties = {
    fov: (45 * Math.PI) / 180,
    zNear: 1, zFar: -1, viewbox: [0, 0, 800, 450]
  }
  //methods
  const setProjection = (sx, sy, ex, ey, near, far) => {
    resetMatrix(oMatrix);
    mat4.ortho(oMatrix, sx, ex, ey, sy, near, far);
    return oMatrix;
  }

  const setPerspective = (fov, aspect, zNear, zFar) => {
    resetMatrix(pMatrix);
    mat4.perspective(pMatrix, fov, aspect, zNear, zFar)
    return pMatrix
  }

  const getProjection = ( ) => {
    return setProjection(0, 0, canvas.width, canvas.height, properties.zNear, properties.zFar);
    //return setPerspective(properties.fov, (canvas.width/canvas.height), properties.zNear, properties.zFar);
  }

  //exports
  return {
    getProjection: getProjection,
    setPerspective: setPerspective,
    move: function(_x, _y) {
      x = _x | 0;
      y = _y | 0;
    }
  }
}

export default Camera;

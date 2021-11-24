const RESOLUTION_WIDTH = 16,
      RESOLUTION_HEIGHT = 9;

const m4 = glMatrix.mat4;

const Camera = function( ) {
  let width = 800, height = 450;
  let oMatrix;
  let pMatrix;
  let zNear = 1, zFar = -1, fov = 45, aspect = 800/450;

  const getProjection = () => {
    return m4.ortho(m4.create(), 0, width, height, 0, zNear, zFar);
  }

  const setDimensions = (_width, _height) => {
    width = _width;
    height = _height;
  }

  const setPerspective = (fov, zNear, zFar, width, height) => {
    fov = fov;
    zNear = zNear;
    zFar = zFar;
    aspect = width/height;
  }

  const getPerspective = ( ) => {
    return m4.perspective(m4.create(), fov, aspect, zNear, zFar);
  }

  const getView = (  ) => {
    return m4.mul(m4.create(), getPerspective(), getProjection())
  }

  return {
    getProjection: getProjection,
    getPerspective: getPerspective,
    setDimensions: setDimensions,
    getView: getView,
  }

}

export default Camera;

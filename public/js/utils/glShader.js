import {fetchTexts} from './common.js';

const glShader = {
  shaders: {},
  gl: null
}

const compile = (name, vertexUrl, fragmentUrl) => {
  return getShaderTexts(vertexUrl, fragmentUrl)
  .then(createShaders)
  .then(linkShaders)
  .then(program => setProgram(name, program))
}

const getShaderTexts = (vertex, fragment) => {
  return fetchTexts([vertex, fragment])
}

const createShaders = texts => {
  let vertex = createShader(texts.vertex, glShader.gl.VERTEX_SHADER);
  let fragment = createShader(texts.fragment, glShader.gl.FRAGMENT_SHADER);
  return {vertex: vertex, fragment: fragment}
}

const createShader = (source, type) => {
  let gl = glShader.gl;
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw  `Error, could not compile shader[${type}].\n\n${gl.getShaderInfoLog(shader)}`;
  }
  return shader;
}

const linkShaders = shaders => {
  let gl = glShader.gl;
  const program = gl.createProgram( );
  gl.attachShader(program, shaders.vertex);
  gl.attachShader(program, shaders.fragment);
  gl.linkProgram(program);
  if(gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
  const err = gl.getProgramInfoLog(program);
  gl.deleteProgram(program);
  throw err;
}

const setProgram = (name, program) => {
  let gl = glShader.gl;
  switch(name) {
    case "standard":
      glShader.shaders[name] = {
        program: program,
        attributes: {
          position: gl.getAttribLocation(program, 'aPosition'),
          textureCoord: gl.getAttribLocation(program, 'aTextCoord'),
        },
        uniforms: {
          matrix: gl.getUniformLocation(program, 'uMatrix'),
          textureSize: gl.getUniformLocation(program, 'uTextSize'),
          texture: gl.getUniformLocation(program, 'uTexture'),
          color: gl.getUniformLocation(program, 'uColor')
        }
      }
    break;
  }
}

const enableAlpha = gl => {
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
}

export default function glCreate(canvas) {
  glShader.gl = canvas.getContext('webgl', {premultipliedAlpha: false});
  enableAlpha(glShader.gl);
  return Promise.all([
    compile('standard', '/public/data/shaders/vertex.glsl', '/public/data/shaders/fragment.glsl')
  ]).then(( ) => {return glShader})
}

import {fetchTexts} from './common.js';

const createShaders = (gl, vertex, fragment) => {
  return  new Promise(function(resolve, reject) {
    try {
      resolve(
        [createShader(gl, vertex, gl.VERTEX_SHADER),createShader(gl, fragment, gl.FRAGMENT_SHADER)]
      )
    } catch( err ) {
      reject(err);
    }
  });
}
const createShader = (gl, source, type) => {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw  `Error, could not compile shader[${type}].\n\n${gl.getShaderInfoLog(shader)}`;
  }
  return shader;
}

const linkPrograms = (gl, programs) => {
  const program = gl.createProgram( );
  gl.attachShader(program, programs[0]);
  gl.attachShader(program, programs[1]);
  gl.linkProgram(program);
  if(gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
  const err = gl.getProgramInfoLog(program);
  gl.deleteProgram(program);
  throw err;
}

const packageProgram = (gl, program) => {
  let shader = {program:program, attr: {}, unif: {}};
  //
  const attributes = ['a_position', 'a_texture_coord', 'a_color'];
  for(let attr of attributes) {shader.attr[attr] = gl.getAttribLocation(program, attr)};
  //
  const uniforms = ['u_resolution', 'u_texture_size', 'u_texture'];
  for(let unif of uniforms) {
    shader.unif[unif] = gl.getUniformLocation(program, unif);
  }
  return shader;
}

export default function compileShader(gl) {
  return fetchTexts(['/public/data/vertex.glsl','/public/data/fragment.glsl']).then( texts => {
    return createShaders(gl, texts.vertex, texts.fragment);
  }).then(programs => linkPrograms(gl, programs))
    .then(program => packageProgram(gl, program));
}

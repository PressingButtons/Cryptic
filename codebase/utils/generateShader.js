import * as Error from '../utils/error.js'
import {loadJSON, loadText} from './load.js';

export default function generateShader (gl, ...requests) {
  return loadJSON('./data/shaders.json').then(defs => {
    //methods
    const createShaderProgram = req => {
      return Promise.all([loadText(defs[req].vertex), loadText(defs[req].fragment)])
      .then(createShaders)
      .then(createProgram)
      .then(program => packageProgram(program, defs[req]));
    }

    const createShader = (source, type) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw  `Error, could not compile shader[${type}].\n\n${gl.getShaderInfoLog(shader)}`;
      }
      return shader;
    }

    const createShaders = sources => {
      let vertex = createShader(sources[0], gl.VERTEX_SHADER);
      let fragment = createShader(sources[1], gl.FRAGMENT_SHADER);
      return {vertex: vertex, fragment: fragment};
    }

    const createProgram = shaders => {
      const program = gl.createProgram( );
      gl.attachShader(program, shaders.vertex);
      gl.attachShader(program, shaders.fragment);
      gl.linkProgram(program);
      if(gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
      const err = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw err;
    }

    const packageProgram = (program, programDefs) => {
      let pkg = {program: program, attributes: {}, uniforms: {}};
      for(const attr in programDefs.attributes) {
        pkg.attributes[attr] = gl.getAttribLocation(program, programDefs.attributes[attr]);
      }
      for(const unif in programDefs.uniforms) {
        pkg.uniforms[unif] = gl.getUniformLocation(program, programDefs.uniforms[unif]);
      }
      return pkg;
    }

    const packagePrograms = programs => {
      let pkg = {};
      for(const request of requests) {
        pkg[request] = programs[requests.indexOf(request)];
      }
      return pkg;
    }

    const parseRequests = reqs => {
      reqs = new Set([].concat.apply([], reqs));
      for(const req of reqs) {
        if(!defs.hasOwnProperty(req)) reqs.splice(reqs.indexOf(req), 1);
      }
      return [...reqs];
    }
    //exec
    requests = parseRequests(requests)
    if(requests.length == 0) throw 'No valid request(s) to generate shader.';
    let promises = requests.map(x => createShaderProgram(x));
    return Promise.all(promises).then(packagePrograms).catch(Error.generate)
  })
}

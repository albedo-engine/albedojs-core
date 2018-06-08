import { WebGLUniformsInfo } from 'webgl/webgl-uniforms-info';
import { WebGLAttributesInfo } from 'webgl/webgl-attributes-info';

export class WebGLProgramInfo {

  constructor(program) {
    this._webglProgam = program;
    this._uniformsInfo = new WebGLUniformsInfo();
    this._attributesInfo = new WebGLAttributesInfo();
    this._vao = null;
  }

  init(gl) {
    this._uniformsInfo.init(this._webglProgam, gl);
    this._attributesInfo.init(this._webglProgam, gl);
  }

  setupVAO(gl, attributes) {

  }

  get attributesInfo() {
    return this._attributesInfo.list;
  }

}

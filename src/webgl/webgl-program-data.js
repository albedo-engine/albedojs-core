import { WebGLUniformsData } from 'webgl-uniforms-data';

export class WebGLProgramData {

  constructor() {
    this.webglObject = null;
    this.failed = false;

    this.uniformsData = new WebGLUniformsData();
  }

  init(gl) {
    this.uniformsData.init(this.webglObject, gl);
  }

  sendUniforms(uniforms, gl) {
    this.uniformsData.update(uniforms, gl);
  }

  use(gl) {
    gl.useProgram(this.webglObject);
  }

  bindVAO(vaoWebglObject, gl) {
    gl.bindVertexArray(vaoWebglObject);
  }

}

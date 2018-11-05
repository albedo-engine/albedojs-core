import { WebGLUniformsData } from 'webgl-uniforms-data';

export class WebGLProgramData {

  constructor() {
    this.glObject = null;
    this.failed = false;

    this.uniformsData = new WebGLUniformsData();
  }

  init(gl) {
    this.uniformsData.init(this.glObject, gl);
  }

  sendUniforms(uniforms, gl) {
    this.uniformsData.update(uniforms, gl);
  }

  use(gl) {
    gl.useProgram(this.glObject);
  }

  bindVAO(vaoWebglObject, gl) {
    gl.bindVertexArray(vaoWebglObject);
  }

}

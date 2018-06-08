export class Shader {

  constructor(sourceStr) {
    this.source = sourceStr;
    this._shader = null;
  }

  compile(gl, type) {
    if (this.ready()) return this._shader;

    if (!this.source) {
      console.warn(`Shader.compile(): ${WARN_MSG.NO_SRC}.`);
      return null;
    }

    const shader = gl.createShader(type);
    gl.shaderSource(shader, this.source);
    gl.compileShader(shader);

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
      gl.deleteShader(shader);
      console.warn(`${gl.getShaderInfoLog(shader)}`);
    }

    this._shader = shader;
    return shader;
  }

  release(gl) {
    gl.deleteShader(this._shader);
    this._shader = null;
  }

  ready() {
    return !!this._shader;
  }

}

const WARN_MSG = {
  NO_SRC: `provided source is null or empty`
};

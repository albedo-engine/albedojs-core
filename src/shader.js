export class Shader {

  constructor(gl, source, type) {
    this.webglObject = null;

    this.source = source;
    this.type = type;

    this._gl = gl;

    this._error = null;
    this._compiled = false;
  }

  compile() {
    const shader = this._gl.createShader(this._type);
    this._gl.shaderSource(shader, this._source);
    this._gl.compileShader(shader);

    const success = this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS);
    if (!success) {
      this._error = this._gl.getShaderInfoLog(shader);
      this._gl.deleteShader(shader);
      return;
    }

    this._compiled = true;
    this.webglObject = shader;
  }

}

export class Program {

  constructor(gl, vertexShader, fragmentShader, uniforms) {
    this.webglObject = null;

    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
    this.uniforms = uniforms;

    this._linked = false;
    this._gl = gl;
  }

  link() {
    const program = this._gl.createProgram();
    this._gl.attachShader(program, this.vertexShader.webglObject);
    this._gl.attachShader(program, this.fragmentShader.webglObject);
    this._gl.linkProgram(program);

    const success = this._gl.getProgramParameter(program, this._gl.LINK_STATUS);
    if (!success) {
      program = this._gl.getProgramInfoLog(program);
      this._gl.deleteProgram(program);
      return;
    }
    this._linked = true;
    this.webglObject = program;
  }

}

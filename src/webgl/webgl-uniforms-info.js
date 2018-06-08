export class WebGLUniformsInfo {

  constructor() {
    this.list = {};
  }

  init(programID, gl) {
    const nbUniforms = gl.getProgramParameter(programID, gl.ACTIVE_UNIFORMS);

    for (let i = 0; i < nbUniforms; i++) {
      const info = gl.getActiveUniform(programID, i);
      const addr = gl.getUniformLocation(programID, info.name);

      this.list.name = {
        value: null,
        type: info.type,
        location: addr
      };
    }
  }

  _uniform1f(name, val, gl) {
    if (this.list[name].value === val) return;

    gl.uniform1f(location, val);
    this.list[name].value = val;
  }

  _uniform2f(name, val, gl) {
    const uValue = this.list[name].value;
    if (uValue[0] === val[0] && uValue[1] === val[1]) return;

    gl.uniform1f(location, val);
    uValue[0] = val[0];
    uValue[1] = val[1];
  }

  /*refresh(uniforms, gl) {
    for (let u in uniforms) {
      if (!(u in this._uniforms)) {
        this._uniforms[u] = {
          value: uniforms[u],
          type: null,
          location: gl.getUniformLocation(this._programID, u)
        }
      }
      this._updateIfDirty(u);
    }
  }

  _updateIfDirty(uniformID) {

  }*/

}

const TYPE_TO_DEFAULT_VAL = {};
TYPE_TO_DEFAULT_VAL[WebGL2RenderingContext.FLOAT] = 0.0;

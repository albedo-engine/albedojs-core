export class WebGLAttributesInfo {

  constructor() {
    this.list = {};
  }

  init(programID, gl) {
    const nbAttributes = gl.getProgramParameter(programID, gl.ACTIVE_ATTRIBUTES);

    for (let i = 0; i < nbAttributes; i++) {
      const info = gl.getActiveAttrib(programID, i);
      const addr = gl.getAttribLocation(programID, info.name);

      this.list[info.name] = {
        value: null,
        type: info.type,
        location: addr
      };
    }
  }

}

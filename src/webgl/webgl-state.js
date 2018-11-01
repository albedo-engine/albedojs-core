export class WebGLState {

  constructor() {
    this.boundFB_ = null;
    this.activeTextures_ = null;
  }

  bindFramebuffer(fb, gl) {
    gl.getParameter(gl.MAX_TEXTURE_SIZE)
  }

}

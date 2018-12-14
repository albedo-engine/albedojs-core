export class WebGLState {

  constructor(maxUnits) {
    this.program = null;
    this.framebuffer = null;
    this.textures = new Array(maxUnits);
    this.unit = null;
  }

}

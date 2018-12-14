export class WebGLParameters {

  static fetch(gl) {
    return Object.freeze({
      maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
      maxTextureUnits: gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS),
    });
  }

}

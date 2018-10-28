import { Cache } from 'utils/cache';

const detectTarget = (texture, gl) => {
  const ctor = texture.constructor;
  if (ctor.isTexture2D) return gl.TEXTURE_2D;
  else if (ctor.isTexture3D) return gl.TEXTURE_3D;
  else if (ctor.isCubemap) return gl.TEXTURE_CUBE_MAP;
  return null;
};

export class WebGLTextureManager {

  constructor(options) {
    this.unit_ = 0;
    this.textureCache_ = new Cache();
  }

  requestTextureUnit(gl) {
    return this.unit_++;
  }

  bind(texture, unit, gl) {
    if (!texture.data) return;

    const textureData = this.textureCache_.get(texture);
    // This texture has not been uploaded yet.
    if (!textureData.WebGLObject) this._upload(texture, gl);

    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(textureData.target, textureData.WebGLObject);
  }

  setTextureParams(target, texture, gl) {
    gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, texture.filtering.min);
    gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, texture.filtering.mag);
    gl.texParameteri(target, gl.TEXTURE_WRAP_S, texture.wrap.s);
    gl.texParameteri(target, gl.TEXTURE_WRAP_T, texture.wrap.t);
    if (target === gl.TEXTURE_3D || target === gl.TEXTURE_CUBE_MAP)
      gl.texParameteri(target, gl.TEXTURE_WRAP_R, texture.wrap.r);
  }

  _upload(texture, gl) {
    const textureData = this.textureCache_.get(texture);
    textureData.WebGLObject = gl.createTexture();
    textureData.target = detectTarget(texture, gl);

    const target = textureData.target;
    const type = texture.type;
    const format = texture.format;
    const internalFormat = texture.internalFormat;

    gl.bindTexture(target, textureData.WebGLObject);
    this.setTextureParams(target, texture, gl);

    switch (target) {
    case gl.TEXTURE_2D:
      if (texture.data.isHTMLImage)
        this.uploadImage(texture.data.buffer, target, type, internalFormat, format, gl);
      else
        this.uploadTexture();
      break;
    case gl.TEXTURE_3D:
      this.uploadTexture3D(texture.data, texture.width, texture.height, texture.depth, type, internalFormat, format, gl);
      break;
    case gl.TEXTURE_CUBE_MAP:
      this._uploadCubemap();
      break;
    }

  }

  _uploadCubemap() {

  }

  uploadTexture3D(data, width, height, depth, type, internalFormat, format, gl) {
    gl.texImage3D(gl.TEXTURE_3D, 0, internalFormat, width, height, depth, 0, format, type, data);
  }

  uploadTexture(data, width, height, type, internalFormat, format) {
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, format, type, data);
  }

  uploadImage(image, target, type, internalFormat, format, gl) {
    gl.texImage2D(target, 0, internalFormat, format, type, image);
  }

  reset() {
    this.unit_ = 0;
  }

  get unit() {
    return this._unit;
  }

}

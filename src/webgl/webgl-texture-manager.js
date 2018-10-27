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
    this.textures_ = new Cache();
  }

  requestTextureUnit(gl) {
    return this.unit_++;
  }

  bind(texture, unit, gl) {
    const textureData = this.textures_.get(texture);
    // This texture has not been uploaded yet.
    if (!textureData.WebGLObject) this._upload(texture, gl);

    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(textureData.target, textureData.WebGLObject);
  }

  setTextureParams(texture, WebGLType, gl) {
    gl.texParameteri(WebGLType, gl.TEXTURE_MIN_FILTER, texture.filtering.min);
    gl.texParameteri(WebGLType, gl.TEXTURE_MAG_FILTER, texture.filtering.mag);
    gl.texParameteri(WebGLType, gl.TEXTURE_WRAP_S, texture.wrap.s);
    gl.texParameteri(WebGLType, gl.TEXTURE_WRAP_T, texture.wrap.t);
    if (WebGLType === gl.TEXTURE_3D || WebGLType === gl.TEXTURE_CUBE_MAP)
      gl.texParameteri(WebGLType, gl.TEXTURE_WRAP_R, texture.wrap.r);
  }

  _upload(texture, gl) {
    const textureData = this.textures_.get(texture);
    textureData.WebGLObject = gl.createTexture();
    textureData.target = detectTarget(texture, gl);

    const type = texture.type;
    const format = texture.format;
    const internalFormat = texture.internalFormat;

    gl.bindTexture(textureData.target, textureData.WebGLObject);
    this.setTextureParams(texture, textureData.target, gl);

    switch (textureData.target) {
    case gl.TEXTURE_2D:
      if (texture.htmlImage_)
        this._uploadImage(texture.data, type, internalFormat, format, gl);
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

    //gl.texImage2D(gl.TEXTURE_2D, 0, texture.internalFormat, texture.format, texture.type, texture.data);

    // Cache
    //textureData.wrap = { s: texture.wrap.s, t: texture.wrap.t };
    //textureData.filtering = { mag: texture.filtering.mag, t: texture.filtering.min };
  }

  _uploadCubemap() {

  }

  uploadTexture3D(data, width, height, depth, type, internalFormat, format, gl) {
    gl.texImage3D(gl.TEXTURE_3D, 0, internalFormat, width, height, depth, 0, format, type, data);
  }

  uploadTexture(data, width, height, type, internalFormat, format) {
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, format, type, data);
  }

  _uploadImage(image, target, type, internalFormat, format, gl) {
    gl.texImage2D(target, 0, internalFormat, format, type, image);
  }

  reset() {
    this.unit_ = 0;
  }

  get unit() {
    return this._unit;
  }

}

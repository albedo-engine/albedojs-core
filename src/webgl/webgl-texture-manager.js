import * as CONSTANTS from '../constants';
const Targets = CONSTANTS.TARGETS;

import { Cache } from 'utils/cache';

const detectTarget = (texture, gl) => {
  const ctor = texture.constructor;
  if (ctor.isTexture2D) return gl.TEXTURE_2D;
  else if (ctor.isTexture3D) return gl.TEXTURE_3D;
  else if (ctor.isTextureCube) return gl.TEXTURE_CUBE_MAP;
  return null;
};

export class WebGLTextureManager {

  constructor(textureCache) {
    this.unit_ = 0;
    this.textureCache_ = textureCache;

    this.GetUploadFunc = {};
    this.GetUploadFunc[Targets.TEXTURE_2D] = this.uploadTexture2D.bind(this);
    this.GetUploadFunc[Targets.TEXTURE_3D] = this.uploadTexture3D.bind(this);
    this.GetUploadFunc[Targets.TEXTURE_CUBE_MAP] = this.uploadTextureCube.bind(this);

    this.GetUpdateFunc = {};
    this.GetUpdateFunc[Targets.TEXTURE_2D] = this.updateGPUTexture2D.bind(this);
    this.GetUpdateFunc[Targets.TEXTURE_3D] = this.updateGPUTexture3D.bind(this);
    this.GetUpdateFunc[Targets.TEXTURE_CUBE_MAP] = this.updateGPUTextureCube.bind(this);
  }

  requestTextureUnit() {
    return this.unit_++;
  }

  bind(texture, unit, gl) {
    if (!texture.data) return;

    const textureData = this.textureCache_.get(texture);

    if (!textureData.WebGLObject) {
      // This texture has not been created yet on the GPU.
      this.upload(texture, gl);
    } else if (texture.dirty) {
      // This texture is already on the GPU but dirty. Updates its content.
      this.updateGPUTexture(texture, gl);
      texture.dirty = false;
    } else {
      // Texture is all set. We only need to bind it.
      gl.bindTexture(textureData.target, textureData.WebGLObject);
    }

    gl.activeTexture(gl.TEXTURE0 + unit);
  }

  setTextureParams(target, texture, gl) {
    gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, texture.filtering.min);
    gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, texture.filtering.mag);
    gl.texParameteri(target, gl.TEXTURE_WRAP_S, texture.wrap.s);
    gl.texParameteri(target, gl.TEXTURE_WRAP_T, texture.wrap.t);
    if (target === gl.TEXTURE_3D || target === gl.TEXTURE_CUBE_MAP)
      gl.texParameteri(target, gl.TEXTURE_WRAP_R, texture.wrap.r);
  }

  getOrCreate(texture, gl) {
    const textureData = this.textureCache_.get(texture);
    if (!textureData.WebGLObject) {
      this.upload(texture, gl);      
    }
    return textureData.WebGLObject;
  }

  upload(texture, gl) {
    const textureData = this.textureCache_.get(texture);
    textureData.WebGLObject = gl.createTexture();
    textureData.target = detectTarget(texture, gl);

    const target = textureData.target;
    const type = texture.type;
    const format = texture.format;
    const internalFormat = texture.internalFormat;

    gl.bindTexture(target, textureData.WebGLObject);
    this.setTextureParams(target, texture, gl);

    const glUploadFunc = this.GetUploadFunc[target];
    glUploadFunc(texture.data, target, internalFormat, format, type, gl);

    texture.dirty = false;
  }

  uploadTexture2D(texData, target, internalFormat, format, type, gl) {
    if (texData.isHTMLImage) {
      gl.texImage2D(target, 0, internalFormat, format, type, texData.buffer);
    } else {
      gl.texImage2D(target, 0, internalFormat, texData.width, texData.height, 0, format, type, texData.buffer);
    }
  }

  uploadTexture3D(texData, target, internalFormat, format, type, gl) {
    const buffer = texData.buffer;
    gl.texImage3D(target, 0, internalFormat, texData.width, texData.height, texData.depth, 0, format, type, buffer);
  }

  uploadTextureCube(faces, _, internalFormat, format, type, gl) {
    for (let i = 0; i < 6; ++i) {
      const target = gl.TEXTURE_CUBE_MAP_POSITIVE_X + i;
      this.uploadTexture2D(faces[i], target, internalFormat, format, type, gl);
    }
  }

  updateGPUTexture(texture, gl) {
    const textureData = this.textureCache_.get(texture);
    const WebGLObject = textureData.WebGLObject;
    const target = textureData.target;

    gl.bindTexture(target, WebGLObject);
    this.setTextureParams(target, texture, gl);

    const glUpdateFunc = this.GetUpdateFunc[target];
    glUpdateFunc(texture.data, target, texture.format, texture.type, gl);

    texture.dirty = false;
  }

  updateGPUTexture2D(texData, target, format, type, gl) {
    const buffer = texData.buffer;
    const xOffset = texData.updateRegion.x;
    const yOffset = texData.updateRegion.y;
    const width = texData.updateRegion.width;
    const height = texData.updateRegion.height;
    if (texData.isHTMLImage) {
      gl.texSubImage2D(target, 0, xOffset, yOffset, width, height, format, type, buffer);
    } else {
      gl.texSubImage2D(target, 0, xOffset, yOffset, width, height, format, type, buffer);
    }
  }

  updateGPUTexture3D(texData, target, format, type, gl) {
    const buffer = texData.buffer;
    const xOffset = texData.updateRegion.x;
    const yOffset = texData.updateRegion.y;
    const zOffset = texData.updateRegion.z;
    const width = texData.updateRegion.width;
    const height = texData.updateRegion.height;
    const depth = texData.updateRegion.depth;
    gl.texSubImage3D(target, 0, xOffset, yOffset, zOffset, width, height, depth, format, type, buffer);
  }

  updateGPUTextureCube(faces, _, format, type, gl) {
    for (let i = 0; i < faces.length; ++i) {
      const target = gl.TEXTURE_CUBE_MAP_POSITIVE_X + i;
      this.updateGPUTexture2D(faces[i], target, format, type, gl);
    }
  }

  reset() {
    this.unit_ = 0;
  }

  get unit() {
    return this._unit;
  }

}

import * as CONSTANTS from '../constants';
const Targets = CONSTANTS.TARGETS;

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
  }

  requestTextureUnit() {
    return this.unit_++;
  }

  bind(texture, unit, gl) {
    if (!texture.data) return;

    const textureInfo = this.textureCache_.get(texture);
    const glObject = textureInfo.glObject;

    gl.activeTexture(gl.TEXTURE0 + unit);
    if (glObject && !texture.dirty) {
      // Texture is all set. We only need to bind it.
      gl.bindTexture(textureInfo.target, glObject);
    } else {
      // This texture has either not been created yet on the GPU, or
      // is already on the GPU but dirty. In this case: update its content.
      this.uploadOrUpdate(texture, gl);
    }
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

  uploadOrUpdate(texture, gl) {
    const textureInfo = this.textureCache_.get(texture);
    if (!textureInfo.glObject) {
      textureInfo.glObject = gl.createTexture();
      textureInfo.target = detectTarget(texture, gl);
    }
    
    const target = textureInfo.target;
    const type = texture.type;
    const format = texture.format;
    const iFormat = texture.internalFormat;
    
    gl.bindTexture(target, textureInfo.glObject);

    // TODO: cache texture parans, and only apply this call when cache does
    // not match the data anymore.
    this.setTextureParams(target, texture, gl);
  
    // Updates or uploads base (mipmap 0).
    // Updates or uploads mipmaps (mipmap > 0).
    switch (target) {
      case gl.TEXTURE_2D:
        TextureUploader.texture2D(gl, target, iFormat, format, type, 0, texture.data);
        MipmapsUploader.texture2D(gl, target, iFormat, format, type, texture);
      break;
      case gl.TEXTURE_3D:
        TextureUploader.texture3D(gl, target, iFormat, format, type, 0, texture.data);
        MipmapsUploader.texture3D(gl, target, iFormat, format, type, texture);
      break;
      case gl.TEXTURE_CUBE_MAP:
        TextureUploader.textureCube(gl, target, iFormat, format, type, 0, texture.data);
        MipmapsUploader.textureCube(gl, target, iFormat, format, type, texture);
      break;
    }

    texture.__dirty = false;
  }

  reset() {
    this.unit_ = 0;
  }

  get unit() {
    return this._unit;
  }

}

class TextureUploader {

  static texture2D(gl, target, internalFormat, format, type, mipLvl, texData) {
    // buffer, width, or height changed. We need to make an allocation using
    // `texImage2D'.
    if (texData.__dirtyData) {
      if (texData.isHTMLImage) {
        gl.texImage2D(target, mipLvl, internalFormat, format, type, texData.buffer);
      } else {
        gl.texImage2D(target, mipLvl, internalFormat, texData.width, texData.height, 0, format, type, texData.buffer);
      }
      texData.__dirtyData = false;
    }
    // buffer or update region have been updated within the bounds of the
    // initial width and height.
    else if (texData.dirty) {
      const xOffset = texData.updateRegion.x;
      const yOffset = texData.updateRegion.y;
      const width = texData.updateRegion.width;
      const height = texData.updateRegion.height;
      if (texData.isHTMLImage) {
        gl.texSubImage2D(target, mipLvl, xOffset, yOffset, width, height, format, type, texData.buffer);
      } else {
        gl.texSubImage2D(target, mipLvl, xOffset, yOffset, width, height, format, type, buffer);
      }
      texData.dirty = false;
    }
  }

  static texture3D(gl, target, iFormat, format, type, mipLvl, texData) {
    // buffer, width, height, or depth changed. We need to make an
    // allocation using `texImage3D'.
    if (texData.__dirtyData) {
      gl.texImage3D(target, mipLvl, iFormat, texData.width, texData.height, texData.depth, 0, format, type, texData.buffer);
      texData.__dirtyData = false;
    }
    // buffer or update region have been updated within the bounds of the
    // initial width, height, and depth.
    else if (texData.dirty) {
      const xOffset = texData.updateRegion.x;
      const yOffset = texData.updateRegion.y;
      const zOffset = texData.updateRegion.z;
      const width = texData.updateRegion.width;
      const height = texData.updateRegion.height;
      const depth = texData.updateRegion.depth;
      gl.texSubImage3D(target, mipLvl, xOffset, yOffset, zOffset, width, height, depth, format, type, texData.buffer);
    }
  }

  static textureCube(gl, _, iFormat, format, type, mipLvl, faces) {
    for (let i = 0; i < 6; ++i) {
      const target = gl.TEXTURE_CUBE_MAP_POSITIVE_X + i;
      TextureUploader.texture2D(gl, target, iFormat, format, type, mipLvl, faces[i]);
    }
  }

}

class MipmapsUploader {

  static glAutoMipmap(gl, texture, target) {
    if (texture.autoMipmaps) {
      gl.generateMipmap(target);
      return true;
    } 
    return false;
  }

  static texture2D(gl, target, iFormat, format, type, texture) {
    // Makes use of the gl native mipmap generation, if specified by user.
    if (this.glAutoMipmap(gl, texture, target)) return;
    if (!texture.mipmaps) return;
    for (let i = 0; i < texture.mipmaps.length; ++i) {
      const data = texture.mipmaps[i];
      TextureUploader.texture2D(gl, target, iFormat, format, type, i + 1, data);
    }
  }

  static texture3D(gl, target, iFormat, format, type, texture) {
    // Makes use of the gl native mipmap generation, if specified by user.
    if (this.glAutoMipmap(gl, texture, target)) return;
    if (!texture.mipmaps) return;
    for (let i = 0; i < texture.mipmaps.length; ++i) {
      const data = texture.mipmaps[i];
      TextureUploader.texture3D(gl, target, iFormat, format, type, i + 1, data);
    }
  }

  static textureCube(gl, texture) {
    // Makes use of the gl native mipmap generation, if specified by user.
    if (this.glAutoMipmap(gl, texture, target)) return;
    if (!texture.mipmaps) return;
    for (let i = 0; i < texture.mipmaps.length; ++i) {
      const faces = texture.mipmaps[i];
      TextureUploader.textureCube(gl, target, internalFormat, format, type, i + 1, faces);
    }
  }

}

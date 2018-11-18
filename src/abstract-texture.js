import * as CONSTANTS from './constants';

export class AbstractTexture {

  static get isTexture() { return true; }

  constructor(definition) {
    const def = Object.assign({}, DEFAULT_DEFINITION, definition);

    this.type = def.type;
    this.format = def.format;
    this.internalFormat = def.internalFormat;

    this.wrap = { s: def.wrapS, t: def.wrapT };
    this.filtering = { mag: def.magFiltering, min: def.minFiltering };

    this.autoMipmaps = def.autoMipmaps || true;

    this.__dirty = true;
  }

  update() {}

  updateMipmaps(mipmaps) {
    if (!Array.isArray(mipmaps) || !mipmaps.length) return null;

    const mips = new Array(mipmaps.length);
    for (let i = 0; i < mipmaps.length; ++i) {
      const mipData = mipmaps[i];
      mips[i] = new TextureData(this, null, 0, 0, 0);
      if (mipData) {
        mips[i].buffer = mipData.buffer;
        mips[i].width = mipData.width;
        mips[i].height = mipData.height;
        mips[i].depth = mipData.depth;
      }
    }
    return mips;
  }

  // TODO!
  clone() {
    throw new Error(`Not implemented yet.`);
  }

}

const DEFAULT_DEFINITION = {
  type: CONSTANTS.TYPES.UNSIGNED_BYTE,
  format: CONSTANTS.FORMAT.RGB,
  internalFormat: CONSTANTS.INTERNAL_FORMAT.RGB,
  autoMipmaps: false,
  wrapS: CONSTANTS.WRAPPING.CLAMP_TO_EDGE,
  wrapT: CONSTANTS.WRAPPING.CLAMP_TO_EDGE,
  magFiltering: CONSTANTS.FILTERING.LINEAR,
  minFiltering: CONSTANTS.FILTERING.LINEAR
};

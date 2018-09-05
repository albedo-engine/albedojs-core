import * as CONSTANTS from './constants';

export class AbstractTexture {

  static get isTexture() {
    return true;
  }

  constructor(options) {
    this.type = options.type || CONSTANTS.TYPES.UNSIGNED_BYTE;
    this.format = options.format || CONSTANTS.FORMAT.RGB;
    this.internalFormat = options.internalFormat || CONSTANTS.INTERNAL_FORMAT.RGB;

    this.wrap = {
      s: options.wrapS || CONSTANTS.WRAPPING.CLAMP_TO_EDGE,
      t: options.wrapT || CONSTANTS.WRAPPING.CLAMP_TO_EDGE
    };
    this.filtering = {
      mag: options.magFiltering || CONSTANTS.FILTERING.LINEAR,
      min: options.minFiltering || CONSTANTS.FILTERING.LINEAR
    };

    this.useMipmaps = false;
    this.dirty = true;
  }

}

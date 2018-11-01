import * as CONSTANTS from './constants';

export class AbstractTexture {

  static get isTexture() {
    return true;
  }

  constructor(definition) {
    const def = Object.assign(DEFAULT_DEFINITION, definition);

    this.type = def.type;
    this.format = def.format;
    this.internalFormat = def.internalFormat;

    this.wrap = { s: def.wrapS, t: def.wrapT };
    this.filtering = { mag: def.magFiltering, min: def.minFiltering };

    this.useMipmaps = false;
    this.dirty = true;
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
  wrapS: CONSTANTS.WRAPPING.CLAMP_TO_EDGE,
  wrapT: CONSTANTS.WRAPPING.CLAMP_TO_EDGE,
  magFiltering: CONSTANTS.FILTERING.LINEAR,
  minFiltering: CONSTANTS.FILTERING.LINEAR
};

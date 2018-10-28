import * as CONSTANTS from './constants';
import { AbstractTexture } from './abstract-texture';

export class TextureCube extends AbstractTexture {

  static get isTextureCube() {
    return true;
  }

  constructor(definition) {
    // TODO: support instanciation via data only.
    const def = Object.assign(DEFAULT_DEFINITION, definition);
    super(def);

    this.faces = def.faces;
    this.wrapR = def.wrapR;
  }

  // TODO!
  clone() {
    throw new Error(`Not implemented yet.`);
  }

}

const DEFAULT_DEFINITION = {
  faces: null,
  wrapR: CONSTANTS.WRAPPING.CLAMP_TO_EDGE
};

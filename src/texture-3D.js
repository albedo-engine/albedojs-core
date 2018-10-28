import * as CONSTANTS from './constants';
import { AbstractTexture } from './abstract-texture';
import { TextureData } from './texture-data';


export class Texture3D extends AbstractTexture {

  static get isTexture3D() {
    return true;
  }

  constructor(definition) {
    // TODO: support instanciation via data only.
    const def = Object.assign(DEFAULT_DEFINITION, definition);
    super(def);

    this.wrapR = def.wrapR;

    this.data = null;

    if (def.buffer || def.width || def.height || def.depth)
      this.data = new TextureData(def);
    else if (definition instanceof TextureData)
      this.data = definition;
  }

  // TODO!
  clone() {
    throw new Error(`Not implemented yet.`);
  }

}

const DEFAULT_DEFINITION = {
  wrapR: CONSTANTS.WRAPPING.CLAMP_TO_EDGE
};

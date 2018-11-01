import * as CONSTANTS from './constants';
import { AbstractTexture } from './abstract-texture';
import { TextureData } from './texture-data';

const JSPrivateAttributes = new WeakMap();
const self = (key) => { return JSPrivateAttributes.get(key); };

export class Texture3D extends AbstractTexture {

  static get isTexture3D() {
    return true;
  }

  constructor(definition) {
    const def = Object.assign(DEFAULT_DEFINITION, definition);
    super(def);

    this.wrap.r = def.wrapR;

    JSPrivateAttributes.set(this, {
      data: null
    });

    this.init(def.buffer, def.width, def.height, def.depth);
  }

  init(buffer, width, height, depth) {
    self(this).data = new TextureData(buffer, width, height, depth);
    this.dirty = true;
  }

  // TODO!
  clone() {
    throw new Error(`Not implemented yet.`);
  }

}

const DEFAULT_DEFINITION = {
  wrapR: CONSTANTS.WRAPPING.CLAMP_TO_EDGE
};

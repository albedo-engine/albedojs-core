import * as CONSTANTS from './constants';
import { AbstractTexture } from './abstract-texture';

const JSPrivateAttributes = new WeakMap();
const self = (key) => { return JSPrivateAttributes.get(key); };

export class Texture3D extends AbstractTexture {

  static get isTexture3D() {
    return true;
  }

  constructor(definition) {
    // TODO: support instanciation via data only.
    const def = Object.assign(DEFAULT_DEFINITION, definition);
    super(def);

    this.width = def.width;
    this.height = def.height;
    this.depth = def.depth;
    this.wrap.r = def.wrapR;

    JSPrivateAttributes.set(this, {
      data: def.data
    });
  }

  // TODO!
  clone() {
    throw new Error(`Not implemented yet.`);
  }

  get data() {
    return self(this).data;
  }

}

const DEFAULT_DEFINITION = {
  width: null,
  height: null,
  depth: null,
  data: null,
  wrapR: CONSTANTS.WRAPPING.CLAMP_TO_EDGE
};

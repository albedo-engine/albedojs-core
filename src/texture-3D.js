import * as CONSTANTS from './constants';
import { AbstractTexture } from './abstract-texture';
import { TextureData } from './texture-data';

const JSPrivateAttributes = new WeakMap();
const self = (key) => { return JSPrivateAttributes.get(key); };

const DEFAULT_DEFINITION = { wrapR: CONSTANTS.WRAPPING.CLAMP_TO_EDGE };

export class Texture3D extends AbstractTexture {

  static get isTexture3D() { return true; }

  constructor(definition) {
    const def = Object.assign({}, DEFAULT_DEFINITION, definition);
    super(def);

    this.wrap.r = def.wrapR;

    JSPrivateAttributes.set(this, {
      data: new TextureData(this, null, 0, 0, 0)
    });

    this.update(def.buffer, def.width, def.height, def.depth);
    this.updateMipmaps(def.mipmaps);
  }

  update(buffer, width, height, depth) {
    this.data.buffer = buffer
    this.data.width = width;
    this.data.height = height;
    this.data.depth = depth;
  }

  updateMipmaps(mipmaps) {
    self(this).mipmaps = super.updateMipmaps(mipmaps);
  }

  // TODO!
  clone() {
    throw new Error(`Not implemented yet.`);
  }

  get data() {
    return self(this).data;
  }

  get mipmaps() {
    return self(this).mipmaps;
  }

}

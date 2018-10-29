import { AbstractTexture } from './abstract-texture';
import { TextureData } from './texture-data';

const JSPrivateAttributes = new WeakMap();
const self = (key) => { return JSPrivateAttributes.get(key); };

export class Texture2D extends AbstractTexture {

  static get isTexture2D() {
    return true;
  }

  constructor(definition) {
    const def = definition || {};
    super(def);

    JSPrivateAttributes.set(this, {
      data: null
    });

    this.init(def.buffer, def.width, def.height);
  }

  init(buffer, width, height) {
    self(this).data = new TextureData(buffer, width, height);
    this.dirty = true;
  }

  // TODO!
  clone() {
    throw new Error(`Not implemented yet.`);
  }

  get data() {
    return self(this).data;
  }

}

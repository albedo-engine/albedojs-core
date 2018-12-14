import { AbstractTexture } from './abstract-texture';
import { TextureData } from './texture-data';

const JSPrivateAttributes = new WeakMap();
const self = (key) => { return JSPrivateAttributes.get(key); };

const DEFAULT_DEFINITION = {
  buffer: null,
  mipmaps: null,
  width: 0,
  height: 0
};

export class Texture2D extends AbstractTexture {

  static get isTexture2D() {
    return true;
  }

  constructor(definition) {
    const def = Object.assign({}, DEFAULT_DEFINITION, definition);
    super(def);

    JSPrivateAttributes.set(this, {
      data: new TextureData(this, null, 0, 0),
      mipmaps: null
    });

    this.update(def.buffer, def.width, def.height);
    this.updateMipmaps(def.mipmaps);
  }

  update(buffer, width, height) {
    this.data.buffer = buffer;
    this.data.width = width;
    this.data.height = height;
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

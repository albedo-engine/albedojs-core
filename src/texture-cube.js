import * as CONSTANTS from './constants';
import { AbstractTexture } from './abstract-texture';
import { TextureData } from './texture-data';

const JSPrivateAttributes = new WeakMap();
const self = key => { return JSPrivateAttributes.get(key); };

const DEFAULT_DEFINITION = {
  faces: null,
  wrapR: CONSTANTS.WRAPPING.CLAMP_TO_EDGE
};

export class TextureCube extends AbstractTexture {

  static get isTextureCube() { return true; }

  constructor(definition) {
    const def = Object.assign({}, DEFAULT_DEFINITION, definition);
    super(def);

    this.wrap.r = def.wrapR;

    JSPrivateAttributes.set(this, { data: new Array(6) });

    const data = self(this).data;
    for (let i = 0; i < 6; ++i) {
      data[i] = new TextureData(this, null, 0, 0);
    }

    this.update(def.faces, def.width, def.height);
    this.updateMipmaps(def.mipmaps);
  }

  update(faces, width, height) {
    const data = self(this).data;
    for (let i = 0; i < 6; ++i) {
      data[i].buffer = faces[i];
      data[i].width = width;
      data[i].height = height;
    }
  }

  updateMipmaps(faces) {
    if (!Array.isArray(faces) || !faces.length) return;

    const mipmaps = new Array(6);
    for (let i = 0; i < 6; ++i) {
      const mips = faces[i];
      mipmaps[i] = super.updateMipmaps(mips);
    }

    self(this).mipmaps = mipmaps;
  }

  // TODO!
  clone() {
    throw new Error(`Not implemented yet.`);
  }

  // TODO: is data a good name? `faces` makes more sense maybe.
  get data() {
    return self(this).data;
  }
}

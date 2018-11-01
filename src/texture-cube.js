import * as CONSTANTS from './constants';
import { AbstractTexture } from './abstract-texture';
import { TextureData } from './texture-data';

const JSPrivateAttributes = new WeakMap();
const self = (key) => {
  return JSPrivateAttributes.get(key);
};

export class TextureCube extends AbstractTexture {

  static get isTextureCube() {
    return true;
  }

  constructor(definition) {
    // TODO: support instanciation via data only.
    const def = Object.assign(DEFAULT_DEFINITION, definition);
    super(def);

    this.wrap.r = def.wrapR;

    JSPrivateAttributes.set(this, {
      data: new Array(6)
    });

    this.init(def.faces, def.width, def.height);
  }

  init(faces, width, height) {
    // TODO: should we check for errors?
    const data = self(this).data;
    for (let i = 0; i < faces.length; ++i) {
      data[i] = new TextureData(faces[i], width, height);
    }
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

const DEFAULT_DEFINITION = {
  faces: null,
  wrapR: CONSTANTS.WRAPPING.CLAMP_TO_EDGE
};

import { AbstractTexture } from './abstract-texture';
import { TextureData } from './texture-data';

export class Texture2D extends AbstractTexture {

  static get isTexture2D() {
    return true;
  }

  constructor(definition) {
    const def = definition || {};
    super(def);

    this.data = null;

    if (def.buffer || def.width || def.height)
      this.data = new TextureData(def);
    else if (definition instanceof TextureData)
      this.data = definition;
  }

  // TODO!
  clone() {
    throw new Error(`Not implemented yet.`);
  }

}

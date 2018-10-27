import { AbstractTexture } from './abstract-texture';

const JSPrivateAttributes = new WeakMap();
const self = (key) => {
  return JSPrivateAttributes.get(key);
};

export class Texture2D extends AbstractTexture {

  static get isTexture2D() {
    return true;
  }

  constructor(definition) {
    // TODO: support instanciation via data only.
    const def = Object.assign({
      width: null,
      height: null,
      data: null
    }, definition);

    super(def);

    this.width = def.width;
    this.height = def.height;
    
    JSPrivateAttributes.set(this, {
      data: null
    });

    this.htmlImage_ = false;

    this.update(def.data);
  }

  update(data) {
    if (data instanceof Image) {
      this.width = data.width;
      this.height = data.height;
      this.htmlImage_ = true;
    }
    self(this).data = data || null;
  }

  // TODO!
  clone() {
    throw new Error(`Not implemented yet.`);
  }

  get data() {
    return self(this).data;
  }

}

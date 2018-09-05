import { AbstractTexture } from './abstract-texture';
import { hydrate } from 'utils/object';

const JSPrivateAttributes = new WeakMap();
const self = (key) => {
  return JSPrivateAttributes.get(key);
};

export class Texture2D extends AbstractTexture {

  static get isTexture2D() {
    return true;
  }

  constructor(options) {
    const opts = {};
    hydrate(opts, options);
    super(opts);

    this.width = opts.width || null;
    this.height = opts.height || null;

    JSPrivateAttributes.set(this, {
      data: null
    });
    
    this.htmlImage_ = false;
    this.data = opts.data;
  }

  get data() {
    return self(this).data;
  }

  set data(data) {
    if (data instanceof Image) {
      this.width = data.width;
      this.height = data.height;
      this.htmlImage_ = true;
    }
    self(this).data = data || null;
  }


}

const JSPrivateAttributes = new WeakMap();
const self = (key) => { return JSPrivateAttributes.get(key); };

export class TextureData {

  constructor(definition) {
    const def = Object.assign(DEFAULT_DEFINITION, definition);

    JSPrivateAttributes.set(this, {
      buffer: def.buffer,
      width: def.width,
      height: def.height,
      depth: def.depth,
    });

    self(this).isHTMLImage = false;

    const buffer = self(this).buffer;
    if (buffer instanceof Image) {
      self(this).width = buffer.width;
      self(this).height = buffer.height;
      self(this).isHTMLImage = true;
    }
  }

  get buffer() {
    return self(this).buffer;
  }

  get width() {
    return self(this).width;
  }

  get height() {
    return self(this).height;
  }

  get depth() {
    return self(this).depth;
  }

  get isHTMLImage() {
    return self(this).isHTMLImage;
  }

}

const DEFAULT_DEFINITION = {
  buffer: null,
  width: null,
  height: null,
  depth: 1,
};

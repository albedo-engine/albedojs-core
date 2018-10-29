const JSPrivateAttributes = new WeakMap();
const self = (key) => {
  return JSPrivateAttributes.get(key);
};

export class TextureData {

  constructor(buffer, width, height, depth) {

    JSPrivateAttributes.set(this, {
      buffer: buffer || null,
      width: width || 0,
      height: height || 0,
      depth: depth || 1
    });

    self(this).isHTMLImage = false;

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

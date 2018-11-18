const JSPrivateAttributes = new WeakMap();
const self = (key) => { return JSPrivateAttributes.get(key); };

export class TextureData {

  constructor(texture, buffer, width, height, depth) {
    this.updateRegion = {
      x: 0, y: 0, z: 0,
      width: null, height: null, depth: null
    };
    this.dirty = true;

    JSPrivateAttributes.set(this, {
      buffer: buffer || null,
      width: width || 0,
      height: height || 0,
      depth: depth || 1,
      isHTMLImage: false
    });
    
    this.__dirtyData = true;
    this.__texture = texture;

    this.setUpdateRegion(0, 0, 0, self(this).width, self(this).height, self(this).depth);
  }

  setUpdateRegion(x, y, z, width, height, depth) {
    this.setUpdateRegionXYZ(x, y, z);
    this.setUpdateRegionDim(width, height, depth);
  }

  setUpdateRegionXYZ(x, y, z) {
    this.updateRegion.x = x;
    this.updateRegion.y = y;
    this.updateRegion.z = z;
    this.dirty = true;
  }

  setUpdateRegionDim(width, height, depth) {
    this.updateRegion.width = width;
    this.updateRegion.height = height;
    this.updateRegion.depth = depth;
    this.dirty = true;
  }

  set buffer(buffer) {
    const isHTMLImage = buffer instanceof Image;
    if (isHTMLImage) {
      self(this).width = buffer.width;
      self(this).height = buffer.height;
    }
    self(this).buffer = buffer;
    self(this).isHTMLImage = isHTMLImage;
    this.__setDirty();
  }

  get buffer() {
    return self(this).buffer;
  }

  set width(width) {
    self(this).width = width;
    this.__setDirty();
  }

  get width() {
    return self(this).width;
  }

  set height(height) {
    self(this).height = height;
    this.__setDirty();
  }

  get height() {
    return self(this).height;
  }

  set depth(depth) {
    self(this).depth = depth;
    this.__setDirty();
  }

  get depth() {
    return self(this).depth;
  }

  get isHTMLImage() {
    return self(this).isHTMLImage;
  }

  __setDirty() {
    this.__dirtyData = true;
    this.__texture.__dirty = true;
  }

}

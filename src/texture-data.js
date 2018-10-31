const JSPrivateAttributes = new WeakMap();
const self = (key) => { return JSPrivateAttributes.get(key); };

export class TextureData {

  constructor(buffer, width, height, depth) {

    JSPrivateAttributes.set(this, {
      buffer: buffer || null,
      width: width || 0,
      height: height || 0,
      depth: depth || 1,
      updateRegion: {
        x: 0, y: 0, z: 0,
        width: null, height: null, depth: null
      }
    });

    self(this).isHTMLImage = false;

    if (buffer instanceof Image) {
      self(this).width = buffer.width;
      self(this).height = buffer.height;
      self(this).isHTMLImage = true;
    }

    this.setUpdateRegion(0, 0, 0, self(this).width, self(this).height, self(this).depth);
  }

  setUpdateRegion(x, y, z, width, height, depth) {
    this.setUpdateRegionXYZ(x, y, z);
    this.setUpdateRegionDim(width, height, depth);
  }

  setUpdateRegionXYZ(x, y, z) {
    const updateRegion = self(this).updateRegion;
    updateRegion.x = x;
    updateRegion.y = y;
    updateRegion.z = z;
  }

  setUpdateRegionDim(width, height, depth) {
    const updateRegion = self(this).updateRegion;
    updateRegion.width = width;
    updateRegion.height = height;
    updateRegion.depth = depth;
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

  get updateRegion() {
    return self(this).updateRegion;
  }

  get isHTMLImage() {
    return self(this).isHTMLImage;
  }

}

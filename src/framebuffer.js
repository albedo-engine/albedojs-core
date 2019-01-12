const JSPrivateAttributes = new WeakMap();
const self = (key) => { return JSPrivateAttributes.get(key); };

export class Framebuffer {

  constructor() {
    JSPrivateAttributes.set(this, { attachments: {} });

    this.dirty = true;
  }

  attach(point, object) {
    // TODO: Check that nothing is attached.
    this.attachments[point] = object;
    return this;
  }

  get attachments() {
    return self(this).attachments;
  }

}

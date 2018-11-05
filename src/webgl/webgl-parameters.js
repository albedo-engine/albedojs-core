const JSPrivateAttributes = new WeakMap();
const self = (key) => { return JSPrivateAttributes.get(key); };

export class WebGLParameters {

  constructor() {
    JSPrivateAttributes.set(this, {
      maxTextureSize: 0
    });
  }

  requestDefaultParams_(gl) {
    self(this).maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  }

}

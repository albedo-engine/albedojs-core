export class WebGLContext {

  constructor(options) {
    if (!options.canvas)
      throw new Error(`Renderer.ctor(): ${ERROR.MISSING_CANVAS}`);

    this._gl = options.canvas.getContext(`webgl2`);

    this._verbose = {};
    this._verbose.name = options.name || DEFAULT_NAME;
    this._verbose.logAll = options.verbose || false;
  }

  createVAO() {

  }

  createVBO() {

  }

  createProgram() {

  }

  draw() {

  }

  get gl() {
    return this._gl;
  }

}

const DEFAULT_NAME = `Albedo.WebGLContext`;
const ERROR = {
  MISSING_CANVAS: `no canvas provided.`
};

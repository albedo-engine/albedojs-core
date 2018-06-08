import { InternalRenderer } from 'renderer-impl';

export class Renderer {

  constructor(options) {
    if (!options.canvas)
      throw new Error(`Renderer.ctor(): ${ERROR.MISSING_CANVAS}`);

    this.gl = options.canvas.getContext(`webgl2`);

    this._verbose = {};
    this._verbose.name = options.name || DEFAULT_NAME;
    this._verbose.logAll = options.verbose || false;

    this._internal = new InternalRenderer(this.gl, this._verbose);
  }

  render(attributes, program) {
    this._internal.render(attributes, program);
  }

  set verbose(flag) {
    this._verbose.logAll = flag;
  }

}

const OBJ_CTOR = {}.constructor;

const DEFAULT_NAME = `Albedo.Renderer`;

const ERROR = {
  MISSING_CANVAS: `no canvas provided.`
};
